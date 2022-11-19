import React, { useState, useEffect, useContext, useCallback } from 'react'
import AppContext from '/context/AppContext'
import Router, { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import swal from 'sweetalert';
import { io } from 'socket.io-client'
import { ATTENDEES, URL, PROFILE_IMG, GET_EVENTS, SET_USER_TEAM, SOCKET_URL } from '/context/AppUrl'
import { getAttendance } from '/context/api'
import Head from 'next/head'
import ProfileModal from '/component/ProfileModal'
import JoinChatModal from '/component/JoinChatModal'
import ChatMessage from '/component/ChatMessage'
let socket = io(SOCKET_URL)

function Room() {

    const router = useRouter()
    const { isLogin } = useContext(AppContext);
    const [getJoinUserDetail, setJoinUserDetail] = useState(null)
    const [getEventTimer, setEventTimer] = useState('00:00:00')
    const [getChatBox, setChatbox] = useState(false)
    const [showProfile, setShowProfile] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showJoinChatModal, setShowJoinChatModal] = useState(false);
    const [eventData, setEventData] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [registeredListeners, doneRegisteredListeners] = useState(false);

    const [otherUsersMessages, setOtherUsersMessages] = useState([]);
    const [hostUserMessages, setHostUserMessages] = useState([]);

    useEffect(() => {
        // Make sure we are logged in
        if (!Cookies.get("Token")) {
            Router.push('/login')
            return
        }
    }, []);

    useEffect(async () => {
        // Once the router has loaded the room name, fetch event details
        if (router.query.Room) {
            const eventResponse = await fetch(`${GET_EVENTS}${router.query.Room}/`, {
                method: 'get',
            }).catch(err => {
                console.log(err)
                swal("Error", "Unable to load Event. Please check the event URL and try again.", "error")
            })
            const eventData = await eventResponse.json();
            setEventData(eventData)
        }
    }, [router])

    useEffect(async () => {
        // Once we have eventData, verify attendance
        if (eventData) {
            const userData = Cookies.get('userInfo')
            const user = JSON.parse(userData)

            const attendanceData = await getAttendance(user.id, eventData.id)

            if (attendanceData) {
                setAttendance({
                    id: attendanceData.id,
                    chosenTeam: attendanceData.chosen_team
                })

                setEventTimer('00:00:00')
                setChatbox(true)
            } else {
                // Give the user a chance to pick a side
                setShowJoinChatModal(true)
            }
        }
    }, [eventData])


    useEffect(async () => {
        // Once we have verified attendance and loaded event data, we can join the room
        if (attendance && eventData) {
            const userData = Cookies.get('userInfo')
            const user = JSON.parse(userData)

            var joinEventData = {
                eventId: eventData.id,
                userId: user.id,
                token: Cookies.get("Token")
            }
            socket.emit("join", joinEventData, (response) => {
                if (response.success) {
                    if (response.messages) {
                        let userMessages = []
                        let hostMessages = []
                        const sortedMessages = response.messages.sort((a,b) => a.time - b.time)
                        sortedMessages.forEach((message) => {
                            if (message.userId == eventData.host.id) {
                                hostMessages.push(message)
                            }
                            else {
                                userMessages.push(message)
                            }
                        })
                        setHostUserMessages(hostMessages)
                        setOtherUsersMessages(userMessages)
                        scrollToTop('hostMsgDiv')
                        scrollToTop('userMsgDiv')
                    }
                } else {
                    swal("Error", "Unable to join the chat. Please try again.", "error")
                }
            })
        }
    }, [attendance, eventData])

    const handleShowProfile = async (event) => {
        const { user } = event.target.dataset;
        setSelectedUser(user)
        setShowProfile(true)
    }

    function handleCloseProfile() {
        setShowProfile(false)
        setSelectedUser(null)
    }

    function handleCloseJoinChat() {
        setShowJoinChatModal(false)
    }

    function scrollToTop(elementId) {
        var el = document.getElementById(elementId);
        el.scrollTop = el.scrollHeight;
    }

    const handleNewMessage = useCallback((newMessage) => {
        if (newMessage.userId == eventData.host.id) {
            setHostUserMessages(hostUserMessages => [...hostUserMessages, newMessage])
            scrollToTop('hostMsgDiv')
        } else {
            setOtherUsersMessages(awayTeamMessages => [...awayTeamMessages, newMessage])
            scrollToTop('userMsgDiv')
        }
    }, [eventData, hostUserMessages, otherUsersMessages])

    const onClickSendMessage = useCallback(() => {
        const message = document.getElementById('userMessage').value

        if (message.trim().length === 0) {
            swal("Error", "Please enter message.", "error")
            return false
        }

        if (!message) {
            swal("Error", "Please enter message.", "error")
            return false
        }

        if (message.length > 160) {
            swal("Error", "MaxLength is 160 characters", "error")
            return false
        }

        const userData = Cookies.get('userInfo')
        const user = JSON.parse(userData)

        var sendMessageData = {
            eventId: eventData.id,
            userId: user.id,
            teamId: attendance.chosenTeam,
            message: message,
            time: Date.now()
        }

        socket.emit('sendMessage', sendMessageData, (response) => {
            if (response.success) {
                document.getElementById("userMessage").value = '';
            }
        })
    }, [eventData, attendance])

    useEffect(async () => {
        if (eventData && !registeredListeners) {

            socket.on('newMessage', handleNewMessage)
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
            doneRegisteredListeners(true)
        }

    }, [eventData, registeredListeners])


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onClickSendMessage();
        }
    }

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
                                            <img src={eventData.banner} alt="" />
                                        </div>
                                    )}

                                </div>
                                <div className="hosted-first-chat-form">
                                    <div className="hosted-heading-main">
                                        <h4><b>Hosted:</b> {eventData.host.user_name}</h4>
                                        <h4><b>Location:</b> {eventData.stadium.name}</h4>
                                    </div>
                                    <div className="hosted-first-chat-box" id="hostMsgDiv">
                                        {hostUserMessages.map(message => <ChatMessage message={message} showProfile={handleShowProfile} key={message.messageId} cls="host" />)}
                                    </div>
                                </div>
                                <div className="hosted-first-chat-form">
                                    <div className="hosted-heading-main">
                                        <h4><b>Home Team:</b> {eventData.home_team.name}</h4>
                                        <h4><b>Away Team:</b> {eventData.away_team.name}</h4>
                                    </div>
                                    <div className="hosted-first-chat-box" id="userMsgDiv">
                                        {otherUsersMessages.map(message => <ChatMessage message={message} showProfile={handleShowProfile} key={message.messageId} cls={message.teamId === eventData.home_team.id ? "home" : "away"} />)}
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

                {
                    selectedUser && <ProfileModal show={showProfile} userId={selectedUser} onClose={handleCloseProfile} />
                }
                {
                    eventData && <JoinChatModal show={showJoinChatModal} selectedEvent={eventData} onClose={handleCloseJoinChat} />
                }

            </div>
        </>
    )
}

export default React.memo(Room)