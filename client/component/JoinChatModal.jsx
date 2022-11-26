import React, { useState, useCallback } from 'react'
import Router from 'next/router'
import { Button, Modal } from 'react-bootstrap'
import { Formik, Form, Field } from "formik"
import Cookies from 'js-cookie'
import { ATTENDEES } from '/context/AppUrl'
import { post } from '/context/api'

function JoinChatModal({show, selectedEvent, onClose}) {

    const [teamId, setTeamId] = useState(null)
    const [noTeamError, setNoTeamError] = useState(null)

    function getRadioButtonValue(e) {
        const { value } = e.target
        setTeamId(value)
    }

    function goToRoom() {
        Router.push({
            pathname: '/event/[Room]',
            query: { Room: selectedEvent.slug },
        })
        onClose()
    }

    const joinRoom = useCallback(async () => {
        if (!teamId) {
            setNoTeamError(true)
            return
        }
        const userData = Cookies.get('userInfo')
        const user = JSON.parse(userData)

        post(ATTENDEES, {
            'user': user.id,
            'event': selectedEvent.id,
            'chosen_team': teamId
        }, (error) => {
            const maxAttendees = (
                error.response &&
                error.response.data &&
                error.response.data.non_field_errors &&
                error.response.data.non_field_errors[0]
            )
            if (maxAttendees == 'Maximum Allowed Attendees') {
                Router.push('/')
            }
        }).then(goToRoom)
    }, [teamId])

    return (
        <Modal centered id={selectedEvent.id} show={show} onHide={onClose}>
            <Modal.Header >
                <Modal.Title>Join the Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form id="post-form" method="POST" action="#">
                    <label><strong>Chat Room Name</strong></label>
                    <p className="text-left mb-3">{selectedEvent.name}</p>
                    <label><strong>Which team are you cheering for?</strong></label>
                    {noTeamError && <p className="error-msg">Please choose a side.</p>}
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