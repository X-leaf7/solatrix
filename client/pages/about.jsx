import React, { useState, useContext } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { GET_DETAILS } from '/context/AppUrl'
import Head from 'next/head'

function About() {

    const [getAboutDetail, setAboutDetail] = useState(null)

    React.useEffect(async () => {
        const response = await fetch(GET_DETAILS + 1, {
            method: 'get',
        })
            .then(data => data)
            .catch(err => console.log(err))
        const data = await response.json();
        if (response.status === 200) {
            setAboutDetail(data)
        }
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
                                        <h1 className="text-primary display-4">{getAboutDetail.data.title}</h1>
                                        <p className="text-primary lead">Learn About the Split-Side Service</p>
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
                                        <li className="breadcrumb-item active"> {getAboutDetail.data.title}</li>
                                    </ol>
                                </nav>
                            </div>
                        </section>

                        <section id="about" className="py-4">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <p className="lead mt-4 inlineCss">{getAboutDetail.data.about}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="work" className="bg-dark text-white text-center">
                            <h2 className="display-4">Start Chatting</h2>
                            <h4>Check out the upcoming events to see what&apos;s going on in the world of sports</h4>
                            <hr />
                            <Link href="/events"><a className="btn btn-primary text-black btn-lg">View Events</a></Link>
                        </section>

                        <section id="team" className="py-5">
                            <div className="container">
                                <h2 className="text-center" style={{ 'margin-bottom': '1.5rem' }}>Our Team</h2>
                                <div className="row text-center">
                                    <div className="col-md-4">
                                        <h4>Aly Wagner</h4>
                                        <p className="text-primary">Co-Founder</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h4>Michael Cohen</h4>
                                        <p className="text-primary">Co-Founder</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h4>Eric Prouty</h4>
                                        <p className="text-primary">Co-Founder</p>
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