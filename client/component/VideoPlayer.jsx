import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button } from 'react-bootstrap'

async function getCamera() {
    // Use Max Width and Height
    return navigator.mediaDevices.getUserMedia({
      video: {
        width: { max: 1280 },
        height: { max: 720 }
      },
      audio: false
    });
}
  
async function getMic() {
    return navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    });
}

function VideoPlayer({attendance, isHost}) {
    const videoEl = useRef(null)
    const [stage, setStage] = useState(null)
    const [joined, setJoined] = useState(false)

    const cleanupTrack = useCallback( (track) => {
        videoEl.current.srcObject.removeTrack(track)
        track.stop()
    }, [videoEl])

    const onClickLeaveStage = useCallback(() => {
        if (stage !== null) {
            stage.leave()

            // Clean up published streams first
            stage.strategyWrapper.strategy.stageStreamsToPublish().forEach((stream) => {
                cleanupTrack(stream.mediaStreamTrack)
            });

            setStage(null)
        }

        if (videoEl.current.srcObject) {
            // Clean up any remaining tracks
            videoEl.current.srcObject.getTracks().forEach(cleanupTrack)
        }
    }, [stage, videoEl])

    useLayoutEffect(() => {
        // When the component is unounted, leave the stage
        return onClickLeaveStage
    }, [onClickLeaveStage])

    const onClickJoinStage = useCallback(async () => {
        const {
            Stage,
            LocalStageStream,
            SubscribeType,
            StageEvents,
            ConnectionState,
            StreamType
        } = await import('amazon-ivs-web-broadcast')

        videoEl.current.srcObject = new MediaStream()

        let publishStreams = []

        if (isHost) {
            let localCamera = await getCamera();
            let localMic = await getMic();

            let cameraStageStream = new LocalStageStream(localCamera.getVideoTracks()[0]);
            let micStageStream = new LocalStageStream(localMic.getAudioTracks()[0]);

            publishStreams = [
                cameraStageStream, micStageStream
            ]
        }

        const strategy = {
            stageStreamsToPublish() {
              return publishStreams;
            },
            shouldPublishParticipant() {
              return isHost;
            },
            shouldSubscribeToParticipant() {
                return SubscribeType.AUDIO_VIDEO;
            }
        };

        let theStage = new Stage(attendance.ivs_participant_token, strategy)

        theStage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_ADDED, (participant, streams) => {
        
            let streamsToDisplay = streams;
        
            if (participant.isLocal) {
              // Ensure to exclude local audio streams, otherwise echo will occur
              streamsToDisplay = streams.filter(
                (stream) => stream.streamType === StreamType.VIDEO
              )
            }

            streamsToDisplay.forEach((stream) =>
              videoEl.current.srcObject.addTrack(stream.mediaStreamTrack)
            )
        });

        theStage.on(StageEvents.STAGE_CONNECTION_STATE_CHANGED, (state) => {
            let connected = state === ConnectionState.CONNECTED;
            setJoined(connected)
        });

        theStage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_REMOVED, (participant, streams) => {
            streams.forEach((stream) =>{
                cleanupTrack(stream.mediaStreamTrack)
            })
        });

        theStage.join()

        setStage(theStage)
    }, [attendance, isHost, videoEl])

    return (<div className="row">
        {
            !joined &&
            <div className="text-center">
                <Button onClick={onClickJoinStage} variant="warning" size="lg" className="mt-5">Join Video</Button>
            </div>
        }
        {
            joined &&
            <div className="col-md-4 col-sm-12 text-center">
                <Button onClick={onClickLeaveStage} variant="warning">Leave Video</Button>
            </div>
        }
        <div className="col-md-8 col-sm-12">
            <video ref={videoEl} autoPlay playsInline disablePictureInPicture
                style={{display: joined ? 'block' : 'none' }} height="200" className="mx-auto">
            </video>
        </div>
    </div>
    )
}

export default VideoPlayer