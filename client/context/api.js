import { GET_CMS_CONTENT, GET_EVENTS, USER_DETAIL, ATTENDEES } from "./AppUrl"
import useSWR from 'swr'
import Cookies from 'js-cookie'
import axios from 'axios'

const jsonFetcher = (...args) => fetch(...args).then(res => res.json())
const htmlFetcher = (...args) => fetch(...args).then(res => res.text())

export function getCMSContent(name, setter) {
    fetch(GET_CMS_CONTENT + name + '/', {
        method: 'get',
    }).then(async (response) => {
        let responseText = await response.text();
        let contentHolder = document.createElement('div');
        contentHolder.innerHTML = responseText.trim();
        let innerContent = contentHolder.querySelector('#cms-content');
        setter(innerContent.outerHTML);
    }).catch(err => {
        console.log(err)
    });
}

export function useEvents(token) {
    let options = {}
    if (token) {
        options.headers = {
            'Authorization': 'Token ' + token
        }
    }
    const { data, error, mutate } = useSWR([GET_EVENTS, options], jsonFetcher)

  return {
    events: data,
    isLoadingEvents: !error && !data,
    isErrorEvents: error,
    mutate: mutate
  }
}

export function useUser(userId) {
    const config = {
        headers: {
            'Authorization': 'Token ' + Cookies.get("Token")
        }
    }
    const { data, error } = useSWR([USER_DETAIL + userId + '/', config], jsonFetcher)

    return {
        user: data,
        isLoadingUser: !error && !data,
        isErrorUser: error
    }
}

const getAttendance = async (userId, eventId) => {

    const verifyAttendance = new URLSearchParams({
        user: userId,
        event: eventId,
    })
    const attendanceResponse = await fetch(`${ATTENDEES}?${verifyAttendance}`, {
        headers: {
            'Authorization': 'Token ' + Cookies.get("Token")
        },
        method: 'GET',
    }).catch(err => console.log(err))

    const attendanceData = await attendanceResponse.json()
    if (attendanceData.length > 0) {
        return attendanceData[0]
    }
    return null
}

export const verifyAttendance = async (eventData) => {
    const userData = Cookies.get('userInfo')
    const user = JSON.parse(userData)

    const attendanceData = await getAttendance(user.id, eventData.id)

    if (attendanceData) {
        return attendanceData
    } else if (user.id === eventData.host.id) {
        // Host goes straight into room, choose home team for them
        const hostAttendaceRequest = await post(ATTENDEES, {
            'user': user.id,
            'event': eventData.id,
            'chosen_team': eventData.home_team.id
        })

        if (hostAttendaceRequest.status == 201) {
            return hostAttendaceRequest.data
        }
    }
    return null
}

export function post(url, data, onError) {

    let config = {
        method: 'post',
        url: url,
        headers: {
            'Authorization': 'Token ' + Cookies.get("Token"),
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config).catch((error) => {
        if (error.response && error.response.status && error.response.status == 401) {
            console.log("Need to re-login")
        }
        else {
            swal("Error", "There was a problem with your request. Please check your information and try again.", "error")
        }
        if (onError) {
            onError(error)
        }
    });
}