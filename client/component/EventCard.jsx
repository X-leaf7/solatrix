import React, { useState, useEffect, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { DateTime } from 'luxon'
import AppContext from '../context/AppContext'
import Link from 'next/link'


function EventCard({ event, setSelected, showJoin, showCreate }) {
    const { checkLogin } = useContext(AppContext);

    const showJoinChat = async () => {
        checkLogin(() => {
            setSelected(event)
            showJoin(true)
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
                        <h4 className="text-primary">{event.home_team.name} vs {event.away_team.name}</h4>

                        <p className="text-center my-2">{DateTime.fromISO(event.lobby_start_time).toLocaleString()}</p>
                        <p className="text-center mt-2 mb-4">Hosted by:  {event.host.username}</p>
                        {/* <hr /> */}
                        <div className="d-flex justify-content-evenly ">
                        <Button className='create-chat' variant="outline-dark" onClick={showCreateChat}>
                            Create Chat
                        </Button>
                        <Button className='join-chat' variant="outline-dark" onClick={showJoinChat}>
                            Join Event Chat
                        </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard