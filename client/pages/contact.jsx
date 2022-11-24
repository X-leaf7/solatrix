import React, { useState }  from 'react'
import Link from 'next/link'
import { getCMSContent } from '/context/api'
import Head from 'next/head'

function Contact() {

    const [getContactEmail, setContactEmail] = useState(null)

    React.useEffect(async () => {
        getCMSContent('email', setContactEmail)
    }, [])

    return ( 
        <>
             <Head>
                <title>Split-Side - Contact</title>
            </Head>
            <div>
                <section id="showcase-inner" className="py-5 text-white">
                    <div className="container">
                        <div className="row text-center">
                        <div className="col-md-12">
                            <h1 className="text-primary display-4">Contact</h1>
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
                            <li className="breadcrumb-item active"> Contact</li>
                        </ol>
                        </nav>
                    </div>
                </section>

                <section id="contact" className="py-4">
                    <div className="container">
                        <div className="row">
                        <div className="col-md-12">
                            <ul className="contactDetail">
                                <li>
                                    <span>Email :</span>
                                    <span dangerouslySetInnerHTML={{ __html: getContactEmail }}></span>
                                </li>
                            </ul>          
                        </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default React.memo(Contact)