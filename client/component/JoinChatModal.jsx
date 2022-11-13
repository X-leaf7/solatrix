import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { EVENT_DETAILS,  SET_USER_TEAM} from '/context/AppUrl'

function JoinChatModal({show, selectedEvent, onClose}) {

    const [getTeamName, setTeamName] = useState('home')

    function getRadioButtonValue(e) {
        const { value } = e.target
        setTeamName(value)
    }

    function goToRoom() {
        Router.push({
            pathname: '/[Room]',
            query: { Room: selectedEvent.slug },
        })
    }

    const setup = async () => {
        setShowCreateChat(false)
        const response = await fetch(EVENT_DETAILS + selectedEvent.id, {
            method: 'get',
        })
            .then(data => data)
            .catch(err => console.log(err))
        const data = await response.json();
        console.log("upper", data)
        if (data.statusCode === 200) {
            let eventAwayUser = []
            let eventHomeUser = []

            if (data.data.event.awayuser !== null) {
                eventAwayUser = data.data.event.awayuser
            }
            if (data.data.event.homeuser !== null) {
                eventHomeUser = data.data.event.homeuser
            }

            const userData = Cookies.get('userInfo')
            const user = JSON.parse(userData)

            if (eventAwayUser.indexOf((user.id).toString()) !== -1) {
                let obj = {
                    id: selectedEvent.id,
                    selectTeamName: 'away'
                }
                console.log("away", `${selectedEvent.home_team.name}-at-${selectedEvent.away_team.name}`)

                Cookies.set('selectEventData', JSON.stringify(obj))
                goToRoom()
            } else if (eventHomeUser.indexOf((user.id).toString()) !== -1) {
                let obj = {
                    id: selectedEvent.id,
                    selectTeamName: 'home'
                }
                Cookies.set('selectEventData', JSON.stringify(obj))
                goToRoom()
            } else {
                setEvData(data.data)
                setShow(true)
            }
        } else {
            swal("Error", "Something is wrong. Please try again.", "error")
            return false
        }
    };

    const joinRoom = async () => {
        const userData = Cookies.get('userInfo')
        const user = JSON.parse(userData)
        var myHeaders = new Headers()
        myHeaders.append("Cookie", "connect.sid=s%3AQqaR6YuqRkwsY70BV5RPZvDv6mWq_nuq.P5kBBRn2qxq9hOpDRFQkifzWW7qAdRKJDxkkHFRJ3Kw")

        var formdata = new FormData()
        formdata.append("roomID", selectedEvent.room_id)
        formdata.append("userID", user.id)
        formdata.append("selectedTeam", getTeamName)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        }

        fetch(SET_USER_TEAM, requestOptions)
            .then(response => response.json())
            .then(result => {
                goToRoom()
            })
            .catch(error => console.log('error', error));
            setSelectedTeam(
            {
                id: selectedEvent.event.id,
                selectTeamName: getTeamName
            }
        )
    }

    return (
        <Modal centered id={selectedEvent.id} show={show} onHide={onClose}>
            <Modal.Header >
                <Modal.Title>Join the Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form id="post-form" method="POST" action="#">
                    <label><strong>Chat Room Name</strong></label>
                    <p className="text-left mb-3">{selectedEvent.away_team.name} at {selectedEvent.home_team.name}</p>
                    <label><strong>Which team are you cheering for?</strong></label>
                    <div>
                        <div className='pb-1'>
                            <input type="radio" name="user_team_selection" id="user_team_selection" value="home" checked={getTeamName === 'home'} onChange={getRadioButtonValue} />
                            <label className='ps-1'> {selectedEvent.home_team.name}</label>
                        </div>
                        <div className='pb-2'>
                            <input type="radio" name="user_team_selection" id="user_team_selection" value="away" checked={getTeamName === 'away'} onChange={getRadioButtonValue} />
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