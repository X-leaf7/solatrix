import React, { useEffect, useRef } from 'react'

function ChatBox({children, cls}) {

    const scrollContainer = useRef(null)

    useEffect(() => {
        const loadedChildren = scrollContainer.current.childElementCount
        const childCount = React.Children.count(children)
        if (loadedChildren > 0 && childCount == loadedChildren) {
            window.requestAnimationFrame(function() {
                if (scrollContainer.current) {
                    scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
                }
            });
        }
    }, [scrollContainer, children])

    return (
        <div className={"chat-box " + cls} ref={scrollContainer}>
            {children}
        </div>
    )
}

export default ChatBox