import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import AppContext from "../context/AppContext";
import { Button, Modal } from 'react-bootstrap';
import Router from 'next/router'
import Slider from "react-slick";
import { Alert } from 'react-bootstrap';
import Cookies from 'js-cookie'
import swal from 'sweetalert';
import { EVENT_DETAILS,  SET_USER_TEAM} from '/context/AppUrl'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAtom } from '@fortawesome/free-solid-svg-icons';
import 'font-awesome/css/font-awesome.min.css';
import { DateTime } from 'luxon';

function EventLists({ searchFilter, selected}) {
    const { isLogin, event, search, setSelectedTeam } = useContext(AppContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [getEvData, setEvData] = useState(null);
    const [searchEvent, setSearchEvent] = useState(null);
    const [showCreateChat, setShowCreateChat] = useState(false);
    const handleCloseCreateChat = () => setShowCreateChat(false);
    const [noEvent, setNoEvent] = useState(false);
    const [getTeamName, setTeamName] = useState('home');

    const handleShowCreateChat = async() => {
        setShowCreateChat(true)
        setShow(false)
    } 

    const handleShow = async (event) => {
        setShowCreateChat(false)
        const response = await fetch(EVENT_DETAILS + event.id, {
            method: 'get',
        })
            .then(data => data)
            .catch(err => console.log(err))
        const data = await response.json();
        console.log("upper", data)
        if (data.statusCode === 200) {
            let eventAwayUser = []
            let eventHomeUser = []

            if (data.data.event.awayuser !== null) {
                eventAwayUser = data.data.event.awayuser
            }
            if (data.data.event.homeuser !== null) {
                eventHomeUser = data.data.event.homeuser
            }

            const userData = Cookies.get('userInfo')
            const user = JSON.parse(userData)

            if (eventAwayUser.indexOf((user.id).toString()) !== -1) {
                let obj = {
                    id: event.id,
                    selectTeamName: 'away'
                }
                console.log("away", `${event.homeTeamRef.name}-at-${event.awayTeamRef.name}`)

                Cookies.set('selectEventData', JSON.stringify(obj))
                Router.push({
                    pathname: '/[Team]/[TeamID]',
                    query: { Team: `${event.homeTeamRef.name}-at-${event.awayTeamRef.name}`, TeamID: event.roomId },
                })
            } else if (eventHomeUser.indexOf((user.id).toString()) !== -1) {
                let obj = {
                    id: event.id,
                    selectTeamName: 'home'
                }
                Cookies.set('selectEventData', JSON.stringify(obj))
                Router.push({
                    pathname: '/[Team]/[TeamID]',
                    query: { Team: `${event.homeTeamRef.name}-at-${event.awayTeamRef.name}`, TeamID: event.roomId },
                })
            } else {
                setEvData(data.data)
                setShow(true)
            }
        } else {
            swal("Error", "Something is wrong. Please try again.", "error")
            return false
        }


    };
    useEffect(() => {
        if (searchFilter) {
            if (event) {
                setSearchEvent(
                    event.filter(item =>
                        item.awayTeamRef.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        item.homeTeamRef.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        item.roomId.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        item.hostuser.userName.toLowerCase().includes(searchFilter.toLowerCase())
                    )
                )
            }
        } else if (event) {
            setSearchEvent(event)
        }
    }, [searchFilter, event])

    useEffect(() => {
        if (searchEvent) {
            if (searchEvent.length === 0) {
                setNoEvent(true)
            }
            else {
                setNoEvent(false)
            }
        }
    }, [searchEvent, searchFilter])

    useEffect(() => {
        if (search && selected) {
            setSearchEvent(
                event.filter(item =>
                    item.awayTeamRef.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.homeTeamRef.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.roomId.toLowerCase().includes(search.toLowerCase()) ||
                    item.hostuser.userName.toLowerCase().includes(search.toLowerCase())
                )
            )
        } else if(search){
            setSearchEvent(
                event.filter(item =>
                    item.awayTeamRef.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.homeTeamRef.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.roomId.toLowerCase().includes(search.toLowerCase()) ||
                    item.hostuser.userName.toLowerCase().includes(search.toLowerCase())
                )
            )
        } else if(selected){
            setSearchEvent(
                event.filter(item => item.sports.includes(selected))
            )
        } else {
            setSearchEvent(event)
        }
    }, [search, selected])


    function getRadioButtonValue(e) {
        const { value } = e.target;
        setTeamName(value)
    }

    const hendleClick = async (getEvData) => {
        const userData = Cookies.get('userInfo')
        const user = JSON.parse(userData)
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "connect.sid=s%3AQqaR6YuqRkwsY70BV5RPZvDv6mWq_nuq.P5kBBRn2qxq9hOpDRFQkifzWW7qAdRKJDxkkHFRJ3Kw");

        var formdata = new FormData();
        formdata.append("roomID", getEvData.event.roomId);
        formdata.append("userID", user.id);
        formdata.append("selectedTeam", getTeamName);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch(SET_USER_TEAM, requestOptions)
            .then(response => response.json())
            .then(result => {
                Router.push({
                    pathname: '/[Team]/[TeamID]',
                    query: {
                        Team: `${getEvData.homeTeam.name}-at-${getEvData.awayTeam.name}`,
                        TeamID: getEvData.event.roomId
                    },
                })
            })
            .catch(error => console.log('error', error));
            setSelectedTeam(
            {
                id: getEvData.event.id,
                selectTeamName: getTeamName
            }
        )
    }

    const hendleClickCreateChat = async (getEvData) => {
        setShowCreateChat(false)
        const wrapper = document.createElement('div');
        wrapper.innerHTML = "<div><p> <b> https://split-side.com/</b> <i class='ms-3 fa-regular fa-clone'></i></p> <p>You can find this link in your Account/Events page as well</p></div>";
        swal({
            title : "Success",
            content: wrapper, 
            icon: "success"
        });
    }

    return (
        <div className="container" id="event">
            {
                searchEvent &&
                <div className="row">

                    {Router.pathname == '/' ?
                        searchEvent.slice(0, 6).map((event, index) => {
                            return (
                                <div className="col-md-6 col-lg-4 mb-4" key={index}>
                                    <div className="card listing-preview">
                                        <div className="card-body">
                                            <div className="listing-heading text-center">
                                                {
                                                    event.home_team && <h4 className="text-primary">{event.home_team.name} at {event.away_team.name}</h4>
                                                }

                                                <p className="text-center my-2">{DateTime.fromISO(event.lobby_start_time).toLocaleString()}</p>
                                                <p className="text-center mt-2 mb-4">Hosted by:  {event.host.username}</p>
                                            {/* <hr /> */}
                                            <div className="d-flex justify-content-evenly ">
                                                {
                                                    
                                                        <Button className='create-chat' variant="outline-dark" onClick={() => handleShowCreateChat(event)}>
                                                            Create Chat
                                                        </Button>
                                                }
                                            
                                                {
                                                    !isLogin ? <Link href="/login">
                                                        <button className="btn btn-outline-dark join-chat">Join Chat</button>
                                                    </Link> :
                                                        <Button className='join-chat' variant="outline-dark" onClick={() => handleShow(event)}>
                                                            Join Event Chat
                                                        </Button>
                                                }
                                            </div>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        searchEvent ? searchEvent.map((event, index) => {
                            return (
                                <div className="col-md-6 col-lg-4 mb-4" key={index}>
                                    <div className="card listing-preview">
                                        <div className="card-body">
                                            <div className="listing-heading text-center">
                                                {
                                                    event.homeTeamRef && <h4 className="text-primary">{event.homeTeamRef.name} at {event.awayTeamRef.name}</h4>
                                                }

                                                <p className="text-center mt-3 mb-3">{event.joinDate}</p>
                                                <p className="text-center mt-3 mb-3">{event.joinTime} PT</p>
                                                <p className="text-center mt-3 mb-3">Hosted by: {event.hostuser.userName}</p>
                                            </div>
                                            <hr />
                                            <div className="d-flex justify-content-evenly">
                                                {
                                                   
                                                        <Button className='create-chat' variant="outline-dark" onClick={() => handleShowCreateChat(event)}>
                                                            Create Chat
                                                        </Button>
                                                }

                                                {
                                                    !isLogin ? <Link href="/login">
                                                        <button className="btn btn-outline-dark join-chat">Join Chat</button>
                                                    </Link> :
                                                        <Button className='join-chat' variant="outline-dark" onClick={() => handleShow(event)}>
                                                            Join Event Chat
                                                        </Button>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <>
                            {[
                                'danger'
                            ].map((variant) => (
                                <Alert key={variant} variant={variant}>
                                    No data available
                                </Alert>
                            ))}
                        </>
                    }
                    {
                        noEvent && <>
                            {[
                                'danger'
                            ].map((variant) => (
                                <Alert key={variant} variant={variant}>
                                    No data available
                                </Alert>
                            ))}
                        </>
                    }
                </div>
            }
            {
                getEvData &&
                <>
                    <Modal centered id={getEvData.event.id} className={getEvData.event.roomId} show={show} onHide={handleClose}>
                        <Modal.Header >
                            <Modal.Title>Join the Chat</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form id="post-form" method="POST" action="#">
                                <label><strong>Chat Room Name</strong></label>

                                <p className="text-left mb-3">{getEvData.awayTeam.name} at {getEvData.homeTeam.name}</p>
                                <label><strong>Which team are you cheering for?</strong></label>
                                <div>
                                    <div className='pb-1'>
                                        <input type="radio" name="user_team_selection" id="user_team_selection" value="home" checked={getTeamName === 'home'} onChange={getRadioButtonValue} />
                                        <label className='ps-1'> {getEvData.homeTeam.name}</label>
                                    </div>
                                    <div className='pb-2'>
                                        <input type="radio" name="user_team_selection" id="user_team_selection" value="away" checked={getTeamName === 'away'} onChange={getRadioButtonValue} />
                                        <label className='ps-1'> {getEvData.awayTeam.name}</label>
                                    </div>
                                </div>
                                <Button onClick={() => hendleClick(getEvData)} >Enter Room</Button>
                            </form>
                        </Modal.Body>
                    </Modal>
                </>
            }

            <>
                <Modal centered id="1" className="S text-center" show={showCreateChat} onHide={handleCloseCreateChat}>
                    <Modal.Header className="border-0 justify-content-center">
                        <Modal.Title><b>Create Private Chat?</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="post-form" method="POST" action="#">
                            <label><strong>A private room with a unique link will be created with you as the host.</strong></label>
                            <p className="text-left mb-3">You and your guests can chat amongst yourselves during the game.</p>
                            <p className="text-left mb-3">You can invite up-to 12 guests by sharing the link with them.</p>
                            <Button className="create-chat text-dark" onClick={() => hendleClickCreateChat()}>Create Chat</Button>
                        </form>
                    </Modal.Body>
                </Modal>
            </>

        </div>
    )
}

export default EventLists