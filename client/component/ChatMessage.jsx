import React, { useState, useEffect } from 'react'
import { DEFAULT_PROFILE_IMG } from '/context/AppUrl'
import { useUser } from '/context/api'

function ChatMessage({message, showProfile}) {
    const { user, isLoadingUser, isErrorUser } = useUser(message.userId)
    const [profileImg, setProfileImg] = useState(DEFAULT_PROFILE_IMG)

    useEffect(() => {
        if (user && user.profile_image) {
            setProfileImg(user.profile_image)
        }
    }, [user]);

    return (
        <p id={message.messageId}>
            <b data-user={message.userId} onClick={showProfile}>
                <img data-user={message.userId} src={profileImg} className="chathead" /> 
                {user && <span data-user={message.userId}> {user.username}: </span>}
            </b>
            <span>{message.message}</span>
        </p>
    )
}

export default ChatMessage