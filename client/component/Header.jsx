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
                        <Nav>
                            <li className='d-desktop'>
                                <Search />
                            </li>
                            <li className="nav-item me-3">
                                <Link href="/"><a className="nav-link">Home</a></Link>
                            </li>
                            <li className="nav-item me-3">
                                <Link href='/events'><a className="nav-link">Events</a></Link>
                            </li>
                            <li className="nav-item me-3">
                                <Link href="/about"><a className="nav-link">About</a></Link>
                            </li>
                        </Nav>
                        <Nav>
                            <div className="navbar-nav">
                                {
                                    !isLogin &&
                                    <>
                                        <Link href="/signup"><a className="nav-item nav-link me-3">Sign-Up</a></Link>
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