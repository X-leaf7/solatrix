import React, { useState, useEffect, useContext, useCallback } from 'react'
import AppContext from '/context/AppContext'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import swal from 'sweetalert';
import { io } from 'socket.io-client'
import { ATTENDEES, GET_EVENTS, SOCKET_URL } from '/context/AppUrl'
import { getAttendance, post } from '/context/api'
import Head from 'next/head'
import ProfileModal from '/component/ProfileModal'
import JoinChatModal from '/component/JoinChatModal'
import ChatBox from '/component/ChatBox'
import ChatMessage from '/component/ChatMessage'
import EventTimer from '/component/EventTimer'

let socket = io(SOCKET_URL)

function Room() {
    const { checkLogin } = useContext(AppContext)

    const router = useRouter()

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
                    }
                    setOtherUsersMessages(userMessages)
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

    function handleCloseProfile() {
        setSelectedUser(null)
    }

    function handleCloseJoinChat() {
        setShowJoinChatModal(false)
        verifyAttendance()
    }

    function handleDeleteMessage(message) {
        socket.emit('deleteMessage', message, (response) => {
            if (response.success) {
                console.log("Removing message: " + message.messageId)
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

    const handleNewMessage = useCallback((newMessage) => {
        if (eventData.host && newMessage.userId == eventData.host.id) {
            setHostUserMessages(hostUserMessages => [...hostUserMessages, newMessage])
        } else {
            setOtherUsersMessages(otherUsersMessages => [...otherUsersMessages, newMessage])
        }
    }, [eventData, hostUserMessages, otherUsersMessages])

    const handleRemoveMessage = useCallback((deleteMessage) => {
        setHostUserMessages(hostUserMessages => [...hostUserMessages].filter(message => message.messageId !== deleteMessage.messageId))
        setOtherUsersMessages(otherUsersMessages => [...otherUsersMessages].filter(message => message.messageId !== deleteMessage.messageId))
    }, [hostUserMessages, otherUsersMessages])

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
        const socketHandlers = {
            newMessage: handleNewMessage,
            removeMessage: handleRemoveMessage,
            disconnect: handleDisconnect,
            reconnect: joinRoom
        }
        if (eventData) {
            for (const [evt, handler] of Object.entries(socketHandlers)) {
                socket.on(evt, handler)
            }

            return () => {
                // Clean up so that the page doesn't leak async effects
                for (const [evt, handler] of Object.entries(socketHandlers)) {
                    socket.off(evt, handler)
                }
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
                                <EventTimer eventData={eventData} />

                                { eventData.host &&
                                    <div className="chat-form mt-4">
                                        <div className="chat-heading-main">
                                            <h4><b>Host:</b> {eventData.host.username}</h4>
                                            <h4><b>Location:</b> {eventData.stadium.name}</h4>
                                        </div>
                                        <ChatBox>
                                            {hostUserMessages.map(message => <ChatMessage message={message} eventData={eventData} showUserProfile={setSelectedUser} deleteMessage={handleDeleteMessage} key={message.messageId} />)}
                                        </ChatBox>
                                    </div>
                                }
                                <div className="chat-form">
                                    <div className="chat-heading-main">
                                        <h4><b>Home Team:</b> {eventData.home_team.name}</h4>
                                        <h4><b>Away Team:</b> {eventData.away_team.name}</h4>
                                    </div>
                                    <ChatBox cls="large">
                                        {otherUsersMessages.map(message => <ChatMessage message={message} eventData={eventData} showUserProfile={setSelectedUser} deleteMessage={handleDeleteMessage} key={message.messageId} />)}
                                    </ChatBox>
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
                    selectedUser && <ProfileModal show={true} userId={selectedUser} onClose={handleCloseProfile} />
                }
                {
                    eventData && <JoinChatModal show={showJoinChatModal} selectedEvent={eventData} onClose={handleCloseJoinChat} />
                }

            </div>
        </>
    )
}

export default React.memo(Room)