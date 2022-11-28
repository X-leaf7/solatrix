import React, { useContext, useState, useEffect } from 'react'
import { Avatar } from "@material-ui/core";
import { DEFAULT_PROFILE_IMG } from '/context/AppUrl'
import { useUser } from '/context/api'
import AppContext from '/context/AppContext'
import swal from 'sweetalert'

function ChatMessage({message, eventData, showUserProfile, deleteMessage }) {
    const { isStaff } = useContext(AppContext)
    const { user, isLoadingUser, isErrorUser } = useUser(message.userId)
    const [profileImg, setProfileImg] = useState(DEFAULT_PROFILE_IMG)
    const [messageType, setMessageType] = useState(null)

    useEffect(() => {
        if (user && user.profile_image) {
            setProfileImg(user.profile_image)
        }
    }, [user])

    useEffect(() => {
        if (message.userId == eventData.host.id) {
            setMessageType('host')
        }
        else if (message.teamId == eventData.home_team.id) {
            setMessageType('home')
        }
        else {
            setMessageType('away')
        }
    }, [message, eventData])

    const callDeleteMessage = (clickEvent) => {
        swal({
            title: "Delete Message?",
            text: `Are you sure you want to delete this message?\n${user.username}: ${message.message}`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((confirm) => {
            if (confirm) {
                deleteMessage(message)
            }
        })

        // prevent profile modal from also triggering
        clickEvent.stopPropagation()
        clickEvent.nativeEvent.stopImmediatePropagation()
        return false
    }

    return (
        <>
        {
            user &&
            <div className={"d-flex flex-row " + messageType} onClick={()=> {showUserProfile(user.id)}} id={message.messageId}>
                {(messageType === 'home' || messageType == 'host') && <Avatar src={profileImg} alt={user.username} style={{width: '25px', height: '25px'}} className={messageType} />}
                <p>
                    <b data-user={message.userId} >
                        {user && <span data-user={message.userId}> {user.username}: </span>}
                    </b>
                    <span>{message.message}</span>
                    {isStaff() && <i className="fa-regular fa-trash" style={{color: 'red', marginLeft: '5px'}} onClick={callDeleteMessage}></i>}
                </p>
                {messageType === 'away' && <Avatar src={profileImg} alt={user.username} style={{width: '25px', height: '25px'}} className={messageType} />}
            </div>
        }
        </>
    )
}

export default ChatMessage