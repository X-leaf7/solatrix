import React from 'react'
import Link from 'next/link'
import EventList from '../component/EventList'
import { useRouter } from 'next/router'
import Head from 'next/head'

function Events() {


    const router = useRouter()
    const { search } = router.query

    return (
          <>
             <Head>
                <title>Split-Side - Events</title>
            </Head>
            <div>
            <section id="showcase-inner" className="py-5 text-white">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-12">
                            <h1 className="text-primary display-4">Events</h1>
                            <p className="text-primary lead">Join an event and choose the side you want to win</p>
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
                            <li className="breadcrumb-item active"> Events</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section id="events" className="py-4">
                <EventList searchFilter={search ? search : null} />
            </section>
        </div>
        </>
    )
}

export default React.memo(Events)