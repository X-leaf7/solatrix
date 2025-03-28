"use client"

import type React from "react"

import { useContext, useRef, useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/dsm"
import Settings from "@/components/settings/Settings"
import { ModalContext } from "@/shared/providers/ModalContext"
import { UserSettingsContext } from "@/shared/providers/UserSettingsContext"

// Define types based on the Amazon IVS Web Broadcast SDK
// See: https://aws.github.io/amazon-ivs-web-broadcast/docs/sdk-reference

// Resolution configuration
interface Resolution {
  width: number
  height: number
}

// Stream configuration
interface StreamConfig {
  maxBitrate?: number
  maxFramerate?: number
  maxResolution?: Resolution
  [key: string]: any
}

// Broadcast client configuration
interface BroadcastClientConfig {
  streamConfig: StreamConfig
  [key: string]: any
}

// Event types
type BroadcastEvent = string
type EventCallback = (...args: any[]) => void

// Broadcast client interface
interface IVSBroadcastClient {
  on(event: BroadcastEvent, callback: EventCallback): void
  off(event: BroadcastEvent, callback: EventCallback): void
  startBroadcast(streamKey?: string, ingestEndpoint?: string): Promise<void>
  stopBroadcast(): Promise<void>
  delete(): void
  [key: string]: any
}

// Main SDK interface
interface IVSBroadcastSDK {
  create(config: BroadcastClientConfig): IVSBroadcastClient
  isSupported(): boolean
  BroadcastClientEvents: {
    CONNECTION_STATE_CHANGE: BroadcastEvent
    ACTIVE_STATE_CHANGE: BroadcastEvent
    ERROR: BroadcastEvent
    [key: string]: BroadcastEvent
  }
  __version: string
  [key: string]: any
}

// Error interface
interface ClientError {
  code: number
  message: string
  [key: string]: any
}

// Connection state interface
interface ConnectionState {
  state?: string
  [key: string]: any
}

// Context interfaces
// interface UserSettingsContextType {
//   streamKey: string
//   ingestEndpoint: string
//   [key: string]: any
// }

// interface ModalContextType {
//   toggleModal: () => void
//   setModalProps: (props: any) => void
//   setModalContent: (content: React.ReactNode) => void
// }

// Function parameter interfaces
interface CreateBroadcastClientParams {
  config: StreamConfig
}

interface RestartBroadcastClientParams {
  config: StreamConfig
  ingestEndpoint: string
}

interface StartStreamParams {
  client: IVSBroadcastClient
  streamKey?: string
  ingestEndpoint?: string
}

// Hook return type
export interface UseBroadcastSDKReturn {
  IVSBroadcastClientRef: React.MutableRefObject<IVSBroadcastSDK | undefined>
  sdkVersionRef: React.MutableRefObject<string | undefined>
  broadcastClientMounted: boolean | Date
  broadcastClientRef: React.MutableRefObject<IVSBroadcastClient | undefined>
  connectionState: ConnectionState | undefined
  isLive: boolean
  isSupported: boolean
  streamPending: boolean
  broadcastStartTimeRef: React.MutableRefObject<Date | undefined>
  broadcastErrors: ClientError[]
  toggleStream: () => Promise<void>
  stopStream: (client: IVSBroadcastClient) => Promise<void>
  startStream: (params: StartStreamParams) => Promise<void>
  createBroadcastClient: (params: CreateBroadcastClientParams) => Promise<IVSBroadcastClient>
  destroyBroadcastClient: (client: IVSBroadcastClient) => void
  restartBroadcastClient: (params: RestartBroadcastClientParams) => Promise<IVSBroadcastClient>
}

const useBroadcastSDK = (): UseBroadcastSDKReturn => {
  
  const { streamKey, ingestEndpoint } = useContext(UserSettingsContext)
  const { toggleModal, setModalProps, setModalContent } = useContext(ModalContext)

  const [broadcastClientMounted, setBroadcastClientMounted] = useState<boolean | Date>(false)
  const [isLive, setIsLive] = useState<boolean>(false)
  const [isSupported, setIsSupported] = useState<boolean>(true)
  const [streamPending, setStreamPending] = useState<boolean>(false)
  const [connectionState, setConnectionState] = useState<ConnectionState | undefined>(undefined)
  const [clientErrors, setClientErrors] = useState<ClientError[]>([])

  const IVSBroadcastClientRef = useRef<IVSBroadcastSDK>(undefined)
  const broadcastClientRef = useRef<IVSBroadcastClient>(undefined)
  const broadcastClientEventsRef = useRef<any>(undefined)
  const startTimeRef = useRef<Date>(undefined)
  const sdkVersionRef = useRef<string>(undefined)

  const importBroadcastSDK = async (): Promise<IVSBroadcastSDK> => {
    try {
      // Import the SDK and cast it to our interface
      const module = await import("amazon-ivs-web-broadcast")
      const sdk = module.default as unknown as IVSBroadcastSDK

      broadcastClientEventsRef.current = sdk.BroadcastClientEvents
      IVSBroadcastClientRef.current = sdk
      return sdk
    } catch (error) {
      console.error("Failed to import Amazon IVS Web Broadcast SDK:", error)
      throw error
    }
  }

  const createBroadcastClient = async ({
    config: streamConfig,
  }: CreateBroadcastClientParams): Promise<IVSBroadcastClient> => {
    const IVSBroadcastClient = IVSBroadcastClientRef.current
      ? IVSBroadcastClientRef.current
      : await importBroadcastSDK()

    const client = IVSBroadcastClient.create({
      streamConfig,
    })

    broadcastClientRef.current = client
    sdkVersionRef.current = IVSBroadcastClient.__version
    setIsSupported(IVSBroadcastClient.isSupported())
    attachBroadcastClientListeners(client)

    // Hack to get fix react state update issue
    setBroadcastClientMounted(new Date())

    return client
  }

  const destroyBroadcastClient = (client: IVSBroadcastClient): void => {
    detachBroadcastClientListeners(client)
    client.delete()
    setBroadcastClientMounted(false)
  }

  const attachBroadcastClientListeners = (client: IVSBroadcastClient): void => {
    client.on(broadcastClientEventsRef.current.CONNECTION_STATE_CHANGE, handleConnectionStateChange)
    client.on(broadcastClientEventsRef.current.ACTIVE_STATE_CHANGE, handleActiveStateChange)
    client.on(broadcastClientEventsRef.current.ERROR, handleClientError)
  }

  const detachBroadcastClientListeners = (client: IVSBroadcastClient): void => {
    client.off(broadcastClientEventsRef.current.CONNECTION_STATE_CHANGE, handleConnectionStateChange)
    client.off(broadcastClientEventsRef.current.ACTIVE_STATE_CHANGE, handleActiveStateChange)
    client.off(broadcastClientEventsRef.current.ERROR, handleClientError)
  }

  const restartBroadcastClient = async ({
    config,
    ingestEndpoint,
  }: RestartBroadcastClientParams): Promise<IVSBroadcastClient> => {
    if (isLive && broadcastClientRef.current) stopStream(broadcastClientRef.current)
    if (broadcastClientRef.current) destroyBroadcastClient(broadcastClientRef.current)

    const newClient = await createBroadcastClient({
      config,
    })

    return newClient
  }

  const handleActiveStateChange = (active: boolean): void => {
    setIsLive(active)
  }

  const handleConnectionStateChange = (state: ConnectionState): void => {
    setConnectionState(state)
  }

  const handleClientError = (clientError: ClientError): void => {
    setClientErrors((prevState) => [...prevState, clientError])
  }

  const stopStream = async (client: IVSBroadcastClient): Promise<void> => {
    try {
      setStreamPending(true)
      toast.loading("Stopping stream...", { id: "STREAM_STATUS" })
      await client.stopBroadcast()
      startTimeRef.current = undefined
      toast.success("Stopped stream", { id: "STREAM_STATUS" })
    } catch (err) {
      console.error(err)
      toast.error("Failed to stop stream", {
        id: "STREAM_STATUS",
      })
    } finally {
      setStreamPending(false)
      toast.remove("STREAM_TIMEOUT")
    }
  }

  const startStream = async ({ client, streamKey, ingestEndpoint }: StartStreamParams): Promise<void> => {
    let streamTimeout: NodeJS.Timeout

    try {
      toast.loading(
        (t) => {
          return (
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{ paddingRight: "1rem" }}>Starting stream...</span>
              <Button
                intent="secondary"
                size="small"
                onClick={() => {
                  toast.dismiss(t.id)
                  stopStream(client)
                }}
              >
                Stop
              </Button>
            </span>
          )
        },
        { id: "STREAM_STATUS" },
      )
      setStreamPending(true)

      streamTimeout = setTimeout(() => {
        toast(
          (t) => {
            return (
              <span style={{ color: "rgba(0, 0, 0, 0.5)" }}>
                It's taking longer than usual to start the stream. If you are on a VPN, check if port 4443 is unblocked
                and try again.
              </span>
            )
          },
          { id: "STREAM_TIMEOUT", duration: Number.POSITIVE_INFINITY, icon: "⚠️" },
        )
      }, 5000)

      await client.startBroadcast(streamKey, ingestEndpoint)
      clearTimeout(streamTimeout)
      startTimeRef.current = new Date()
      toast.success("Started stream.", { id: "STREAM_STATUS" })
    } catch (err: any) {
      clearTimeout(streamTimeout!)
      console.error(err)

      if (err.code === 18000) {
        // Stream key invalid error
        // See: https://aws.github.io/amazon-ivs-web-broadcast/docs/v1.3.1/sdk-reference/namespaces/Errors?_highlight=streamkeyinvalidcharerror#stream_key_invalid_char_error
        toast(
          (t) => {
            return (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ paddingRight: "1rem", flexGrow: 1 }}>
                  <strong>Invalid stream key.</strong> Enter a valid stream key to continue.
                </span>
                <span style={{ flexShrink: 0 }}>
                  <Button
                    intent="primary"
                    size="small"
                    onClick={() => {
                      toast.dismiss(t.id)
                      setModalProps({
                        type: "full",
                      })
                      setModalContent(<Settings />)
                      toggleModal()
                    }}
                  >
                    Open settings
                  </Button>
                </span>
              </div>
            )
          },
          {
            id: "STREAM_STATUS",
            position: "bottom-center",
            duration: Number.POSITIVE_INFINITY,
            style: {
              minWidth: "24rem",
              width: "100%",
            },
          },
        )
      } else {
        toast.error("Failed to start stream", {
          id: "STREAM_STATUS",
        })
      }
    } finally {
      toast.remove("STREAM_TIMEOUT")
      setStreamPending(false)
    }
  }

  const toggleStream = async (): Promise<void> => {
    if (isLive && broadcastClientRef.current) {
      await stopStream(broadcastClientRef.current)
    } else if (broadcastClientRef.current) {
      await startStream({
        client: broadcastClientRef.current,
        streamKey,
        ingestEndpoint,
      })
    }
  }

  return {
    IVSBroadcastClientRef,
    sdkVersionRef,
    broadcastClientMounted,
    broadcastClientRef,
    connectionState,
    isLive,
    isSupported,
    streamPending,
    broadcastStartTimeRef: startTimeRef,
    broadcastErrors: clientErrors,
    toggleStream,
    stopStream,
    startStream,
    createBroadcastClient,
    destroyBroadcastClient,
    restartBroadcastClient,
  }
}

export default useBroadcastSDK

