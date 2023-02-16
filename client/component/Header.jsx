import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppContext from "../context/AppContext";
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Search from './Search';
function Header() {

    const { isLogin } = React.useContext(AppContext);
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setExpanded(false);
    }, [router])

    return (
        <header>
            <Navbar bg="primary" expand="lg" expanded={expanded}>
                <Container>
                    <Navbar.Brand>
                        <Link href="/"><a className="navbar-brand"><img src="/img/logo.png" className="logo" alt="" /></a></Link>
                    </Navbar.Brand>
                    <div className='d-none d-mobile'>
                        <Search />
                    </div>
                    <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="w-auto">
                            <li className="nav-item me-lg-3">
                                <Link href='/events'><a className="nav-link">Events</a></Link>
                            </li>
                            <li className="nav-item me-lg-3">
                                <Link href="/about"><a className="nav-link">About</a></Link>
                            </li>
                        </Nav>
                        <Nav className="mx-auto w-50">
                            <li className='d-desktop'>
                                <Search />
                            </li>
                        </Nav>
                        <Nav className="w-auto ms-auto">
                            <div className="navbar-nav">
                                {
                                    !isLogin &&
                                    <>
                                        <Link href="/signup"><a className="nav-item nav-link me-3">Sign&#x2011;Up</a></Link>
                                        <Link href="/login"><a className="nav-item nav-link me-3">Login</a></Link>
                                    </>
                                }

                                {
                                    isLogin &&
                                    <>
                                        <Link href="/edit-account"><a className="nav-item nav-link" >Account</a></Link>
                                    </>
                                }
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header;