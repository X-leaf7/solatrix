import React, { useState, useContext } from 'react';
import Link from "next/link"
import { getCMSContent } from '../context/api'


function Footer() {

    const [getContactEmail, setContactEmail] = useState("")
    React.useEffect(async () => {
        getCMSContent('email', setContactEmail)
    }, [])

    return (
        <>
            <footer className="main-footer bg-primary">
                <div className="container">
                    <div className="row pt-4">
                        <div className="col-md-7">
                            <h5 className="text-light">About</h5>
                            <p className="text-justify text-muted">Your place for chat, debate and smack talk with family and friends while watching games on T.V.</p>
                        </div>
                        <div className="col-md-2">
                            <h5 className="text-light">Links</h5>
                            <ul className="footer-links">
                                <li><Link href="/"><a className="text-muted">Home</a></Link></li>
                                <li><Link href="/events"><a className="text-muted">Events</a></Link></li>
                                <li><Link href="/about"><a className="text-muted">About</a></Link></li>
                                <li><Link href="/terms"><a className="text-muted">Terms</a></Link></li>
                                <li><Link href="/privacy"><a className="text-muted">Privacy</a></Link></li>
                                <li><Link href="/contact"><a className="text-muted">Contact</a></Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <h5 className="text-light">Contact</h5>
                            <ul className="footer-contact">
                                <li>
                                    <span>Email:</span>
                                    <span dangerouslySetInnerHTML={{ __html: getContactEmail }}></span>
                                </li>
                             </ul>
                        </div>
                    </div>
                    <hr />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-sm-6 col-xs-12">
                            <p className="copyright-text text-muted">Copyright &copy;  <span className="year">{new Date().getFullYear()}</span> Podium Interactive, LLC. </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;