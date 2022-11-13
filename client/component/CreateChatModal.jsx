import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

function CreateChatModal({show, selectedEvent, onClose}) {

    const handleClickCreateChat = async () => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = "<div><p> <b> https://split-side.com/</b> <i class='ms-3 fa-regular fa-clone'></i></p> <p>You can find this link in your Account/Events page as well</p></div>"
        swal({
            title : "Success",
            content: wrapper,
            icon: "success"
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