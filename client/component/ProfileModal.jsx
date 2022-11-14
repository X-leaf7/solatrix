import React, { useState, useEffect, useContext } from 'react'
import { Button, Modal } from 'react-bootstrap';

function ProfileModal({show, userId, onClose}) {

    const [user, setUser] = useState(null);

    useEffect(async () => {
        if (userId) {
            const response = await fetch(USER_DETAIL + userId, {
                method: 'get',
            }).catch(err => console.log(err))

            const data = await response.json();
            if (response.status === 200) {
                if (data.profile_image == null) {
                    data.profile_image = 'img/profile_img.png'
                }
                setUser(data)
            }
        }
    }, [userId]);

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