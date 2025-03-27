import React, { useEffect, useState } from 'react'
import { DateTime, Interval } from 'luxon'

function EventTimer({eventData}) {

    const [getEventTimer, setEventTimer] = useState('00:00:00')
    const [showTimer, setShowTimer] = useState(true)

    useEffect(() => {
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

        return () => {
            // Clean up so that the page doesn't leak async effects
            clearInterval(eventTimer)
        }
    }, [eventData])

    return (
        <div className="event-start-main mb-2">
            {showTimer === true ? (
                <div>
                    <h3>Event Starts in… </h3>
                    <div className="event-time-box">
                        <p>{getEventTimer}</p>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default EventTimer