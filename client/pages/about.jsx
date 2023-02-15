import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { getCMSContent } from '../context/api'

function About() {

    const [getAboutDetail, setAboutDetail] = useState(null)

    React.useEffect(async () => {
        getCMSContent('about', setAboutDetail)
    }, [])

    return (
        <>
             <Head>
                <title>Split-Side - About</title>
            </Head>
            <div>
                {
                    getAboutDetail && <>
                        <section id="showcase-inner" className="py-5 text-white">
                            <div className="container">
                                <div className="row text-center">
                                    <div className="col-md-12">
                                        <h1 className="text-primary display-4">About</h1>
                                        <p className="text-primary lead">Learn About the Split-Side Service</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="bc">
                            <div className="container">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/"><a>Home</a></Link>
                                        </li>
                                        <li className="breadcrumb-item active"> About</li>
                                    </ol>
                                </nav>
                            </div>
                        </section>

                        <section id="about" className="py-4">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12" dangerouslySetInnerHTML={{ __html: getAboutDetail }}>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="work" className="bg-dark text-white text-center">
                            <h2 className="display-4 mb-3">Start Chatting</h2>
                            <h4 className="mb-5">Check out the upcoming events to see what&apos;s going on in the world of sports</h4>
                            <Link href="/events"><a className="btn btn-primary text-black btn-lg">View Events</a></Link>
                        </section>

                        <section id="team" className="py-5">
                            <div className="container">
                                <h2 className="text-center mb-5">Our Team</h2>
                                <div className="row text-center">
                                    <div className="col-md-4">
                                        <h4>Aly Wagner</h4>
                                        <p className="text-secondary">Co-Founder</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h4>Michael Cohen</h4>
                                        <p className="text-secondary">Co-Founder</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h4>Eric Prouty</h4>
                                        <p className="text-secondary">Co-Founder</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                }
            </div>
        </>
    )
}

export default React.memo(About)