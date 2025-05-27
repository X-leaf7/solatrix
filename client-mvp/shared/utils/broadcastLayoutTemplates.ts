import type { Template } from "@/shared/hooks/useBroadcastLayout"

// Update the ResizeConfig interface to match what's used in Slot
interface ResizeConfig {
  mode: "FILL" | "FIT"
  naturalSize: {
    width: number
    height: number
  }
}

// Update the MixerDevice interface to be more specific
interface MixerDevice {
  deviceName: string
  audioStream: MediaStream
}

// Update the DefaultTemplateParams interface
interface DefaultTemplateParams {
  cameraContent: MediaStream | HTMLCanvasElement
  cameraId: string
  cameraVisible?: boolean
  cameraIsCanvas?: boolean
  cameraResize?: ResizeConfig
  cameraOffContent: string
  micMutedContent: string
  showMuteIcon?: boolean
  backgroundContent: string
  micId: string
  micContent: MediaStream
}

// Update the ScreenshareTemplateParams interface
interface ScreenshareTemplateParams extends DefaultTemplateParams {
  screenShareContent: MediaStream
  screenShareId: string
  screenAudioContent: MediaStream
  screenAudioId: string
}

export const DEFAULT_TEMPLATE = ({
  cameraContent,
  cameraId,
  cameraVisible = true,
  cameraIsCanvas = false,
  cameraResize = undefined,
  cameraOffContent,
  micMutedContent,
  showMuteIcon = false,
  backgroundContent,
  micId,
  micContent,
}: DefaultTemplateParams): Template => {
  return {
    // name: "defaultTemplate",
    slots: [
      {
        name: "micMutedIcon",
        type: "image",
        dimensions: {
          x: "CANVAS_WIDTH - LAYER_WIDTH - LAYER_WIDTH * 0.5",
          y: "LAYER_WIDTH * 0.5",
          z: 4,
          width: "CANVAS_HEIGHT * 0.06",
          height: "CANVAS_HEIGHT * 0.06",
        },
        // dimensions: {
        //   x: 100,
        //   y: 100,
        //   z: 4,
        //   width: 100,
        //   height: 100,
        // },
        visible: showMuteIcon,
        content: micMutedContent,
      },
      {
        name: cameraId,
        type: cameraIsCanvas ? "video" : "device",
        dimensions: {
          x: 0,
          y: 0,
          z: 2,
          width: "CANVAS_WIDTH",
          height: "CANVAS_HEIGHT",
        },
        // dimensions: {
        //   x: 0,
        //   y: 0,
        //   z: 2,
        //   width: 100,
        //   height: 100,
        // },
        visible: cameraVisible,
        resize: cameraResize,
        content: cameraContent,
      },
      {
        name: "cameraHiddenIcon",
        type: "image",
        dimensions: {
          x: "CANVAS_WIDTH * 0.5 - LAYER_WIDTH * 0.5",
          y: "CANVAS_HEIGHT * 0.5 - LAYER_HEIGHT * 0.5",
          z: 1,
          width: "CANVAS_WIDTH * 0.25",
          height: "CANVAS_HEIGHT * 0.25",
        },
        // dimensions: {
        //   x: 0,
        //   y: 0,
        //   z: 2,
        //   width: 100,
        //   height: 100,
        // },
        visible: true,
        content: cameraOffContent,
      },
      {
        name: "background",
        type: "image",
        dimensions: {
          x: 0,
          y: 0,
          z: 0,
          width: "CANVAS_WIDTH",
          height: "CANVAS_HEIGHT",
        },
        // dimensions: {
        //   x: 0,
        //   y: 0,
        //   z: 2,
        //   width: 100,
        //   height: 100,
        // },
        visible: true,
        content: backgroundContent,
      },
    ],
    mixer: [
      {
        deviceName: micId,
        audioStream: micContent,
      },
    ],
    update: ({
      cameraContent: _cameraContent,
      cameraId: _cameraId,
      cameraVisible: _cameraVisible,
      cameraIsCanvas: _cameraIsCanvas,
      cameraResize: _cameraResize,
      cameraOffContent: _cameraOffContent,
      micMutedContent: _micMutedContent,
      showMuteIcon: _showMuteIcon,
      backgroundContent: _backgroundContent,
      micId: _micId,
      micContent: _micContent,
    }: Partial<DefaultTemplateParams>): Template => {
      const newProps: DefaultTemplateParams = {
        cameraContent: _cameraContent || cameraContent,
        cameraId: _cameraId || cameraId,
        cameraVisible: _cameraVisible !== undefined ? _cameraVisible : cameraVisible,
        cameraResize: _cameraResize || cameraResize,
        cameraIsCanvas: _cameraIsCanvas !== undefined ? _cameraIsCanvas : cameraIsCanvas,
        cameraOffContent: _cameraOffContent || cameraOffContent,
        micMutedContent: _micMutedContent || micMutedContent,
        showMuteIcon: _showMuteIcon !== undefined ? _showMuteIcon : showMuteIcon,
        backgroundContent: _backgroundContent || backgroundContent,
        micContent: _micContent || micContent,
        micId: _micId || micId,
      }
      return DEFAULT_TEMPLATE(newProps)
    },
  }
}

