import React, { useEffect, useState, useCallback } from 'react'
import { DateTime, Duration } from 'luxon'

function DaySelect({selected, setSelected}) {

    const oneWeek = Duration.fromObject({weeks: 1})

    const weekDisplayFormat = {
        month: 'long',
        year: 'numeric',
        day: 'numeric'
    }
    const dayNameFormat = {
        weekday: 'short'
    }
    const dayNumFormat = {
        day: 'numeric'
    }
    const [startDay, setStartDay] = useState(DateTime.now())
    const [sevenDays, setSevenDays] = useState([])

    const toggleSelected = useCallback((clickedDay) => {
        if (clickedDay == selected) {
            setSelected(null)
        }
        else {
            setSelected(clickedDay)
        }
    }, [selected])

    useEffect(() => {
        let nextSevenDays = []
        for (let dayIncrement=0; dayIncrement <=6; dayIncrement++) {
            nextSevenDays.push(startDay.plus(Duration.fromObject({days: dayIncrement})))
        }
        setSevenDays(nextSevenDays)
    }, [startDay])

    return (
        <div className="daySelector">
            <div className="weekDisplay">
                <span className="weekStart">{startDay.toLocaleString(weekDisplayFormat)}</span>
                <span className="weekSpacer"> - </span>
                <span className="weekEnd">{startDay.plus(oneWeek).toLocaleString(weekDisplayFormat)}</span>
            </div>
            <div className="daySelector d-flex flex-row">
                <div>
                    <span className="fa-stack fa-2x" onClick={() => setStartDay(startDay.minus(oneWeek))}>
                        <i className="fa-regular fa-circle fa-stack-2x"></i>
                        <i className="fa-regular fa-chevron-left fa-stack-1x warning" style={{paddingRight: '5px'}}></i>
                    </span>
                </div>
                
                {
                    sevenDays.map((day, i) =>
                        <div className={"align-self-center p-1 " + (selected == day ? "selected" : "")} onClick={() => toggleSelected(day)} key={i}>
                            <div className="dayName">
                                {day.toLocaleString(dayNameFormat).toUpperCase()}
                            </div>
                            <div className="dayNum">
                                {day.toLocaleString(dayNumFormat)}
                            </div>
                        </div>
                    )
                }
                <div>
                    <span className="fa-stack fa-2x" onClick={() => setStartDay(startDay.plus(oneWeek))} >
                        <i className="fa-regular fa-circle fa-stack-2x"></i>
                        <i className="fa-regular fa-chevron-right fa-stack-1x warning" style={{paddingLeft: '5px'}}></i>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default DaySelect