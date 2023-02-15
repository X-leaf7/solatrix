import React, { useState } from 'react'
import Link from 'next/link'
import { getCMSContent } from '/context/api'
import Head from 'next/head'

function Terms() {

    const [getTermDetail, setTermDetail] = useState(null)

    React.useEffect(async () => {
        getCMSContent('terms', setTermDetail)
    }, [])



    return (
        <>
             <Head>
                <title>Split-Side - Terms & Conditions</title>
            </Head>
            <div>
            {
                getTermDetail && <>
                    <section id="showcase-inner" className="py-5 text-white">
                        <div className="container">
                            <div className="row text-center">
                                <div className="col-md-12">
                                    <h1 className="text-primary display-4">Terms</h1>
                                    <p className="text-primary lead">Review the Terms & Conditions of this Website</p>
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
                                    <li className="breadcrumb-item active"> Terms</li>
                                </ol>
                            </nav>
                        </div>
                    </section>

                    <section id="about">
                        <div className="container py-4">
                            <div className="row">
                                <div className="col-md-12 mb-4" dangerouslySetInnerHTML={{ __html: getTermDetail }}>
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

export default React.memo(Terms)