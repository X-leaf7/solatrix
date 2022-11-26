import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import { Alert } from 'react-bootstrap'
import 'font-awesome/css/font-awesome.min.css'

import EventCard from './EventCard'
import CreateChatModal from './CreateChatModal'
import JoinChatModal from './JoinChatModal'

import AppContext from '../context/AppContext'
import { useEvents } from '../context/api'
import Cookies from 'js-cookie'


function EventList({ searchFilter, selectedSport, user }) {
    const { isLogin, search, setSelectedTeam } = useContext(AppContext)
    const { events, isLoadingEvents, isErrorEvents } = useEvents(user && Cookies.get("Token"))
    const [shouldShowCreateChat, setShowCreateChat] = useState(null)
    const [shouldShowJoinChat, setShowJoinChat] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [filteredEvents, setFilteredEvents] = useState(null)
    const [displayEvents, setDisplayEvents] = useState([])
    const [noEvent, setNoEvent] = useState(false)
    const [displayEventCards, setDisplayEventCards] = useState([])


    const closeCreateChat = async () => {
        setShowCreateChat(false)
        setSelectedEvent(null)
    }

    const closeJoinChat = async () => {
        setShowJoinChat(false)
        setSelectedEvent(null)
    }

    useEffect(() => {
        if (filteredEvents) {
            if (filteredEvents.length === 0) {
                setNoEvent(true)
            }
            else {
                setNoEvent(false)
            }
        }
    }, [filteredEvents, searchFilter])

    useEffect(() => {
        if (!events) {
            return
        }

        let filters = []
        let results = events.slice()
        const lowerSearch = search.toLowerCase()

        if (selectedSport) {
            filters.push(eventItem => eventItem.sport.id == selectedSport)
        }

        if (search) {
            filters.push(eventItem =>
                eventItem.away_team.name.toLowerCase().includes(lowerSearch) ||
                eventItem.home_team.name.toLowerCase().includes(lowerSearch) ||
                eventItem.name.toLowerCase().includes(lowerSearch) ||
                eventItem.host.username.toLowerCase().includes(lowerSearch)
            )
        }

        filters.forEach(filter => results = results.filter(filter))

        setFilteredEvents(results)
    }, [events, search, selectedSport])

    useEffect(() => {
        if (filteredEvents) {
            if (Router.pathname == '/') {
                setDisplayEvents(filteredEvents.slice(0, 6))
            }
            else {
                setDisplayEvents(filteredEvents)
            }
        }
    }, [filteredEvents])

    return (
        <div className="container" id="events">
            <div className="row">
                {
                    displayEvents.map((event, index) => {
                        return <EventCard
                                    event={event}
                                    setSelected={setSelectedEvent}
                                    showJoin={setShowJoinChat}
                                    showCreate={setShowCreateChat}
                                    key={index}
                                    user={user}>
                                </EventCard>
                    })
                }
                {
                    noEvent && 
                    <Alert variant="danger">
                        No data available
                    </Alert>

                }
            </div>
            
            {
                selectedEvent &&
                <>
                    <CreateChatModal show={shouldShowCreateChat} selectedEvent={selectedEvent} onClose={closeCreateChat} />
                    <JoinChatModal show={shouldShowJoinChat} selectedEvent={selectedEvent} onClose={closeJoinChat} />
                </>
            }
        </div>
    )
}

export default EventList