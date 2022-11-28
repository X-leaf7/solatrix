import React, { useEffect, useRef } from 'react'

function ChatBox({children, cls}) {

    const scrollContainer = useRef(null)

    useEffect(() => {
        const checkLoaded = setInterval(() => {
            const loadedChildren = scrollContainer.current.childElementCount
            const childCount = React.Children.count(children)

            if (loadedChildren > 0 && childCount == loadedChildren) {
                window.requestAnimationFrame(function() {
                    if (scrollContainer.current) {
                        scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
                    }
                });
                clearInterval(checkLoaded)
            }
        }, 100)

        return () => {
            // Clean up so that the page doesn't leak async effects
            clearInterval(checkLoaded)
        }
    }, [scrollContainer, children])

    return (
        <div className={"chat-box " + cls} ref={scrollContainer}>
            {children}
        </div>
    )
}

export default ChatBox