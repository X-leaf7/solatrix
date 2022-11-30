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
            <Modal.Header className="border-0 justify-content-center" closeButton>
                <Modal.Title><b>{newEvent ? 'Success!' : 'Create Private Chat?'}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    newEvent && eventUrl ?
                        <div>
                            <div className="swal-icon swal-icon--success mt-0">
                                <span className="swal-icon--success__line swal-icon--success__line--long"></span>
                                <span className="swal-icon--success__line swal-icon--success__line--tip"></span>
                                <div className="swal-icon--success__ring"></div>
                                <div className="swal-icon--success__hide-corners"></div>
                            </div>
                            <p className="pt-2">
                                <b>
                                    <a href={eventUrl}>{eventUrl}</a>
                                </b>
                                <CopyToClipboard text={eventUrl} onCopy={() => setCopied(true)}>
                                    <span className="fa-stack">
                                        <i className='fa-regular fa-clone fa-stack-1x'></i>
                                        { copied && <i className='fa-regular fa-check fa-stack-2x' style={{ color: 'green' }}></i>}
                                    </span>
                                </CopyToClipboard>
                            </p>
                            <p>Share this link with your friends! You can find this link in your Account page as well.</p>
                        </div>
                    :
                        <div>
                            <strong>A private room with a unique link will be created with you as the host.</strong>
                            <p className="text-left mb-3">You and your guests can chat amongst yourselves during the game.</p>
                            <p className="text-left mb-3">You can invite up-to 12 guests by sharing the link with them.</p>
                            <Button className="create-chat text-dark" onClick={() => handleClickCreateChat()}>Create Chat</Button>
                        </div>
                }
            </Modal.Body>
        </Modal>
    )
}

export default CreateChatModal