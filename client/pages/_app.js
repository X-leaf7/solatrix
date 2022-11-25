import React, { useState } from 'react'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import "../styles/style.scss"
import AppContext, { AuthContext } from "../context/AppContext";
import Layout from '../layout/default'
import Cookies from 'js-cookie'
import Router from 'next/router'
import swal from 'sweetalert';
import { useRouter } from 'next/router'
import { LOGOUT } from '/context/AppUrl'

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

    const flushCookie = async () => {
        Cookies.remove("isLogin");
        Cookies.remove("Token");
        Cookies.remove("userInfo");
        setIsLogin(false);
    };

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
                const token = Cookies.get("Token");

                fetch(LOGOUT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + token
                    }
                })

                flushCookie();

                Router.push('/')
                swal("Success", "You have successfully logged out.", "success")
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'LOGOUT' });
        },
        flushCookie: flushCookie
    }), []);

    const [isLogin, setIsLogin] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedTeam, setSelectedTeam] = useState({});

    const checkLogin = (nextAction, postLoginRedirect) => {
        if (Cookies.get('isLogin')) {
            nextAction()
        }
        else {
            let loginRoute = '/login'
            if (postLoginRedirect) {
                loginRoute = loginRoute + '?next=' + postLoginRedirect
            }
            Router.push(loginRoute)
        }
    };

    const isStaff = () => {
        const userInfo = JSON.parse(Cookies.get('userInfo'))
        return userInfo.is_staff
    }

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

    return (
        <AppContext.Provider value={{ isLogin, setIsLogin, checkLogin, isStaff, search, setSearch, selectedTeam, setSelectedTeam }}>
            <AuthContext.Provider value={authContext}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AuthContext.Provider>
        </AppContext.Provider>
    );
}

export default React.memo(MyApp);

