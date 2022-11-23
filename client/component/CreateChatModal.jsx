import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { COPY_EVENT } from '/context/AppUrl'
import { post } from '/context/api'

function CreateChatModal({show, selectedEvent, onClose}) {

    const handleClickCreateChat = async () => {
        post(COPY_EVENT, {source_event_id: selectedEvent.id}).then((response) => {
            if (response && response.status == 201) {
                const eventUrl = `${location.protocol}//${location.host}/event/${response.data.new_event.slug}/`
                const wrapper = document.createElement('div')
                wrapper.innerHTML = `<div><p> <b><a href="${eventUrl}">${eventUrl}</a></b> <i class='ms-3 fa-regular fa-clone'></i></p> <p>Share this link with your friends! You can find this link in your Account page as well.</p></div>`
                swal({
                    title : "Success",
                    content: wrapper,
                    icon: "success"
                })
            }
            else {
                swal("Error", "There was a problem creating your private room. Check your Account page to see if you already have one for this event.", "error")
            }
        })
    }


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
                    <Button className="create-chat text-dark" onClick={() => handleClickCreateChat()}>Create Chat</Button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default CreateChatModal