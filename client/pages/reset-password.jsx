import React, { useEffect } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import Router from 'next/router'
import { Formik, Field } from 'formik';
import axios from 'axios'
import swal from 'sweetalert';
import { REQUEST_RESET_PASSWORD } from '/context/AppUrl'
import Head from 'next/head'

function ResetPassword() {
    useEffect(() => {
        if (Cookies.get('isLogin')) {
            Router.push('/')
        }
    }, [])
    return (
        <>
             <Head>
                <title>Split-Side - Reset Password</title>
            </Head>
            <div>
            <section id="login" className="bg-light py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 mx-auto">
                            <div className="card shadow-sm">
                                <div className="card-header text-center">
                                    <h5 className="mt-2">Enter Your Account Email to Reset Your Password</h5>
                                </div>
                                <div className="card-body">
                                    <Formik
                                        initialValues={{ email: '' }}
                                        validate={values => {
                                            const errors = {};
                                            if (!values.email) {
                                                errors.email = 'Please enter email address';
                                            } else if (
                                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                            ) {
                                                errors.email = 'Please valid email address';
                                            }
                                            return errors;
                                        }}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            setSubmitting(false);
                                            const response = await fetch(REQUEST_RESET_PASSWORD, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    "email": values.email
                                                }),
                                            })
                                                .then(data => data)
                                                .catch(err => console.log(err))

                                            if (response.status == 204) {
                                                swal("Success", "Please check your email for instructions to reset your password.", "success");
                                            }
                                            else {
                                                swal("Error", "Email not found", "error");
                                            }
                                        }}
                                    >
                                        {({
                                            values,
                                            errors,
                                            touched,
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            isSubmitting,
                                        }) => (
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputEmail1">Email*</label>
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        name="email"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.email}
                                                        placeholder="Enter the email used to sign-up"
                                                    />
                                                    <p className="error-msg">{errors.email && touched.email && errors.email}</p>
                                                </div>
                                                <input type="submit" disabled={isSubmitting} className="btn btn-secondary w-100" value="Reset Password" />
                                                <div className="row">
                                                    <div className="col-md-12 mt-3 mb-1 text-center">
                                                        Remember your password? <Link href="/login"><a className="get-started-link"><strong>Login</strong></a></Link>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
         </div>
        </>
    )
}

export default React.memo(ResetPassword)

// export const getServerSideProps = async () => {
//     console.log("context.req.headers.cookie");
//     if (Cookies.get('isLogin')) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: true,
//             },
//         }
//     }
//     return {
//         props: {

//         },
//     }
// }