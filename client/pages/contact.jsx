import React, { useState, useContext }  from 'react'
import Link from 'next/link'
import { GET_DETAILS } from '/context/AppUrl'
import Head from 'next/head'

function Contact() {

    const [getContactDetail, setContactetail] = useState(null)

    React.useEffect(async () => {
        const response = await fetch(GET_DETAILS+3, {
            method: 'get',
        })
        .then(data => data)
        .catch(err => console.log(err))
        const data = await response.json();
        if (response.status === 200) {
           setContactetail(data)
        } 
    }, [])

    console.log(getContactDetail)

    return ( 
        <>
             <Head>
                <title>Split-Side - Contact</title>
            </Head>
            <div>
            {
            getContactDetail && <>
                <section id="showcase-inner" className="py-5 text-white">
                    <div className="container">
                        <div className="row text-center">
                        <div className="col-md-12">
                            <h1 className="text-primary display-4">{getContactDetail.data.title}</h1>
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
                            <li className="breadcrumb-item active"> {getContactDetail.data.title}</li>
                        </ol>
                        </nav>
                    </div>
                    </section>

                    <section id="contact" className="py-4">
                    <div className="container">
                        <div className="row">
                        <div className="col-md-12">
                            <ul className="contactDetail">
                            <li><span>Email :</span> <Link href="mailto:{getContactDetail.data.email}" ><a>{getContactDetail.data.email}</a></Link></li>
                            </ul>          
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

export default React.memo(Contact)