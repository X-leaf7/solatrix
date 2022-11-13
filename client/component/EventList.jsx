import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import { Alert } from 'react-bootstrap'
import 'font-awesome/css/font-awesome.min.css'

import EventCard from './EventCard'
import CreateChatModal from './CreateChatModal'
import JoinChatModal from './JoinChatModal'

import AppContext from '../context/AppContext'
import { useEvents } from '../context/api'


function EventList({ searchFilter, selectedSport }) {
    const { isLogin, search, setSelectedTeam } = useContext(AppContext)
    const { events, isLoadingEvents, isErrorEvents } = useEvents()
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
        if (searchFilter) {
            if (events) {
                setFilteredEvents(
                    events.filter(item =>
                        item.awayTeamRef.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        item.homeTeamRef.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        item.roomId.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        item.hostuser.userName.toLowerCase().includes(searchFilter.toLowerCase())
                    )
                )
            }
        } else if (events) {
            setFilteredEvents(events)
        }
    }, [searchFilter, events])

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
        if (search && selectedSport) {
            setFilteredEvents(
                events.filter(item =>
                    item.awayTeamRef.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.homeTeamRef.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.roomId.toLowerCase().includes(search.toLowerCase()) ||
                    item.hostuser.userName.toLowerCase().includes(search.toLowerCase())
                )
            )
        } else if(search){
            setFilteredEvents(
                events.filter(item =>
                    item.awayTeamRef.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.homeTeamRef.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.roomId.toLowerCase().includes(search.toLowerCase()) ||
                    item.hostuser.userName.toLowerCase().includes(search.toLowerCase())
                )
            )
        } else if(selectedSport){
            setFilteredEvents(
                events.filter(item => item.sports.includes(selectedSport))
            )
        } else {
            setFilteredEvents(events)
        }
    }, [search, selectedSport])

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
                                    key={index}>
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