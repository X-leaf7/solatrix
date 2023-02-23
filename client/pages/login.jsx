import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Formik, Form, Field } from "formik";
import swal from 'sweetalert';
import * as Yup from "yup";
import Router from 'next/router'
import { useRouter } from 'next/router'
import ReCAPTCHA from "react-google-recaptcha";
import AppContext, { AuthContext } from "../context/AppContext";
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import Cookies from 'js-cookie'
import { LOGIN } from '/context/AppUrl'
import Head from 'next/head'

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please Provied valid email")
        .required("This is a Required Field"),
    password: Yup.string().required('This is a Required Field'),

});

function Login() {
    const { isLogin } = React.useContext(AppContext);
    const { signIn } = React.useContext(AuthContext);
    const router = useRouter()

    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(false);
    const [redirect, setRedirect] = useState(null);
    const recaptchaRef = React.createRef();

    const handlePasswordShow = () => {
        setIsPasswordShown(!isPasswordShown);
    }

    const handleLogin = useCallback(async (values) => {

        values['recaptcha'] = await recaptchaRef.current.executeAsync();

        if (values.remember) {
            Cookies.set('email', values.email);
        }

        const response = await fetch(LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values),
        })
            .then(data => data)
            .catch(err => console.log(err))

        if (response.status === 200) {
            const data = await response.json();
            Cookies.set('userInfo', JSON.stringify(data.user))
            Cookies.set('Token', data.auth_token)
            swal("Success", "You are now logged in.", "success");
            if (redirect) {
                Router.push(redirect)
            }
            else {
                Router.push('/')
            }
            signIn();
        } else if (response.status === 400) {
            console.log("Got an error!");
            swal("Error", "There was an error logging you in. Please check your username and password and try again.", "error");
        }

    }, [redirect, recaptchaRef])

    useEffect(() => {
        if (Cookies.get('isLogin')) {
            Router.push('/')
        }
        if (Cookies.get('email')) {
            const email = Cookies.get('email');
            setEmail(email)
        }
        setLoader(true)
    }, [email, password])

    useEffect(() => {
        if (router.query) {
            if (router.query.next) {
                setRedirect(router.query.next)
            }
        }
    }, [router.query]);

    return (
        <>
            <Head>
                <title>Split-Side - Login</title>
            </Head>
            <div>
                <section id="login" className="bg-light py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 mx-auto">
                                <div className="card shadow-sm">
                                    <div className="card-header text-center">
                                        <h5 className="mt-2">Login to Participate in Chat</h5>
                                    </div>

                                    {
                                        loader && <div className="card-body">
                                            <Formik
                                                initialValues={{
                                                    email: email,
                                                    password: password,
                                                    recaptcha: "",
                                                    remember: false
                                                }}
                                                validationSchema={loginSchema}
                                                validateOnChange={false}
                                                validateOnBlur={false}
                                                onSubmit={handleLogin}
                                            >
                                                {({ values, errors, touched, handleChange, handleBlur }) => (
                                                    <Form className="login">
                                                        <div className="form-group">
                                                            <label>Email*</label>
                                                            <Field
                                                                type="email"
                                                                className="form-control"
                                                                placeholder="Enter your email"
                                                                name="email"
                                                            />
                                                            {errors.email && touched.email ? (<p className="error-msg">{errors.email}</p>) : null}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Password*</label>
                                                            <div className="input-relative">
                                                                <Field
                                                                    type={isPasswordShown ? 'text' : 'password'}
                                                                    className="form-control"
                                                                    placeholder="Enter your password"
                                                                    name="password"
                                                                />
                                                                <div className="password-icon" onClick={handlePasswordShow}>
                                                                    {
                                                                        isPasswordShown ? <BsEye /> : <BsEyeSlash />
                                                                    }
                                                                </div>
                                                            </div>
                                                            {errors.password && touched.password ? (<p className="error-msg">{errors.password}</p>) : null}

                                                        </div>
                                                        <div className="form-group">
                                                            <ReCAPTCHA
                                                                sitekey="6Lfe0qokAAAAAEH9yTZnbUbKetdlrfLywvRCSFkQ"
                                                                ref={recaptchaRef}
                                                                name="recaptcha"
                                                                size="invisible"
                                                            />
                                                            {errors.recaptcha && touched.recaptcha ? (<p className="error-msg">{errors.recaptcha}</p>) : null}
                                                        </div>

                                                        <div className="form-check">
                                                            <Field type="checkbox" name='remember' className="form-check-input" />
                                                            <label className="form-check-label mb-3" htmlFor="exampleCheck1">Remember Me</label>
                                                            <div className='float-end'>
                                                                <Link href="/reset-password"><a className="btn m-0 p-0 secondaryAction" >Forgot Password?</a></Link>
                                                            </div>
                                                        </div>

                                                        <button className="btn btn-warning w-100" type="submit">Login</button>
                                                        <div className="row">
                                                            <div className="col-md-12 mt-3 mb-1 text-center">
                                                                Don&apos;t have an account? <Link href="/signup"><a className="get-started-link"><strong>Get Started</strong></a></Link>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>

                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}


export default React.memo(Login)

