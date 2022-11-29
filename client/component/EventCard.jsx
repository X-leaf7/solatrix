import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import { Button } from 'react-bootstrap'
import { DateTime } from 'luxon'
import Cookies from 'js-cookie'
import AppContext from '../context/AppContext'
import { getAttendance } from '/context/api'



function EventCard({ event, setSelected, showJoin, showCreate, user }) {
    const { checkLogin } = useContext(AppContext);

    const dateFormat = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }

    const timeFormat = {
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
    }

    function goToRoom() {
        Router.push({
            pathname: '/event/[Room]',
            query: { Room: event.slug },
        })
    }

    const checkAttendance = async (nextAction) => {
        const userInfo = JSON.parse(Cookies.get("userInfo"))
        const alreadyAttending = await getAttendance(userInfo.id, event.id)

        if (alreadyAttending) {
            goToRoom()
        }
        else{
            nextAction()
        }
    }

    const showJoinChat = async () => {
        checkLogin(() => {
            checkAttendance(() => {
                setSelected(event)
                showJoin(true)
            })
        })
    }

    const showCreateChat = async () => {
        checkLogin(() => {
            setSelected(event)
            showCreate(true)
        })
    }

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card listing-preview">
                <div className="card-body">
                    <div className="listing-heading text-center">
                        <h3>{event.name}</h3>
                        <h4>{event.home_team.name} vs {event.away_team.name}</h4>
                        <p className="text-center my-2">{DateTime.fromISO(event.event_start_time).toLocaleString(dateFormat)}</p>
                        <p className="text-center my-2">Event Starts @ {DateTime.fromISO(event.event_start_time).toLocaleString(timeFormat)}</p>
                        {
                            event.host && <p className="text-center mt-2 mb-4">Hosted by: {event.host.username}</p>
                        }
                        <div className="d-flex justify-content-evenly ">
                        {
                            (!user || user.id !== event.host.id) &&
                            <Button className='create-chat' variant="outline-dark" onClick={showCreateChat}>
                                Create Chat
                            </Button>
                        }
                        <Button className='join-chat' variant="outline-dark" onClick={showJoinChat}>
                            Join Chat
                        </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard