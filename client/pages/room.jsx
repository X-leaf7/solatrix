import React, { useState, useEffect, useContext } from 'react'
import AppContext from "../context/AppContext";
import Router, { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import swal from 'sweetalert';
import socketClient from "socket.io-client";
import { Button, Modal } from 'react-bootstrap';
import { URL, GET_USER_DETAILS, JOIN_EVENT, PROFILE_IMG } from '/context/AppUrl'

let socket = socketClient(URL)

function Room() {


    const router = useRouter()
    const { isLogin, event } = useContext(AppContext);
    const [userJoinEvent, setUserJoinEvent] = useState(false);
    const [getJoinUserDetail, setJoinUserDetail] = useState(null)
    const [getEventTimer, setEventTimer] = useState('00:00:00')
    const [getChatBox, setChatbox] = useState(false)
    const [show, setShow] = useState(false);

    const [getImage, setImage] = useState(null);
    const [getUsername, setUsername] = useState(null);
    const [getCity, setCity] = useState(null);
    const [getState, setState] = useState(null);
    const [getAbout, setAbout] = useState(null);
    const [getBannerImage, setBannerImage] = useState(null);
    const [getcomma, setcomma] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = async (event) => {
        console.log(event.target.dataset)
        const { param } = event.target.dataset;
        const response = await fetch(GET_USER_DETAILS + param, {
            method: 'get',
        })
            .then(data => data)
            .catch(err => console.log(err))
        const data = await response.json();
        if (response.status === 200) {
            var setimage = ''
            if (data.data.image == null) {
                setimage = 'img/profile_img.png'
            } else {
                setimage = data.data.image
            }

            setImage(URL + '/' + setimage)
            setUsername(data.data.userName)
            setCity(data.data.city)
            setState(data.data.state)
            setAbout(data.data.about)
            setShow(true)
            if (data.data.city == '' || data.data.state == '' || data.data.city == null || data.data.state == null) {
                setcomma(true)
            }
        }
    };

    useEffect(async () => {
        if (userJoinEvent === false) {
            let obj = router.query
            const isEmpty = Object.keys(obj).length === 0;
            let getEventData = {}
            if (isEmpty === true) {
                const eventSelectData = Cookies.get('selectEventData')
                getEventData = JSON.parse(eventSelectData)
            } else {
                Cookies.set('selectEventData', JSON.stringify(obj))
                const eventSelectData = Cookies.get('selectEventData')
                getEventData = JSON.parse(eventSelectData)
            }

            const checkObjectValue = Object.keys(getEventData).length === 0;
            if (checkObjectValue === true) {
                Router.push('/event')
                swal("Error", "Something is wrong. Please try again.", "error")
                return false
            }

            const userData = Cookies.get('userInfo')
            const user = JSON.parse(userData)
            var joinEventData = {
                id: getEventData.id,
                teamType: getEventData.selectTeamName,
                userId: (user.id).toString()
            }


            const response = await fetch(JOIN_EVENT, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(joinEventData),
            })
                .then(data => data)
                .catch(err => console.log(err))
            const data = await response.json();

            if (response.status === 200) {
                setUserJoinEvent(true)
                let eventId = {
                    eventId: getEventData.id
                }
                socket.emit("join", eventId, (response) => {
                    if (response.statusCode === 200) {
                        if (response.data.eventTime.eventStart === true) {
                            setEventTimer('00:00:00')
                            setChatbox(true)
                        }
                        setJoinUserDetail(response.data)
                        setBannerImage(URL + '/' + response.data.event.banner)
                    } else {
                        swal("Error", "Something is wrong. Please try again.", "error")
                        return false
                    }
                })
            } else if (response.status === 400) {
                swal("Error", "Something is wrong. Please try again.", "error")
                return false
            }
        }
    }, [userJoinEvent])

    const onClickSendMessage = () => {
        if (isLogin === true) {
            const mesasge = document.getElementById('userMessage').value

            if (mesasge.trim().length === 0) {
                swal("Error", "Please enter message.", "error")
                return false
            }



            if (!mesasge) {
                swal("Error", "Please enter message.", "error")
                return false
            }

            if (mesasge.length > 160) {
                swal("Error", "MaxLength is 160 characters", "error")
                return false
            }



            const userData = Cookies.get('userInfo')
            const user = JSON.parse(userData)
            let hostUserUser = getJoinUserDetail.event.host
            const eventSelectData = Cookies.get('selectEventData')
            const getEventData = JSON.parse(eventSelectData)
            var hostOrUser = 'user'
            if (user.id === hostUserUser) {
                hostOrUser = 'host'
            }

            var sendMessageData = {
                eventId: getEventData.id,
                userid: user.id,
                sendertype: hostOrUser,
                message: mesasge,
                type: getEventData.selectTeamName
            }
            socket.emit('messages', sendMessageData, (response) => {
                if (response.statusCode === 200) {
                    document.getElementById("userMessage").value = '';
                }
            })
        } else {
            swal("Error", "Something is wrong. Please try again.", "error")
            return false
        }
    }



    useEffect(async () => {
        const getSelectedEventId = Cookies.get('selectEventData')
        const getSelectedEventData = JSON.parse(getSelectedEventId)
        socket.on('counter', (response) => {
            if (response.eventId === parseInt(getSelectedEventData.id)) {
                if (response.eventStart === false) {
                    setEventTimer(response.watingTime)
                    setChatbox(false)
                } else {
                    setEventTimer('00:00:00')
                    setChatbox(true)
                }
            }
        })

        socket.on("thread", (response) => {
            const eventSelectData = Cookies.get('selectEventData')
            const getEventData = JSON.parse(eventSelectData)
            const getAllmsg = JSON.parse(localStorage.getItem('allMsg'));

            if (response.statusCode == 200) {
                var msgData = response.data
                if (parseInt(getEventData.id) === msgData.eventid) {
                    getAllmsg.messages.push(msgData)
                    setJoinUserDetail(getAllmsg)
                }
            } else {
                Router.push('/event', { shallow: true })
                swal("Error", "Currently this event is inactive. Please try again.", "error")
                return false
            }
        })

        socket.on("removeMessage", (response) => {
            if (response.statusCode === 200) {
                document.getElementById(response.data.id).remove();
            }
        })

    }, [])


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onClickSendMessage();
        }
    }

    const [gethomeTeamMsg, sethomeTeamMsg] = useState(null);
    const [getawayTeamMsg, setawayTeamMsg] = useState(null);
    const [gethostUserMsg, sethostUserMsg] = useState(null);

    useEffect(() => {
        if (getJoinUserDetail !== null) {
            let homeTeamMsg = []
            let awayTeamMsg = []
            let hostUserMsg = []
            const userData = Cookies.get('userInfo')
            const user = JSON.parse(userData)
            let messages = getJoinUserDetail.messages
            localStorage.setItem('allMsg', JSON.stringify(getJoinUserDetail));

            for (var i = 0; i < messages.length; i++) {

                var imageSet = ''
                if (messages[i].user.image === null) {
                    imageSet = PROFILE_IMG
                } else {
                    imageSet = URL + "/" + messages[i].user.image
                }

                if (messages[i].sendertype === 'host') {
                    hostUserMsg.push(<p key={messages[i].id} id={messages[i].id}><b data-param={messages[i].user.id} onClick={handleShow}><img data-param={messages[i].user.id} src={imageSet} className="chatModuleImg" /> {messages[i].user.userName}</b> {messages[i].message}</p>)
                } else if (messages[i].sendertype === 'user' || messages[i].sendertype === 'admin') {
                    if (messages[i].type == 'home') {
                        homeTeamMsg.push(<p key={messages[i].id} id={messages[i].id}><b data-param={messages[i].user.id} onClick={handleShow}><img data-param={messages[i].user.id} src={imageSet} className="chatModuleImg" /> {messages[i].user.userName}</b> {messages[i].message}</p>)
                    } else if (messages[i].type === 'away') {
                        awayTeamMsg.push(<p key={messages[i].id} id={messages[i].id}><b data-param={messages[i].user.id} onClick={handleShow}><img data-param={messages[i].user.id} src={imageSet} className="chatModuleImg" />  {messages[i].user.userName}</b> {messages[i].message}</p>)
                    }
                }
            }

            sethomeTeamMsg(homeTeamMsg)
            setawayTeamMsg(awayTeamMsg)
            sethostUserMsg(hostUserMsg)

            setTimeout(function () {
                var elemAway = document.getElementById('awayMsgDiv');
                elemAway.scrollTop = elemAway.scrollHeight;

                var elemHome = document.getElementById('homeMsgDiv');
                elemHome.scrollTop = elemHome.scrollHeight;

                var elemHost = document.getElementById('hostMsgDiv');
                elemHost.scrollTop = elemHost.scrollHeight;

            }, 100);
        }
    }, [getJoinUserDetail])

    return (
        <>
            <div id="room">
                {
                    getJoinUserDetail && <>

                        <div className="room-chat-form mb-3">
                            <div className="event-start-main">
                                {getChatBox === false ? (
                                    <h3>Event Starts in… </h3>
                                ) : (
                                    <h3></h3>
                                )}

                                {getChatBox === false ? (
                                    <div className="event-time-box">
                                        <p>{getEventTimer}</p>
                                    </div>
                                ) : (
                                    <div className="event-time-box" style={{ 'border': 'none' }}>
                                        <img src={getBannerImage} alt="" />
                                    </div>
                                )}

                            </div>
                            <div className="hosted-first-chat-form">
                                <div className="hosted-heading-main">
                                    <h4><b>Hosted:</b> {getJoinUserDetail.event.hostuser.userName}</h4>
                                    <h4><b>Location:</b> {getJoinUserDetail.event.location}</h4>
                                </div>
                                <div className="hosted-first-chat-box" id="hostMsgDiv">
                                    {gethostUserMsg}
                                </div>
                            </div>
                            <div className="hosted-second-chat-form">
                                <div className="team-chat-box-main">
                                    <div className="team-heading"><b>Away Team:</b> {getJoinUserDetail.awayTeam.name}</div>
                                    <div className="team-chat-box" id="awayMsgDiv">{getawayTeamMsg}</div>
                                </div>
                                <div className="team-chat-box-main right">
                                    <div className="team-heading"><b>Home Team:</b> {getJoinUserDetail.homeTeam.name}</div>
                                    <div className="team-chat-box" id="homeMsgDiv">{gethomeTeamMsg}</div>
                                </div>
                            </div>
                            {getChatBox === false ? (
                                <div className="input-group mb-3" style={{ 'opacity': '0.5', 'pointerEvents': 'none' }}>
                                    <input type="text" className="form-control" placeholder="Start typing..." aria-label="Type chat message here" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-secondary" type="button" onClick={onClickSendMessage}>Post</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Start typing..." aria-label="Type chat message here" aria-describedby="basic-addon2" id="userMessage" onKeyPress={handleKeyPress} />
                                    <div className="input-group-append">
                                        <button className="btn btn-secondary" type="button" onClick={onClickSendMessage}>Post</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-3" id="display"></div>
                    </>
                }
            </div>
            <div className="container-chat">
            </div>
            <Modal show={show} >
                <Modal.Body>
                    <div className="user-details-main">
                        <img src={getImage} alt="" />
                        <h3>{getUsername}</h3>
                        {getcomma === true ? (
                            <span>{getCity}  {getState}</span>
                        ) : (
                            <span>{getCity} , {getState}</span>
                        )}
                        <p>{getAbout}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default React.memo(Room)