export const SCREENSHARE_TEMPLATE = ({
  cameraContent,
  cameraId,
  cameraVisible = true,
  cameraIsCanvas = false,
  screenShareContent,
  screenShareId,
  cameraOffContent,
  micMutedContent,
  showMuteIcon = false,
  backgroundContent,
  micContent,
  micId,
  screenAudioContent,
  screenAudioId,
}: ScreenshareTemplateParams): Template => {
  return {
    // name: "screenshareTemplate",
    slots: [
      {
        name: "micMutedIcon",
        type: "image",
        dimensions: {
          x: "CANVAS_WIDTH - LAYER_WIDTH - LAYER_WIDTH * 0.5",
          y: "LAYER_WIDTH * 0.5",
          z: 4,
          width: "CANVAS_HEIGHT * 0.06",
          height: "CANVAS_HEIGHT * 0.06",
        },
        // dimensions: {
        //   x: 0,
        //   y: 0,
        //   z: 2,
        //   width: 100,
        //   height: 100,
        // },
        visible: showMuteIcon,
        content: micMutedContent,
      },
      {
        name: cameraId,
        type: cameraIsCanvas ? "video" : "device",
        dimensions: {
          x: "20",
          y: "CANVAS_HEIGHT - LAYER_HEIGHT - 20",
          z: 4,
          width: "CANVAS_WIDTH * 0.2",
          height: "CANVAS_HEIGHT * 0.2",
        },
        // dimensions: {
        //   x: 0,
        //   y: 0,
        //   z: 2,
        //   width: 100,
        //   height: 100,
        // },
        visible: cameraVisible,
        content: cameraContent,
      },
      {
        name: screenShareId,
        type: "device",
        dimensions: {
          x: 0,
          y: 0,
          z: 2,
          width: "CANVAS_WIDTH",
          height: "CANVAS_HEIGHT",
        },
        // dimensions: {
        //   x: 0,
        //   y: 0,
        //   z: 2,
        //   width: 100,
        //   height: 100,
        // },
        visible: true,
        content: screenShareContent,
      },
      {
        name: "background",
        type: "image",
        dimensions: {
          x: 0,
          y: 0,
          z: 0,
          width: "CANVAS_WIDTH",
          height: "CANVAS_HEIGHT",
        },
        // dimensions: {
        //   x: 0,
        //   y: 0,
        //   z: 2,
        //   width: 100,
        //   height: 100,
        // },
        visible: true,
        content: backgroundContent,
      },
    ],
    mixer: [
      {
        deviceName: micId,
        audioStream: micContent,
      },
      {
        deviceName: screenAudioId,
        audioStream: screenAudioContent,
      },
    ],
    update: ({
      cameraContent: _cameraContent,
      cameraId: _cameraId,
      cameraVisible: _cameraVisible,
      cameraIsCanvas: _cameraIsCanvas,
      screenShareContent: _screenShareContent,
      screenShareId: _screenShareId,
      cameraOffContent: _cameraOffContent,
      micMutedContent: _micMutedContent,
      showMuteIcon: _showMuteIcon,
      backgroundContent: _backgroundContent,
      micContent: _micContent,
      micId: _micId,
      screenAudioContent: _screenAudioContent,
      screenAudioId: _screenAudioId,
    }: Partial<ScreenshareTemplateParams>): Template => {
      const newProps: ScreenshareTemplateParams = {
        cameraContent: _cameraContent || cameraContent,
        cameraId: _cameraId || cameraId,
        cameraVisible: _cameraVisible !== undefined ? _cameraVisible : cameraVisible,
        cameraIsCanvas: _cameraIsCanvas !== undefined ? _cameraIsCanvas : cameraIsCanvas,
        screenShareContent: _screenShareContent || screenShareContent,
        screenShareId: _screenShareId || screenShareId,
        cameraOffContent: _cameraOffContent || cameraOffContent,
        micMutedContent: _micMutedContent || micMutedContent,
        showMuteIcon: _showMuteIcon !== undefined ? _showMuteIcon : showMuteIcon,
        backgroundContent: _backgroundContent || backgroundContent,
        micId: _micId || micId,
        micContent: _micContent || micContent,
        screenAudioId: _screenAudioId || screenAudioId,
        screenAudioContent: _screenAudioContent || screenAudioContent,
      }
      return SCREENSHARE_TEMPLATE(newProps)
    },
  }
}

export type { DefaultTemplateParams, ScreenshareTemplateParams, MixerDevice }

