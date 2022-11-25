import React, { useState, useEffect, useContext, useCallback } from 'react'
import AppContext from '/context/AppContext'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import swal from 'sweetalert';
import { io } from 'socket.io-client'
import { DateTime, Interval } from 'luxon'
import { ATTENDEES, GET_EVENTS, SOCKET_URL } from '/context/AppUrl'
import { getAttendance, post } from '/context/api'
import Head from 'next/head'
import ProfileModal from '/component/ProfileModal'
import JoinChatModal from '/component/JoinChatModal'
import ChatMessage from '/component/ChatMessage'
let socket = io(SOCKET_URL)

function Room() {
    const { checkLogin } = useContext(AppContext)

    const router = useRouter()
    const [getEventTimer, setEventTimer] = useState('00:00:00')
    const [showTimer, setShowTimer] = useState(true)
    const [showProfile, setShowProfile] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showJoinChatModal, setShowJoinChatModal] = useState(false);
    const [eventData, setEventData] = useState(null);
    const [attendance, setAttendance] = useState(null);

    const [otherUsersMessages, setOtherUsersMessages] = useState([]);
    const [hostUserMessages, setHostUserMessages] = useState([]);

    useEffect(async () => {
        // Once the router has loaded the room name, fetch event details
        if (router.query.Room) {
            const eventResponse = await fetch(`${GET_EVENTS}${router.query.Room}/`, {
                method: 'get',
            }).catch(err => {
                console.log(err)
                swal("Error", "Unable to load Event. Please check the event URL and try again.", "error")
            })
            const eventResponseData = await eventResponse.json();
            setEventData(eventResponseData)
        }
    }, [router])

    const joinRoom = useCallback(() => {
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
                        if (message.redacted) {
                            // Don't show redacted messages
                            return
                        }
                        if (eventData.host && message.userId == eventData.host.id) {
                            hostMessages.push(message)
                        }
                        else {
                            userMessages.push(message)
                        }
                    })

                    if (eventData.host) {
                        setHostUserMessages(hostMessages)
                        scrollToTop('hostMsgDiv')
                    }
                    setOtherUsersMessages(userMessages)
                    scrollToTop('userMsgDiv')
                }
            } else {
                swal("Error", "Unable to join the chat. Please try again.", "error")
            }
        })
    }, [eventData])

    const verifyAttendance = useCallback(async () => {
        const userData = Cookies.get('userInfo')
        const user = JSON.parse(userData)

        const attendanceData = await getAttendance(user.id, eventData.id)

        if (attendanceData) {
            setAttendance(attendanceData)
            joinRoom()
        } else {
            // Host goes straight into room, choose home team for them
            if (user.id === eventData.host.id) {
                post(ATTENDEES, {
                    'user': user.id,
                    'event': eventData.id,
                    'chosen_team': eventData.home_team.id
                }).then((response) => {
                    if (response.status == 201) {
                        setAttendance(response.data)
                        joinRoom()
                    }
                });
            }
            else {
                // Give the user a chance to pick a side
                setShowJoinChatModal(true)
            }
        }
    }, [eventData])

    useEffect(() => {
        if (eventData) {
            checkLogin(verifyAttendance, `/event/${eventData.slug}/`)
        }
    }, [eventData]);

    const handleShowProfile = async (userId) => {
        setSelectedUser(userId)
        setShowProfile(true)
    }

    function handleCloseProfile() {
        setShowProfile(false)
        setSelectedUser(null)
    }

    function handleCloseJoinChat() {
        setShowJoinChatModal(false)
    }

    function handleDeleteMessage(message) {
        socket.emit('deleteMessage', message, (response) => {
            if (response.success) {
                console.log("Removing message: " + message.id)
            }
        })
    }

    function handleDisconnect (reason) {
        console.log("WS disconnect: " + reason)
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, we need to reconnect manually
          socket.connect();
        }
        // else the socket will automatically try to reconnect
    }

    function scrollToTop(elementId) {
        debugger
        window.requestAnimationFrame(function() {
            debugger
            var el = document.getElementById(elementId);
            if (el) {
                // Sometimes the element doesn't exist yet, wait until it does
                el.scrollTop = el.scrollHeight;
            }
        });
    }

    const handleNewMessage = useCallback((newMessage) => {
        if (eventData.host && newMessage.userId == eventData.host.id) {
            setHostUserMessages(hostUserMessages => [...hostUserMessages, newMessage])
            scrollToTop('hostMsgDiv')
        } else {
            setOtherUsersMessages(awayTeamMessages => [...awayTeamMessages, newMessage])
            scrollToTop('userMsgDiv')
        }
    }, [eventData, hostUserMessages, otherUsersMessages])

    const handleRemoveMessage = (message) => {
        const messageEl = document.getElementById(message.messageId)
        if (messageEl) {
            messageEl.parentNode.removeChild(messageEl)
        }
    }

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
            teamId: attendance.chosen_team,
            message: message,
            time: Date.now()
        }

        socket.emit('sendMessage', sendMessageData, (response) => {
            if (response.success) {
                document.getElementById("userMessage").value = '';
            }
        })
    }, [eventData, attendance])

    useEffect(() => {
        if (eventData) {

            socket.on('newMessage', handleNewMessage)
            socket.on('removeMessage', handleRemoveMessage)

            socket.on('disconnect', handleDisconnect);
            socket.on('reconnect', joinRoom)

            const eventTimer = setInterval(() => {
                const now = DateTime.now();
                const startTime = DateTime.fromISO(eventData.event_start_time)
                const timeLeft = Interval.fromDateTimes(now, startTime).toDuration(['hours', 'minutes', 'seconds'])
                
                if (timeLeft.invalid) {
                    setShowTimer(false)
                    clearInterval(eventTimer)
                }
                else {
                    setEventTimer(timeLeft.toFormat("hh:mm:ss"))
                }
            }, 1000)

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

            return () => {
                // Clean up so that the page doesn't leak async effects
                clearInterval(eventTimer)
                socket.off('newMessage', handleNewMessage)
            }
        }

    }, [eventData])


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
                                    {showTimer === true ? (
                                        <h3>Event Starts in… </h3>
                                    ) : (
                                        <h3></h3>
                                    )}

                                    {showTimer === true ? (
                                        <div className="event-time-box">
                                            <p>{getEventTimer}</p>
                                        </div>
                                    ) : (
                                        <div className="event-time-box" style={{ 'border': 'none' }}>
                                            <img src={eventData.banner} alt="" />
                                        </div>
                                    )}

                                </div>
                                { eventData.host &&
                                    <div className="chat-form">
                                        <div className="chat-heading-main">
                                            <h4><b>Host:</b> {eventData.host.username}</h4>
                                            <h4><b>Location:</b> {eventData.stadium.name}</h4>
                                        </div>
                                        <div className="chat-box" id="hostMsgDiv">
                                            {hostUserMessages.map(message => <ChatMessage message={message} showProfile={handleShowProfile} deleteMessage={handleDeleteMessage} key={message.messageId} cls="home" />)}
                                        </div>
                                    </div>
                                }
                                <div className="chat-form">
                                    <div className="chat-heading-main">
                                        <h4><b>Home Team:</b> {eventData.home_team.name}</h4>
                                        <h4><b>Away Team:</b> {eventData.away_team.name}</h4>
                                    </div>
                                    <div className="chat-box large" id="userMsgDiv">
                                        {otherUsersMessages.map(message => <ChatMessage message={message} showProfile={handleShowProfile} deleteMessage={handleDeleteMessage} key={message.messageId} cls={message.teamId === eventData.home_team.id ? "home" : "away"} />)}
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Start typing..." aria-label="Type chat message here" aria-describedby="basic-addon2" id="userMessage" onKeyPress={handleKeyPress} />
                                    <div className="input-group-append">
                                        <button className="btn btn-warning" type="button" onClick={onClickSendMessage}>Post</button>
                                    </div>
                                </div>
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