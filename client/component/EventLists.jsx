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
import EventCard from './EventCard';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAtom } from '@fortawesome/free-solid-svg-icons';
import 'font-awesome/css/font-awesome.min.css';


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
                            return <EventCard event={event} key={index}></EventCard>
                        })
                        :
                        searchEvent ? searchEvent.map((event, index) => {
                            return <EventCard event={event} key={index}></EventCard>
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