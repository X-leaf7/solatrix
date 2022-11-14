import React, { useState, useEffect, useContext } from 'react'
import AppContext from '/context/AppContext'
import Router, { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import swal from 'sweetalert';
import socketClient from "socket.io-client";
import { ATTENDEES, URL, USER_DETAIL, JOIN_EVENT, PROFILE_IMG, GET_EVENTS, CHECK_EVENT_USER, SET_USER_TEAM } from '/context/AppUrl'
import Head from 'next/head'
import ProfileModal from '/component/ProfileModal'
import JoinChatModal from '/component/JoinChatModal'
//let socket = socketClient(URL)

function Room() {

    const router = useRouter()
    const { isLogin, event, selectedTeam, setSelectedTeam } = useContext(AppContext);
    const [userJoinEvent, setUserJoinEvent] = useState(false);
    const [getJoinUserDetail, setJoinUserDetail] = useState(null)
    const [getEventTimer, setEventTimer] = useState('00:00:00')
    const [getChatBox, setChatbox] = useState(false)
    const [showProfile, setShowProfile] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showJoinChatModal, setShowJoinChatModal] = useState(false);
    const [eventData, setEventData] = useState(null);
    const [getBannerImage, setBannerImage] = useState(null);
    const [getTeamName, setTeamName] = useState('home');
    const [userID, setUserID] = useState(null);
    // const [getEventData, setGetEventData] = useState({})
    const [urlObj, setUrlObj] = useState(null);

    const handleShowProfile = async (event) => {
        const { param } = event.target.dataset;
        setSelectedUser(param)
        setShowProfile(true)
    }

    function handleCloseJoinChat() {
        setShowJoinChatModal(false)
    }

    function getRadioButtonValue(e) {
        const { value } = e.target;
        setTeamName(value)

    }
    const hendleClick = async () => {

        const param = {
            roomID: eventData.event.roomId,
            userID: userID,
            selectedTeam: getTeamName
        }
        console.log("hello", SET_USER_TEAM, param)
        fetch(SET_USER_TEAM, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param),
        })
            .then(data => data)
            .catch(err => console.log(err))

        console.log("SET_USER_TEAM=>",)

        setUrlObj({
            id: eventData.event.id,
            selectTeamName: getTeamName
        })
        // Router.push({
        //     pathname: '/[Team]/[TeamID]',
        //     query: {
        //         Team: `${eventData.homeTeam.name}-at-${eventData.awayTeam.name}`,
        //         TeamID: eventData.event.roomId
        //     },
        // })
        isSelectionModal(false)
        // setUserJoinEvent(false)
    }
    const checkSelection = async () => {
        const userData = Cookies.get('userInfo')
        const user = JSON.parse(userData)
        if (router.query.Room) {
            setUserID(user.id)

            const eventResponse = await fetch(`${GET_EVENTS}${router.query.Room}/`, {
                method: 'get',
            })
                .then(data => data)
                .catch(err => console.log(err))
            const eventData = await eventResponse.json();
            setEventData(eventData)

            const verifyAttendance = new URLSearchParams({
                user: user.id,
                event: eventData.id,
            })
            const attendanceResponse = await fetch(`${ATTENDEES}?${verifyAttendance}`, {
                method: 'GET',
            })
                .then(data => data)
                .catch(err => console.log(err))
            if (attendanceResponse.status === 200) {
                const data = await attendanceResponse.json();
                setUrlObj({
                    id: data[0].id,
                    chosenTeam: data[0].chosen_team
                })

                setEventTimer('00:00:00')
                setChatbox(true)
                //setBannerImage(URL + '/' + response.data.event.banner)
            } else {
                setShowJoinChatModal(true)
            }
        }
    }

    useEffect(() => {
        const token = Cookies.get('Token')
        if (token === undefined) {
            Router.push('/login')
            return
        }
        checkSelection();
    }, [router.query]);

    useEffect(async () => {

        if (urlObj) {
            console.log('userJoinEvent false');
            console.log('urlObj =>', urlObj, typeof urlObj);
            let obj = router.query
            console.log("boj", obj)
            // const isEmpty = Object.keys(obj).length === 0;
            let getEventData = {}
            // if (isEmpty === true) {
            //     console.log('isEmpty true')
            //     const eventSelectData = Cookies.get('selectEventData')
            //     getEventData = JSON.parse(eventSelectData)
            // } else {
            //     console.log('isEmpty False')
            //     Cookies.set('selectEventData', JSON.stringify(urlObj))
            //     const eventSelectData = Cookies.get('selectEventData')
            //     getEventData = JSON.parse(eventSelectData)
            // }
            console.log('isEmpty False')
            Cookies.set('selectEventData', JSON.stringify(urlObj))
            const eventSelectData = Cookies.get('selectEventData')
            getEventData = JSON.parse(eventSelectData)


            const checkObjectValue = Object.keys(getEventData).length === 0;
            if (checkObjectValue === true) {
                console.log('checkObjectValue TRUE')
                Router.push('/event')
                swal("Error", "Something is wrong. Please try again.", "error")
                return false
            }

            const userData = Cookies.get('userInfo')
            const user = JSON.parse(userData)

            //socket.emit("join", eventId, (response) => {
            //    if (response.statusCode === 200) {
            //        
            //    } else {
            //        swal("Error", "Something is wrong. Please try again.", "error")
            //        return false
            //    }
            //})
        }
    }, [userJoinEvent, urlObj])

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
            document.getElementById("userMessage").value = '';

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
        if (urlObj) {
            const getSelectedEventId = Cookies.get('selectEventData')
            const getSelectedEventData = JSON.parse(getSelectedEventId)
            //socket.on('counter', (response) => {
            //    if (response.eventId === parseInt(getSelectedEventData.id)) {
            //        if (response.eventStart === false) {
            //            setEventTimer(response.watingTime)
            //            setChatbox(false)
            //        } else {
            //            setEventTimer('00:00:00')
            //            setChatbox(true)
            //        }
            //    }
            //})

            //socket.on("thread", (response) => {
            //    const eventSelectData = Cookies.get('selectEventData')
            //    const getEventData = JSON.parse(eventSelectData)
            //    const getAllmsg = JSON.parse(localStorage.getItem('allMsg'));
            //    if (response.statusCode == 200) {
            //        var msgData = response.data
            //        if (parseInt(getEventData.id) === msgData.eventid) {
            //            getAllmsg.messages.push(msgData)
            //            setJoinUserDetail(getAllmsg)
            //        }
            //    } else {
            //        Router.push('/event', { shallow: true })
            //        swal("Error", "Currently this event is inactive. Please try again.", "error")
            //        return false
            //    }
            //})

            //socket.on("removeMessage", (response) => {
            //    if (response.statusCode === 200) {
            //        document.getElementById(response.data.id).remove();
            //    }
            //})
        }

    }, [urlObj])


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onClickSendMessage();
        }
    }

    const [gethomeTeamMsg, sethomeTeamMsg] = useState(null);
    const [getawayTeamMsg, setawayTeamMsg] = useState(null);
    const [gethostUserMsg, sethostUserMsg] = useState(null);

    useEffect(() => {
        const token = Cookies.get('Token')
        if (token) {
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
                        hostUserMsg.push(<p key={messages[i].id} id={messages[i].id}><b data-param={messages[i].user.id} onClick={handleShowProfile}><img data-param={messages[i].user.id} src={imageSet} className="chatModuleImg" /> {messages[i].user.userName}</b> {messages[i].message}</p>)
                    } else if (messages[i].sendertype === 'user' || messages[i].sendertype === 'admin') {
                        if (messages[i].type == 'home') {
                            homeTeamMsg.push(<p key={messages[i].id} id={messages[i].id}><b data-param={messages[i].user.id} onClick={handleShowProfile}><img data-param={messages[i].user.id} src={imageSet} className="chatModuleImg" /> {messages[i].user.userName}</b> {messages[i].message}</p>)
                        } else if (messages[i].type === 'away') {
                            awayTeamMsg.push(<p key={messages[i].id} id={messages[i].id}><b data-param={messages[i].user.id} onClick={handleShowProfile}><img data-param={messages[i].user.id} src={imageSet} className="chatModuleImg" />  {messages[i].user.userName}</b> {messages[i].message}</p>)
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
        }
    }, [getJoinUserDetail, urlObj])

    return (
        <>
            <Head>
                <title>Split-Side - Chat</title>
            </Head>
            <div>
                <div id="room">
                    {
                        eventData && <>

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
                                        <h4><b>Hosted:</b> {eventData.host.user_name}</h4>
                                        <h4><b>Location:</b> {eventData.stadium.name}</h4>
                                    </div>
                                    <div className="hosted-first-chat-box" id="hostMsgDiv">
                                        {gethostUserMsg}
                                    </div>
                                </div>
                                <div className="hosted-second-chat-form">
                                    <div className="team-chat-box-main">
                                        <div className="team-heading"><b>Away Team:</b> {eventData.away_team.name}</div>
                                        <div className="team-chat-box" id="awayMsgDiv">{getawayTeamMsg}</div>
                                    </div>
                                    <div className="team-chat-box-main right">
                                        <div className="team-heading"><b>Home Team:</b> {eventData.home_team.name}</div>
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

                <ProfileModal show={showProfile} userId={selectedUser} />
                {
                    eventData && <JoinChatModal show={showJoinChatModal} selectedEvent={eventData} onClose={handleCloseJoinChat} />
                }

            </div>
        </>
    )
}

export default React.memo(Room)