import React, { useState } from 'react'
import Link from 'next/link'
import EventList from '../component/EventList'
import SportSelect from '../component/SportSelect'
import Head from 'next/head'
import DaySelect from '../component/DaySelect'

function Home() {
    
    const [selectedSport, setSelectedSport] = useState();
    const [selectedDay, setSelectedDay] = useState();


    return (
        <>
            <Head>
                 <title>Split-Side - Home</title>
            </Head>
            <section id="announcement">
                <p className="text-center lead">Chat Platform for Sports Fans</p>
            </section>

            <section id="showcase">
                <div className="container text-center">
                    <div className="home-search">
                        <div className="p-4">
                            <p className="text-primary lead">
                                <span className="line">When You're Watching</span>&nbsp;
                                <span className="line">the Game on TV</span>
                            </p>
                            <h1 className="text-primary display-4 mt-1 mb-3">
                                <span className="line">Create an Invite-Only</span>&nbsp;
                                <span className="line">Chat Place to Share with</span>&nbsp;
                                <span className="line">Friends & Family</span>
                            </h1>
                            <Link href="/events"><a className="btn btn-warning mt-3">Get Started</a></Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="events" className="py-4">
                <div className="container text-center">
                    <div className="row text-center align-items-center">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <h1 className="schedule-header display-4 mb-3 mt-md-5"><b>Schedule</b></h1>
                        </div>
                        <div className="col-md-4 customDropDown mb-3 mb-md-0">
                            <SportSelect selected={selectedSport} setSelected={setSelectedSport} />
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-center mb-5">
                        <DaySelect selected={selectedDay} setSelected={setSelectedDay} />
                    </div>
                </div>
                <EventList selectedSport={selectedSport} selectedDay={selectedDay} />
            </section>

            <section id="work" className="bg-dark text-white text-center">
                <h2 className="display-4 mb-3">Browse Events</h2>
                <h4 className="mb-5">Check out the upcoming games to see what's going on in the world of sports</h4>
                <Link href="/events"><a className="btn btn-primary text-black btn-lg">View More Events</a></Link>
            </section>

            <section id="team" className="py-5">
                <div className="container">
                    <h2 className="display-4 text-center mb-5">Learn More</h2>
                    <div className="row text-center">
                        <div className="col-md-4 mb-3">
                            <h4>Create Account</h4>
                            <p className="text-secondary">Sign-up for a free account and login to<br /> create and participate in chats.</p>
                        </div>
                        <div className="col-md-4 mb-3">
                            <h4>Search Events</h4>
                            <p className="text-secondary">Browse the events across sports like football,<br /> baseball, basketball, soccer and ice hockey.</p>
                        </div>
                        <div className="col-md-4">
                            <h4>Launch Chat</h4>
                            <p className="text-secondary">Create and share your own private chat<br /> place for up-to 12 guests.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="modal fade" id="joinRoomModal" role="dialog" tabIndex='-1'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="joinRoomModal">Join the Chat</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form id="post-form" method="POST" action="#">
                                <label><strong>Room Name</strong></label><br />
                                <p className="text-left mb-3">Away Team at Home Team</p>
                                <label><strong>Select Side</strong></label><br />
                                <input type="radio" name="user_team_selection" id="user_team_selection" value="#" />
                                <label htmlFor="#">Home Team</label><br />
                                <input type="radio" name="user_team_selection" id="user_team_selection" value="#" />
                                <label htmlFor="#">Away Team</label><br /><br />
                                <Link href="/room"><a className="btn btn-primary" role="button">Enter Room</a></Link>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default React.memo(Home)
