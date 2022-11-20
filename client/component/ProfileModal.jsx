import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Avatar } from "@material-ui/core";
import { useUser } from '/context/api'

function ProfileModal({show, userId, onClose}) {

    const { user, isLoadingEvents, isErrorEvents } = useUser(userId)

    return (
        <>
        { user ?
            <Modal show={show} onHide={onClose} >
                <Modal.Body>
                    <div className="user-details-main">
                        <Avatar src={user.profile_image} alt={user.username} style={{ height: '150px', width: '150px', margin: 'auto' }} />
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