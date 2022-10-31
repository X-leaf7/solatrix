import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import AppContext from "../context/AppContext";
import { Button, Modal } from 'react-bootstrap';
import Router from 'next/router'
import Slider from "react-slick";

function EventLists() {

    const { isLogin, event, search } = useContext(AppContext);
    const [show, setShow] = useState(false);
    const [eventId, setEventId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [homeTeam, setHomeTeam] = useState(null);
    const [awayTeam, setAwayTeam] = useState(null);
    const [getEventList, setEventList] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (event) => {
        setEventId(event.id)
        setRoomId(event.roomId)
        setHomeTeam(event.homeTeamRef)
        setAwayTeam(event.awayTeamRef)
        setShow(true)
    };

    const EventList = event && event.filter(item =>
        item.awayTeamRef.name.includes(search) ||
        item.homeTeamRef.name.includes(search) ||
        item.location.includes(search) 
    );

    useEffect(() => {
        if(EventList === null || EventList.length === 0){
            setEventList(true)
        } else {
            setEventList(false)
        }
    }, [EventList])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };
    return (
        <div className="container" id="event">
            {
                event &&
                <div className="row">
                    {
                        getEventList === true ?
                            <div className="row">
                                <div className="col-md-12 col-lg-12 mb-12" id="noEventFound">No Events Found!</div>
                            </div>    
                        :
                        EventList.slice(0, 6).map((event, index) => {
                            return (
                                <div className="col-md-6 col-lg-4 mb-4" key={index}>
                                    <div className="card listing-preview">
                                        <div className="card-body">
                                            <div className="listing-heading text-center">
                                                {
                                                    event.homeTeamRef && <h4 className="text-primary">{event.homeTeamRef.name} at {event.awayTeamRef.name}</h4>
                                                }

                                                <p className="text-center mt-3 mb-3">Location: {event.location}</p>
                                                <p className="text-center mt-3 mb-3">Hosted by: {event.host}</p>
                                            </div>
                                            <hr />
                                            <div className="col-md-12 mt-3">
                                                {
                                                    !isLogin ? <Link href="/login">
                                                        <button className="btn btn-outline-dark w-100">Join Event Chat</button>
                                                    </Link> :
                                                        <Button className='w-100' variant="outline-dark" onClick={() => handleShow(event)}>
                                                            Join Event Chat
                                                        </Button>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
           
        </div>
    )
}

export default EventLists