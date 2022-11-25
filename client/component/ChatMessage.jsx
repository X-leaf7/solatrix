import React, { useContext, useState, useEffect } from 'react'
import { Avatar } from "@material-ui/core";
import { DEFAULT_PROFILE_IMG } from '/context/AppUrl'
import { useUser } from '/context/api'
import AppContext from '/context/AppContext'

function ChatMessage({message, showProfile, deleteMessage, cls}) {
    const { isStaff } = useContext(AppContext)
    const { user, isLoadingUser, isErrorUser } = useUser(message.userId)
    const [profileImg, setProfileImg] = useState(DEFAULT_PROFILE_IMG)

    useEffect(() => {
        if (user && user.profile_image) {
            setProfileImg(user.profile_image)
        }
    }, [user])

    const callDeleteMessage = (clickEvent) => {
        deleteMessage(message)

        // prevent profile modal from also triggering
        clickEvent.stopPropagation()
        clickEvent.nativeEvent.stopImmediatePropagation()
        return false
    }

    return (
        <>
        {
            user &&
            <div className={"d-flex flex-row " + cls} onClick={()=> {showProfile(user.id)}} id={message.messageId}>
                {cls === 'home' && <Avatar src={profileImg} alt={user.username} style={{width: '25px', height: '25px'}} className={cls} />}
                <p>
                    <b data-user={message.userId} >
                        {user && <span data-user={message.userId}> {user.username}: </span>}
                    </b>
                    <span>{message.message}</span>
                    {isStaff() && <i className="fa-regular fa-trash" style={{color: 'red', marginLeft: '5px'}} onClick={callDeleteMessage}></i>}
                </p>
                {cls === 'away' && <Avatar src={profileImg} alt={user.username} style={{width: '25px', height: '25px'}} className={cls} />}
            </div>
        }
        </>
    )
}

export default ChatMessage