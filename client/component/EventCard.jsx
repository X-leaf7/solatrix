import React, { useState, useEffect, useContext } from 'react'
import { Button } from 'react-bootstrap';
import { DateTime } from 'luxon';
import AppContext from "../context/AppContext";


function EventCard({ event }) {
    const { isLogin } = useContext(AppContext);

    const handleShowCreateChat = async() => {
        setShowCreateChat(true)
        setShow(false)
    } 

    const handleShow = async (event) => {
        setShowCreateChat(false)
        const response = await fetch(EVENT_DETAILS + event.id, {
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
                    id: event.id,
                    selectTeamName: 'away'
                }
                console.log("away", `${event.homeTeamRef.name}-at-${event.awayTeamRef.name}`)

                Cookies.set('selectEventData', JSON.stringify(obj))
                Router.push({
                    pathname: '/[Team]/[TeamID]',
                    query: { Team: `${event.homeTeamRef.name}-at-${event.awayTeamRef.name}`, TeamID: event.roomId },
                })
            } else if (eventHomeUser.indexOf((user.id).toString()) !== -1) {
                let obj = {
                    id: event.id,
                    selectTeamName: 'home'
                }
                Cookies.set('selectEventData', JSON.stringify(obj))
                Router.push({
                    pathname: '/[Team]/[TeamID]',
                    query: { Team: `${event.homeTeamRef.name}-at-${event.awayTeamRef.name}`, TeamID: event.roomId },
                })
            } else {
                setEvData(data.data)
                setShow(true)
            }
        } else {
            swal("Error", "Something is wrong. Please try again.", "error")
            return false
        }
    };

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card listing-preview">
                <div className="card-body">
                    <div className="listing-heading text-center">
                        {
                            event.home_team && <h4 className="text-primary">{event.home_team.name} at {event.away_team.name}</h4>
                        }

                        <p className="text-center my-2">{DateTime.fromISO(event.lobby_start_time).toLocaleString()}</p>
                        <p className="text-center mt-2 mb-4">Hosted by:  {event.host.username}</p>
                        {/* <hr /> */}
                        <div className="d-flex justify-content-evenly ">
                            {
                                <Button className='create-chat' variant="outline-dark" onClick={() => handleShowCreateChat(event)}>
                                    Create Chat
                                </Button>
                            }
                                            
                            {
                                !isLogin ?
                                    <Link href="/login"><button className="btn btn-outline-dark join-chat">Join Chat</button></Link>
                                :
                                    <Button className='join-chat' variant="outline-dark" onClick={() => handleShow(event)}>Join Event Chat</Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard