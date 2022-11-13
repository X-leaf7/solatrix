import React, { useState } from 'react'
import Link from 'next/link'
import EventList from '../component/EventList'
import SportSelect from '../component/SportSelect'
import Head from 'next/head'

function Home() {
    
    const [selectedSport, setSelectedSport] = useState();

    return (
        <>
            <Head>
                 <title>Split-Side - Home</title>
            </Head>

            <section id="showcase" style={{ backgroundImage: `url('/img/stadium.jpg')` }}>
                <div className="container text-center">
                    <div className="home-search p-5">
                        <div className="overlay p-5">
                            <h1 className="text-primary display-4 mt-1 mb-3">
                                Real-Time Chat for the World of Sports
                            </h1>
                            <p className="text-primary lead">Watching a game on TV?</p>
                            <small id="emailHelp" className="form-text text-muted">Visit the Events page to find a live chat experience
                                and join in the conversation with fans from both sides</small>
                            <Link href="/events"><a className="btn btn-secondary mt-3">Find Your Team & Join the Chat</a></Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="events" className="py-4">
                <div className="container text-center">
                    <div className="row text-center align-items-center">
                        <div className="col-md-8">
                            <h1 className="text-primary text-end display-4 mb-5 mt-5"><b>Schedule</b></h1>
                        </div>
                        <SportSelect selected={selectedSport} setSelected={setSelectedSport} />
                    </div>
                </div>
                <EventList selectedSport={selectedSport} />
            </section>

            <section id="work" className="bg-dark text-white text-center mt-5">
                <h2 className="display-4">Browse Events</h2>
                <h4>Check out the upcoming games to see what's going on in the world of sports</h4>
                <hr />
                <Link href="/events"><a className="btn btn-primary text-black btn-lg">View More Events</a></Link>
            </section>

            <section id="team" className="py-5">
                <div className="container">
                    <h2 className="text-center" style={{'marginBottom':'1.5rem'}}>Learn More</h2>
                    <div className="row text-center">
                        <div className="col-md-4">
                            <h4>Create Account</h4>
                            <p className="text-primary">Create a free account and login to<br /> participate in chat.</p>
                        </div>
                        <div className="col-md-4">
                            <h4>Search Events</h4>
                            <p className="text-primary">Find your team or search popular hosts<br /> from the world of sports.</p>
                        </div>
                        <div className="col-md-4">
                            <h4>Join Chat, Pick a Side</h4>
                            <p className="text-primary">Select an event and choose the side your<br /> cheering for as you join in chat.</p>
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
