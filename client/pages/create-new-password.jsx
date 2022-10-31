import React, { useState, useContext } from 'react'
import Link from 'next/link'
import * as Yup from 'yup'
import { Formik, Form, Field } from "formik";
import AppContext, { AuthContext } from "../context/AppContext";
import Router from 'next/router'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { UPDATE_PASSWORD } from '/context/AppUrl'

const createNewPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .matches(/^\S*$/, 'Whitespace is not allowed')
        .matches(
            // '^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&_-])[A-Z0-9@$!%*#?&_-]{8,18}$',
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%&*()+=^-_]).{8,20}$',
            // '^(?=.*?[A-Z])(?=.*[#!@$%^&*()+=-_])(?=.*?[0-9]).{8,20}$',
            `Must be a minimum of 8 characters and no longer that 20 \n 
        Must contain at least one uppercase letter \n 
        Must contain at least one lowercase letter \n 
        Must contain at least one number \n 
        Must  contain at least one special character such as !@#$%&*()+=^-_\n
        Must not contain any spaces`
        )
        .required('password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'The passwords entered do not match. Please try again.').required('Confirm Your Password'),
})

function CreatePassword() {
    const router = useRouter()
    const { signOut } = useContext(AuthContext);

    React.useEffect(async () => {
        if (Cookies.get('isLogin')) {
            signOut();
        }
    }, [])

    return (
        <>
            <section id="changepassword" className="bg-light py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 mx-auto">
                            <div className="card shadow-sm">
                                <div className="card-header text-center">
                                    <h5 className="mt-2">Reset Your Password</h5>
                                </div>
                                <div className="card-body">
                                    <Formik
                                        initialValues={{
                                            password: "",
                                            confirmPassword: "",
                                        }}
                                        validationSchema={createNewPasswordSchema}
                                        onSubmit={async (values) => {
                                            let token = '0'
                                            if (router.query) {
                                                if (router.query.token) {
                                                    token = router.query.token
                                                }
                                            }

                                            values.resetToken = token;

                                            const response = await fetch(UPDATE_PASSWORD, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify(values),
                                            })
                                                .then(data => data)
                                                .catch(err => console.log(err))

                                            const data = await response.json();
                                            if (data.status == 'success') {
                                                swal("Success", "Your password has been changed. Please login.", "success");
                                                Router.push('/login')
                                            } else {

                                                swal("Error", data.message, "error");
                                            }
                                        }}
                                    >
                                        {({ errors, touched }) => (
                                            <Form className="create_new_password">
                                                <div className="form-group">
                                                    <label>Password*</label>
                                                    <Field
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Enter new password"
                                                        name='password'
                                                    />
                                                    {errors.password && (<p className="error-msg">{errors.password}</p>)}

                                                </div>
                                                <div className="form-group">
                                                    <label>Confirm Password*</label>
                                                    <Field
                                                        type="password"
                                                        className="form-control"
                                                        placeholder="Confirm New password"
                                                        name='confirmPassword'
                                                    />
                                                    {errors.confirmPassword && (<p className="error-msg">{errors.confirmPassword}</p>)}
                                                </div>
                                                <button className="primaryAction btn btn-secondary w-100" type="submit">Reset password</button>
                                                <div className="row">
                                                    <div className="col-md-12 mt-3 mb-1 text-center">
                                                        Remember your password? <Link href="/login"><a className="get-started-link"><strong>Login</strong></a></Link>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default React.memo(CreatePassword)