import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useUser } from '/context/api'

function ProfileModal({show, userId, onClose}) {

    const { user, isLoadingEvents, isErrorEvents } = useUser(userId)

    return (
        <>
        { user ?
            <Modal show={show} onHide={onClose} >
                <Modal.Body>
                    <div className="user-details-main">
                        <img src={user.profile_image} alt="" />
                        <h3>{user.username}</h3>
                        <span>{user.city}, {user.state}</span>
                        <p>{user.about}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            : <></>
        }
        </>
    )
}

export default ProfileModal