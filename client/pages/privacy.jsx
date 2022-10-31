import React, { useState, useContext } from 'react'
import Link from 'next/link'
import { GET_DETAILS } from '/context/AppUrl'
import Head from 'next/head'

function Privacy() {

    const [getPrivacyDetail, setPrivacyDetail] = useState(null)

    React.useEffect(async () => {
        const response = await fetch(GET_DETAILS + 4, {
            method: 'get',
        })
            .then(data => data)
            .catch(err => console.log(err))
        const data = await response.json();
        if (response.status === 200) {
            setPrivacyDetail(data)
        }
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
                                    <h1 className="text-primary display-4">{getPrivacyDetail.data.title}</h1>
                                    <p className="text-primary lead">Review the Privacy Policy of this Website</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="bc" className="mt-3">
                        <div className="container">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link href="/"><a >Home</a></Link>
                                    </li>
                                    <li className="breadcrumb-item active"> {getPrivacyDetail.data.title}</li>
                                </ol>
                            </nav>
                        </div>
                    </section>

                    <section id="about">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12 mb-4">
                                    <p className="col-md-12 inlineCss">{getPrivacyDetail.data.about}</p>
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