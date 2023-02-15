import React, { useState } from 'react'
import Link from 'next/link'
import { getCMSContent } from '/context/api'
import Head from 'next/head'

function Privacy() {

    const [getPrivacyDetail, setPrivacyDetail] = useState(null)

    React.useEffect(async () => {
        getCMSContent('privacy', setPrivacyDetail)
    }, [])

    return (
        <>
             <Head>
                <title>Split-Side - Privacy Policy</title>
            </Head>
            <div>
            {
                getPrivacyDetail && <>
                    <section id="showcase-inner" className="py-5 text-white">
                        <div className="container">
                            <div className="row text-center">
                                <div className="col-md-12">
                                    <h1 className="text-primary display-4">Privacy</h1>
                                    <p className="text-primary lead">Review the Privacy Policy of this Website</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="bc">
                        <div className="container">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link href="/"><a >Home</a></Link>
                                    </li>
                                    <li className="breadcrumb-item active"> Privacy</li>
                                </ol>
                            </nav>
                        </div>
                    </section>

                    <section id="about">
                        <div className="container py-4">
                            <div className="row">
                                <div className="col-md-12 mb-4" dangerouslySetInnerHTML={{ __html: getPrivacyDetail }}>
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

export default React.memo(Privacy)