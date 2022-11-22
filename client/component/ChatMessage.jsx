import React, { useState, useEffect } from 'react'
import { Avatar } from "@material-ui/core";
import { DEFAULT_PROFILE_IMG } from '/context/AppUrl'
import { useUser } from '/context/api'

function ChatMessage({message, showProfile, cls}) {
    const { user, isLoadingUser, isErrorUser } = useUser(message.userId)
    const [profileImg, setProfileImg] = useState(DEFAULT_PROFILE_IMG)

    useEffect(() => {
        if (user && user.profile_image) {
            setProfileImg(user.profile_image)
        }
    }, [user]);

    return (
        <>
        {
            user &&
            <div className={"d-flex flex-row " + cls} onClick={()=> {showProfile(user.id)}}>
                {cls === 'home' && <Avatar src={profileImg} alt={user.username} style={{width: '25px', height: '25px'}} className={cls} />}
                <p id={message.messageId}>
                    <b data-user={message.userId} >
                        {user && <span data-user={message.userId}> {user.username}: </span>}
                    </b>
                    <span>{message.message}</span>
                </p>
                {cls === 'away' && <Avatar src={profileImg} alt={user.username} style={{width: '25px', height: '25px'}} className={cls} />}
            </div>
        }
        </>
    )
}

export default ChatMessage