import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { COPY_EVENT } from '/context/AppUrl'
import { post } from '/context/api'

function CreateChatModal({show, selectedEvent, onClose}) {

    const [newEvent, setNewEvent] = useState(null)
    const [eventUrl, setEventUrl] = useState(null)
    const [copied, setCopied] = useState(null)

    const handleClickCreateChat = useCallback(async () => {
        post(COPY_EVENT, {source_event_id: selectedEvent.id}).then((response) => {
            if (response && response.status == 201) {
                setNewEvent(response.data.new_event)
                setEventUrl(`${location.protocol}//${location.host}/event/${response.data.new_event.slug}/`)
            }
            else {
                swal("Error", "There was a problem creating your private room. Check your Account page to see if you already have one for this event.", "error")
            }
        })
    }, [selectedEvent])


    return (
        <Modal centered id="1" className="S text-center" show={show} onHide={onClose}>
            <Modal.Header className="border-0 justify-content-center">
                <Modal.Title><b>Create Private Chat?</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form id="post-form" method="POST" action="#">
                    <label><strong>A private room with a unique link will be created with you as the host.</strong></label>
                    <p className="text-left mb-3">You and your guests can chat amongst yourselves during the game.</p>
                    <p className="text-left mb-3">You can invite up-to 12 guests by sharing the link with them.</p>
                    {
                        newEvent && eventUrl ?
                            <>
                                <div>
                                    <p>
                                        <b>
                                            <a href={eventUrl}>{eventUrl}</a>
                                        </b>
                                        <CopyToClipboard text={eventUrl} onCopy={() => setCopied(true)}>
                                            <span className="fa-stack">
                                                <i className='fa-clone fa-stack-1x'></i>
                                                { copied && <i className='fa-check fa-stack-2x' style={{ color: 'green' }}></i>}
                                            </span>
                                        </CopyToClipboard>
                                    </p>
                                    <p>Share this link with your friends! You can find this link in your Account page as well.</p>

                                </div>
                            </>
                        :
                            <>
                                <Button className="create-chat text-dark" onClick={() => handleClickCreateChat()}>Create Chat</Button>
                            </>
                    }
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default CreateChatModal