
export const URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || ""

export const EVENT_LIST = `${URL}/api/front/event-list`

export const CURRENT_USER = `${URL}/api/front/current-user`

export const DECATICATE_USER = `${URL}/api/front/deactivateUser`

export const USER_UPDATE = `${URL}/api/front/user-update`

export const CHANGE_PASSWORD = `${URL}/api/front/changepassword`
export const UPDATE_PASSWORD = `${URL}/api/front/updatepassword`
export const GET_USER_DETAILS = `${URL}/api/user/getUserDetails?userid=`

export const JOIN_EVENT = `${URL}/api/joinevent`


export const PROFILE_IMG = `${URL}/img/profile_img.png`


export const EVENT_DETAILS = `${URL}/api/getEventDetails?id=`
export const GET_DETAILS = `${URL}/api/cms/getDetails?id=`

export const GET_EVENT = `${URL}/api/front/sendEventId?id=`


export const CHECK_EVENT_USER = `${URL}/api/front/checkEventUser?id=`

export const SET_USER_TEAM = `${URL}/api/front/setUserTeam`


// NEW DJANGO URLS

export const GET_CMS_PAGE = `${URL}/cms/`
export const GET_EVENTS = `${URL}/api/events/`
export const GET_SPORTS = `${URL}/api/sports/`
export const LOGIN = `${URL}/api/auth/token/login/`
export const REGISTRATION = `${URL}/api/auth/users/`
export const ACTIVATE = `${URL}/api/auth/users/activation/`
export const REQUEST_RESET_PASSWORD = `${URL}/api/auth/users/reset_password/`
export const PASSWORD_RESET = `${URL}/api/auth/users/reset_password_confirm/`
