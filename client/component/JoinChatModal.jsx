import React, { useState } from 'react'
import Router from 'next/router'
import { Button, Modal } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { ATTENDEES } from '/context/AppUrl'
import { getAttendance, post } from '/context/api'

function JoinChatModal({show, selectedEvent, onClose}) {

    const [getTeamId, setTeamId] = useState(null)

    function getRadioButtonValue(e) {
        const { value } = e.target
        setTeamId(value)
    }

    function goToRoom() {
        Router.push({
            pathname: '/event/[Room]',
            query: { Room: selectedEvent.slug },
        })
    }

    const joinRoom = async () => {
        const userData = Cookies.get('userInfo')
        const user = JSON.parse(userData)

        const alreadyAttending = getAttendance(user.id, selectedEvent.id)

        if (alreadyAttending) {
            goToRoom()
            return
        }

        post(ATTENDEES, {
            'user': user.id,
            'event': selectedEvent.id,
            'chosen_team': getTeamId
        }).then(goToRoom);
    }

    return (
        <Modal centered id={selectedEvent.id} show={show} onHide={onClose}>
            <Modal.Header >
                <Modal.Title>Join the Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form id="post-form" method="POST" action="#">
                    <label><strong>Chat Room Name</strong></label>
                    <p className="text-left mb-3">/{selectedEvent.host.username}/{selectedEvent.slug}</p>
                    <label><strong>Which team are you cheering for?</strong></label>
                    <div>
                        <div className='pb-1'>
                            <input type="radio" name="user_team_selection" id="user_team_selection" value={selectedEvent.home_team.id} onChange={getRadioButtonValue} />
                            <label className='ps-1'> {selectedEvent.home_team.name}</label>
                        </div>
                        <div className='pb-2'>
                            <input type="radio" name="user_team_selection" id="user_team_selection" value={selectedEvent.away_team.id} onChange={getRadioButtonValue} />
                            <label className='ps-1'> {selectedEvent.away_team.name}</label>
                        </div>
                    </div>
                    <Button onClick={joinRoom} >Enter Room</Button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default JoinChatModal