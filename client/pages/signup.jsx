import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import swal from 'sweetalert';
import Router from 'next/router'
import ReCaptcha from "/component/ReCaptcha";
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import Cookies from 'js-cookie'
import { REGISTRATION } from '/context/AppUrl'
import Head from 'next/head'
import GoogleLoginWrapper from "/component/GoogleLoginWrapper";
import { AuthContext } from "../context/AppContext";


const SignupSchema = Yup.object().shape({
  userName: Yup.string()
    .max(16, "Username must be 4-16 characters with letters, numbers or underscores only")
    .min(4, "Username must be 4-16 characters with letters, numbers or underscores only")
    .matches(/^[A-Za-z0-9_]+$/, "Only letters, numbers and underscores are allowed for this field")
    .matches(/^\S*$/, 'Whitespace is not allowed')
    .required("This is a Required Field"),
  firstName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Only letters are allowed for this field")
    .matches(/^\S*$/, 'Whitespace is not allowed')
    .required("This is a Required Field"),
  lastName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Only letters are allowed for this field")
    .matches(/^\S*$/, 'Whitespace is not allowed')
    .required("This is a Required Field"),
  email: Yup.string()
    .email("Please Provied valid email")
    .matches(/^\S*$/, 'Whitespace is not allowed')
    .required("This is a Required Field"),
  password: Yup.string()
    .matches(/^\S*$/, 'Whitespace is not allowed')
    .matches(
      // '^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&_-])[A-Z0-9@$!%*#?&_-]{8,18}$',
      // '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*()+=-_]).{8,20}$',
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%&*()+=^-_]).{8,20}$',
      // '^(?=.*?[A-Z])(?=.*[#!@$%^&*()+=-_])(?=.*?[0-9]).{8,20}$',
      `Must be a minimum of 8 characters and no longer that 20 \n 
      Must contain at least one uppercase letter \n 
      Must contain at least one lowercase letter \n 
      Must contain at least one number \n 
      Must  contain at least one special character such as !@#$%&*()+=^-_\n
      Must not contain any spaces`
    )
    .required('This is a Required Field'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'The passwords entered do not match. Please try again.').required('This is a Required Field'),
  termAndCondition: Yup.bool()
            .oneOf([true], 'Please select T&C condition checkbox')
            .required('Please select T&C condition checkbox'),
});
const Signup = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const handlePasswordShow = () => {
    setIsPasswordShown(!isPasswordShown);
  }
  const recaptchaRef = React.createRef();
  const { signIn } = React.useContext(AuthContext);

  useEffect(() => {
    if (Cookies.get('isLogin')) {
      Router.push('/')
    }
  })

  function handleKeyPress(e) {
    var regex = new RegExp("^[a-zA-Z]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }
    else {
      e.preventDefault();
      return false;
    }
  }

  const finishGoogleSignup = useCallback(async (loginResponse) => {
    Cookies.set('userInfo', JSON.stringify(loginResponse.user));
    Cookies.set('Token', loginResponse.auth_token);
    swal("Success", "Thanks for signing up! Welcome to Split-Side!", "success");
    Router.push('/');
    signIn();
  })

  return (
    <>
             <Head>
                <title>Split-Side - Signup</title>
            </Head>
            <div>
      <section id="register" className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-lg-6 mx-auto">
              <div className="card shadow-sm">
                <div className="card-header text-center">
                  <h5 className="mt-2">Create an Account to Participate in Chat</h5>
                </div>
                <div className="card-body">
                  <Formik
                    initialValues={{
                      userName: "",
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      recaptcha: "",
                      termAndCondition : ""
                    }}
                    validationSchema={SignupSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={async (values) => {
                      const reCaptchToken = await recaptchaRef.current.executeAsync();
                      const credentials = {
                        username: values.userName,
                        first_name: values.firstName,
                        last_name: values.lastName,
                        email: values.email,
                        password: values.password,
                        recaptcha: reCaptchToken
                      }
                      const response = await fetch(REGISTRATION, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(credentials),
                      })
                        .then(data => data)
                        .catch(err => console.log(err))

                      if (response.status === 201) {
                        swal("Success", "Please click the link in your email to verify your account and complete the registration process.", "success");
                        Router.push('/')
                      } else if (response.status === 400) {
                        const data = await response.json();
                        swal("Error", data.message, "error");
                      }


                    }}
                  >
                    {({ values, errors, touched }) => (
                      <Form className="signup">
                        <GoogleLoginWrapper context="signup" textType="signup_with" loginSuccess={finishGoogleSignup} />
                        <p className="loginDivider"><span>or</span></p>
                        <div className="form-group">
                          <label htmlFor="exampleInputUsername">Username*</label>
                          <Field
                            type="text"
                            className="form-control"
                            placeholder="Enter your username"
                            name="userName"
                          />
                          {errors.userName && (<p className="error-msg">{errors.userName}</p>)}
                          <small id="emailHelp" className="form-text text-muted">Displayed in chat rooms, may be changed at anytime</small>
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputFirstName">First Name*</label>
                          <Field
                            type="text"
                            className="form-control"
                            placeholder="Enter your first name"
                            name="firstName"
                            onKeyPress={handleKeyPress}
                          />
                          {errors.firstName && (<p className="error-msg">{errors.firstName}</p>)}
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputLastName">Last Name*</label>
                          <Field
                            type="text"
                            className="form-control"
                            placeholder="Enter your last name"
                            name="lastName"
                            onKeyPress={handleKeyPress}
                          />
                          {errors.lastName && (<p className="error-msg">{errors.lastName}</p>)}
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Email*</label>
                          <Field
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            name="email"
                          />
                          {errors.email && touched.email ? (<p className="error-msg">{errors.email}</p>) : null}
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputPassword1">Password*</label>
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
                          <small id="emailHelp" className="form-text text-muted">Min. 8 characters, containing at least one capital letter, number, and one special character</small>
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputConfirmPassword">Confirm Password*</label>
                          <Field
                            type="password"
                            className="form-control"
                            placeholder="Enter your password again"
                            name="confirmPassword"
                          />
                          {errors.confirmPassword && touched.confirmPassword ? (<p className="error-msg">{errors.confirmPassword}</p>) : null}
                        </div>
                        <ReCaptcha ref={recaptchaRef} errors={errors} touched={touched} />

                         <div className="form-check">
                            <Field type="checkbox" name='termAndCondition' className="form-check-input" />
                            <label className="form-check-label" htmlFor="exampleCheck1"> I agree to the Terms & Privacy Policy</label>
                            {errors.termAndCondition && touched.termAndCondition ? (<p className="error-msg">{errors.termAndCondition}</p>) : null}
                            
                        </div>

                        <button type="submit" className="btn btn-warning w-100 newClassAdd" >Sign-Up</button>
                        <div className="row">
                          <div className="col-md-12 mt-3 mb-1 text-center">
                            Already have an account?{" "}
                            <Link href="/login">
                              <a className="get-started-link">
                                <strong>Login</strong>
                              </a>
                            </Link>
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
    </div>
        </>
  );
};

export default React.memo(Signup);
