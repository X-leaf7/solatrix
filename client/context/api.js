import { GET_CMS_CONTENT, GET_EVENTS } from "./AppUrl"
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

export function useEvents() {
    const { data, error } = useSWR(GET_EVENTS, jsonFetcher)

  return {
    events: data,
    isLoadingEvents: !error && !data,
    isErrorEvents: error
  }
}

export function post(url, data) {

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
        console.log(error);
        swal("Error", "There was a problem with your request. Please check your information and try again.", "error");
    });
}