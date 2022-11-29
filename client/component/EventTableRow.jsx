import React, { useState, useRef } from 'react'
import Cookies from 'js-cookie'
import { DateTime } from 'luxon'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { GET_EVENTS } from '/context/AppUrl'

function EventTableRow({event}) {

    const [showCopied, setShowCopied] = useState(false);
    const copyTarget = useRef(null);

    const dateFormat = {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    }

    const timeFormat = {
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
    }

    const toggleShowCopied = () => {
        setShowCopied(!showCopied)
    }

    const eventURL = () => {
        return `${location.protocol}//${location.host}/event/${event.slug}/`
    }

    const deleteEvent = () => {
        swal({
            title: "Delete Event?",
            text: `Are you sure you want to delete this event?\n\n${event.name}`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((confirm) => {
            if (confirm) {
                fetch(`${GET_EVENTS}${event.slug}/`, {
                    method: 'delete',
                    headers: {
                        'Authorization': 'Token ' + Cookies.get("Token")
                    }
                }).catch(err => {
                    console.log(err)
                    swal("Error", "Unable to Delete Event. Please check the event URL and try again.", "error")
                }).then(() => {
                    swal("Success", "Event Deleted", "success")
                })
            }
        })
    }

    return (
        <tr>
            <td>{DateTime.fromISO(event.event_start_time).toLocaleString(dateFormat)}</td>
            <td>{DateTime.fromISO(event.event_start_time).toLocaleString(timeFormat)}</td>
            <td>{event.home_team.name}</td>
            <td>{event.away_team.name}</td>
            <td><a href={eventURL()}>Go To Chat</a></td>
            <td className="text-center">
                <Overlay target={copyTarget.current} show={showCopied} onHide={toggleShowCopied} placement="top" rootClose>
                    {(props) => (
                        <Tooltip id={`copy-tooltip-${event.id}`} {...props}>
                           Copied!
                        </Tooltip>
                    )}
                </Overlay>
                <CopyToClipboard text={eventURL()} onCopy={toggleShowCopied}>
                    <i className='fa-regular fa-clone' ref={copyTarget} ></i>
                </CopyToClipboard>
            </td>
            <td className="text-center">
                <i className="fa-regular fa-trash" style={{ color: 'red' }} onClick={deleteEvent}></i>
            </td>
        </tr>
    )
}

export default EventTableRow