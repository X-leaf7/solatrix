import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import { Button } from 'react-bootstrap'
import { DateTime } from 'luxon'
import Cookies from 'js-cookie'
import AppContext from '../context/AppContext'
import { verifyAttendance } from '/context/api'



function EventCard({ event, setSelected, showJoin, showCreate }) {
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
        const attendance = await verifyAttendance(event)

        if (attendance) {
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
        }, `/event/${event.slug}/`)
    }

    const showCreateChat = async () => {
        checkLogin(() => {
            setSelected(event)
            showCreate(true)
        })
    }

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card listing-preview shadow-sm">
                <div className="card-body">
                    <div className="listing-heading text-center">
                        <h6>{event.name}</h6>
                        <h5>{event.home_team.name} vs {event.away_team.name}</h5>
                        <p className="text-center my-2">{DateTime.fromISO(event.event_start_time).toLocaleString(dateFormat)}</p>
                        <p className="text-center my-2">{DateTime.fromISO(event.event_start_time).toLocaleString(timeFormat)}</p>
                        <div className="d-flex justify-content-evenly ">
                        <Button className='create-chat btn-warning' variant="outline-dark" onClick={showCreateChat}>
                            Create Chat
                        </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard