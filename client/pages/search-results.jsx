import React from 'react'
import Link from 'next/link'

function SearchResults() {
    return (
        <>
            <section id="showcase-inner" className="py-5 text-white">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-12">
                            <h1 className="text-primary display-4">Search Results</h1>
                            <p className="text-primary lead">Join an event and choose the side you want to win</p>
                        </div>
                    </div>
                </div>
            </section>


            <section id="bc" className="mt-3">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/"><a>Home</a></Link>
                            </li>
                            <li className="breadcrumb-item active"> Search Results</li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section id="events" className="py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-lg-4 mb-4">
                            <div className="card listing-preview">
                                <div className="card-body">
                                    <div className="listing-heading text-center">
                                        <h4 className="text-primary">Away Team at Home Team</h4>
                                        <p className="text-center mt-3 mb-3">Location: Stadium Name</p>
                                        <p className="text-center mt-3 mb-3">Hosted by: Host Name</p>
                                    </div>
                                    <hr />
                                    <div className="col-md-12 mt-3">
                                        <button className="btn btn-outline-dark w-100" data-toggle="modal" data-target="#joinRoomModal" data-keyboard="true">Join Event Chat</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="modal fade" id="joinRoomModal" role="dialog" tabIndex='-1'>
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
                                <label><strong>Chat Room Name</strong></label><br />
                                <p className="text-left mb-3">Away Team at Home Team</p>
                                <label><strong>Which team are you cheering for?</strong></label><br />
                                <input type="radio" name="user_team_selection" id="user_team_selection" value="#" />
                                <label htmlFor="#">Home Team</label><br />
                                <input type="radio" name="user_team_selection" id="user_team_selection" value="#" />
                                <label htmlFor="#">Away Team</label><br /><br />
                                <Link href="/room"><a className="btn btn-primary" role="button">Enter Room</a></Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default React.memo(SearchResults)