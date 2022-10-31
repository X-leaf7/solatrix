import React, { useState, useContext } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/all.scss"
import "../styles/style.css"
import AppContext, { AuthContext } from "../context/AppContext";
import Layout from '../layout/default'
import Cookies from 'js-cookie'
import Router from 'next/router'
import swal from 'sweetalert';
import socketClient from "socket.io-client";
import { useRouter } from 'next/router'
import { GET_EVENTS, URL } from '/context/AppUrl'

function MyApp({ Component, pageProps }) {


    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
    };

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false,
                };
            case 'SIGNUP':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
        }
    };

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
    const router = useRouter()

    const authContext = React.useMemo(() => ({
        signIn: async () => {
            const userToken = 'user';
            const userName = 123;
            try {
                Cookies.set('isLogin', true)
                Cookies.set('userToken', userToken);
                setIsLogin(true);
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'LOGIN', id: userName, token: userToken });
        },
        signup: async () => {
            const userToken = 'new';
            try {
                Cookies.set('userToken', userToken);
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'SIGNUP', token: userToken });
        },
        signOut: async () => {
            try {
                if (router.pathname === '/create-new-password') {
                    Router.push('/')
                    swal("Success", "You have successfully logged out.", "success");
                } else {
                    Router.push('/')
                    swal("Success", "You have successfully logged out.", "success");
                }
                Cookies.remove("isLogin");
                Cookies.remove("Token");
                Cookies.remove("userInfo");
                Cookies.remove('password');
                setIsLogin(false);
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'LOGOUT' });
        }
    }), []);

    const [isLogin, setIsLogin] = useState(false);
    const [search, setSearch] = useState('');
    const [event, setEvent] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState({});
    React.useEffect(() => {
        if (Cookies.get('isLogin')) {
            setIsLogin(true);
        }
    }, [isLogin])

    // React.useEffect(() => {
    //     let socket = socketClient(URL)
    //     socket.on("forceLogout", (response) => {
    //         console.log("socket response", response)
    //         if (response.status == 'success') {
    //             if (Cookies.get('userInfo')) {
    //                 const userInfo = JSON.parse(Cookies.get('userInfo'))
    //                 if (userInfo.id === response.data.id) {
    //                     authContext.signOut();
    //                 }
    //             }
    //         }
    //     })
    // }, [URL])

    React.useEffect(async () => {
        await fetch(GET_EVENTS)
            .then(data => data.json())
            .then(setEvent)
            .catch(err => {
                setEvent([])
            })

    }, [])
    return (
        <AppContext.Provider value={{ isLogin, setIsLogin, search, setSearch, event, selectedTeam, setSelectedTeam }}>
            <AuthContext.Provider value={authContext}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AuthContext.Provider>
        </AppContext.Provider>
    );
}

export default React.memo(MyApp);

