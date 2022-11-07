import React, { useState, useContext } from 'react'
import AppContext, { AuthContext } from "../context/AppContext";
import Router from 'next/router'
import swal from 'sweetalert';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Button, Modal } from 'react-bootstrap';
import AvatarPicker from "../component/AvatarPicker";
import Cookies from 'js-cookie'
import axios from 'axios';
import Head from 'next/head';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtom } from '@fortawesome/free-solid-svg-icons';

import { URL, CURRENT_USER, DECATICATE_USER, USER_UPDATE, CHANGE_PASSWORD } from '/context/AppUrl'
const editAccount = Yup.object().shape({
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
    newPassword: Yup.string()
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
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'The passwords entered do not match. Please try again.'),
    zipCode: Yup.string()
        .max(5, "Zipcode maxLength is 5 Characters")
        .min(1, "Zipcode minLength is 1 Characters")
        .matches(/^[0-9]+$/, "Only numbers allowed for this field")
        .nullable()
});
function EditAccount() {
    const { isLogin } = React.useContext(AppContext);

    const [data, setData] = useState(null)
    const { signOut } = useContext(AuthContext);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [password, setPassword] = useState('');
    const [avatarImage, setAvatarImage] = useState();
    const [token, setToken] = useState(null);
    const [image, setImages] = useState('img/user_profile_default.png');



    const handleImageChange = (imageFile) => {
        setAvatarImage(imageFile);
    };

    const handlePasswordShow = () => {
        setIsPasswordShown(!isPasswordShown);
    }

    function handleKeyPressname(e) {
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

    React.useEffect(async () => {
        if (Cookies.get('isLogin')) {
            setData("");
            const token = Cookies.get('Token')
            const userData = Cookies.get('userInfo')
            setToken(token)
            console.log("userData =>", userData)
            const user = JSON.parse(userData)


            let config = {
                method: 'get',
                url: CURRENT_USER,
                headers: {
                    'x-access-token': token
                },
                data: user.id
            };
            axios(config)
                .then((response) => {
                    if (user.image != null) {
                        setImages(`${URL}/${response.data.userDate.image}`)
                    }
                    console.log("Response =>", response.data);
                    setData(response.data.userDate)
                })
                .catch((error) => {
                    console.log("Somethink is wrong. please try again get profile api.");
                    setData(JSON.parse(userData))
                });
        }
        else {
            Router.push('/')
        }

    }, [])

    const logOut = () => {
        signOut();
    }

    function handleKeyPress(e) {
        if (e.target.value.length > e.target.maxLength) {
            e.target.value = e.target.value.slice(0, e.target.maxLength);
        }

        const key = e.key;
        if (!allowChars(key)) {
            e.preventDefault();
        }
    }

    function allowChars(charValue) {
        const acceptedKeys = '0123456789';
        return acceptedKeys.indexOf(charValue) > -1;
    }

    function deactivate() {
        const axios = require('axios');
        let data = '';

        let config = {
            method: 'put',
            url: DECATICATE_USER,
            headers: {
                'x-access-token': token
            },
            data: data
        };

        axios(config)
            .then((response) => {

                signOut();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const deactivateAccount = () => {
        swal({
            title: "Need a break?",
            text: "You can contact support@split-side.com to request reactivation of your account.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Hope to see you again soon! Your account has been deactivated", {
                        icon: "success",
                    });
                    deactivate();
                } else {
                    swal("Cancelled", "Your account is still active", "error");
                }
            });
    }

    const dataChange = async (value) => {
        const axios = require('axios');
        const FormData = require('form-data');
        let data = new FormData();
        data.append('firstName', value.firstName);
        data.append('lastName', value.lastName);
        data.append('userName', value.userName);
        data.append('email', value.email);

        data.append('city', value.city);
        data.append('state', value.state);
        data.append('about', value.about);

        const zipCodeValue = document.getElementById('zipcode').value
        data.append('zipCode', zipCodeValue);

        if (avatarImage) {
            data.append('image', avatarImage);
        }
        let config = {
            method: 'put',
            url: USER_UPDATE,
            headers: {
                'x-access-token': token
            },
            data: data
        };

        axios(config)
            .then((response) => {
                setData(response.data.userData)
                Cookies.set('userInfo', JSON.stringify(response.data.userData))
                swal("Success", "Your profile has been successfully updated.", "success");
            })
            .catch((error) => {
                swal("Error", "Please use a different username", "error");
            });
    }
    const changePassword = async (passwordNew) => {
        const axios = require('axios');
        let data = { "oldPassword": password, "newPassword": passwordNew };

        let config = {
            method: 'post',
            url: CHANGE_PASSWORD,
            headers: {
                'x-access-token': token
            },
            data: data
        };

        axios(config)
            .then((response) => {

                console.log("res", response)

                Router.push('/');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <Head>
                <title>Split-Side - Edit Profile</title>
            </Head>
            <div>
                <section id="login" className="bg-light py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 mx-auto">
                                <Accordion defaultActiveKey="0">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Profile</Accordion.Header>
                                        {
                                            data &&
                                            <Accordion.Body>
                                                <div className="card-body">

                                                    <Formik
                                                        initialValues={{
                                                            userImage: null,
                                                            userName: data.userName,
                                                            firstName: data.firstName,
                                                            lastName: data.lastName,
                                                            email: data.email,
                                                            currentPassword: password,
                                                            newPassword: "",
                                                            confirmPassword: "",
                                                            city: data.city,
                                                            state: data.state,
                                                            zipCode: data.zipCode,
                                                            about: data.about,
                                                            file: ''

                                                        }}
                                                        validationSchema={editAccount}
                                                        validateOnChange={false}
                                                        validateOnBlur={false}
                                                        onSubmit={async (values) => {

                                                            dataChange(values);
                                                            if (values.newPassword && values.confirmPassword) {
                                                                const password = values.newPassword
                                                                changePassword(password);
                                                            }
                                                        }}
                                                    >
                                                        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                                                            <Form className="editAccount">
                                                                <div className="profile-upload">

                                                                    <AvatarPicker
                                                                        handleChangeImage={handleImageChange}
                                                                        avatarImage={avatarImage}
                                                                        inputFile={image}
                                                                    />

                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Username</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="userName"
                                                                    />
                                                                    {errors.userName && (<p className="error-msg">{errors.userName}</p>)}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>First Name</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="firstName"
                                                                        onKeyPress={handleKeyPressname}
                                                                    />
                                                                    {errors.firstName && (<p className="error-msg">{errors.firstName}</p>)}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Last Name</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="lastName"
                                                                        onKeyPress={handleKeyPressname}
                                                                    />
                                                                    {errors.lastName && (<p className="error-msg">{errors.lastName}</p>)}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Email</label>
                                                                    <Field
                                                                        type="email"
                                                                        className="form-control"
                                                                        name="email"
                                                                    />
                                                                    {errors.email && touched.email ? (<p className="error-msg">{errors.email}</p>) : null}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Current Password</label>
                                                                    <div className="input-relative">
                                                                        <Field
                                                                            type={isPasswordShown ? 'text' : 'password'}
                                                                            className="form-control"
                                                                            name="currentPassword"
                                                                            disabled={true}
                                                                        />
                                                                        <div className="password-icon" onClick={handlePasswordShow}>
                                                                            {
                                                                                isPasswordShown ? <BsEye /> : <BsEyeSlash />
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    {errors.currentPassword && touched.currentPassword ? (<p className="error-msg">{errors.currentPassword}</p>) : null}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>New Password</label>
                                                                    <Field
                                                                        type="password"
                                                                        className="form-control"
                                                                        name="newPassword"
                                                                    />
                                                                    {errors.newPassword && touched.newPassword ? (<p className="error-msg">{errors.newPassword}</p>) : null}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Confirm Password</label>
                                                                    <Field
                                                                        type="password"
                                                                        className="form-control"
                                                                        name="confirmPassword"
                                                                    />
                                                                    {errors.confirmPassword && touched.confirmPassword ? (<p className="error-msg">{errors.confirmPassword}</p>) : null}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>City</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="city"
                                                                    />
                                                                    {errors.city && touched.city ? (<p className="error-msg">{errors.city}</p>) : null}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>State</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="state"
                                                                    />
                                                                    {errors.state && touched.state ? (<p className="error-msg">{errors.state}</p>) : null}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Zip Code</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="zipcode"
                                                                        name="zipCode"
                                                                        onKeyPress={handleKeyPress}
                                                                        maxLength={5}
                                                                    />
                                                                    {errors.zipCode && touched.zipCode ? (<p className="error-msg">{errors.zipCode}</p>) : null}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>About</label>
                                                                    <Field
                                                                        as="textarea"
                                                                        className="form-control"
                                                                        name="about"
                                                                    />
                                                                    {errors.about && touched.about ? (<p className="error-msg">{errors.about}</p>) : null}
                                                                </div>
                                                                <Field className="btn btn-success w-100" type="submit" value="Save" />
                                                                <div className="logoutDeactive">
                                                                    <div onClick={logOut}><a>Logout</a></div>
                                                                    <Button onClick={deactivateAccount}>Deactivate Account</Button>
                                                                </div>
                                                            </Form>
                                                        )}
                                                    </Formik>

                                                </div>
                                            </Accordion.Body>
                                        }
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Event</Accordion.Header>
                                        <Accordion.Body>
                                            <Table borderless>
                                                <thead>
                                                    <tr>
                                                        <td>Start Date</td>
                                                        <td>Start Time</td>
                                                        <td>Home Team</td>
                                                        <td>Away Team</td>
                                                        <td>Link</td>
                                                        <td>Copy Link</td>
                                                        <td>Actions</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>MM/DD/YYYY</td>
                                                        <td>12:30pm PT</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <th>Go to Chat</th>
                                                        <td><font-awesome-icon icon="fa-regular fa-clone" /></td>
                                                        <td>Delete</td>
                                                    </tr>
                                                    <tr>
                                                        <td>MM/DD/YYYY</td>
                                                        <td>12:30pm PT</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <th>Go to Chat</th>
                                                        <td><font-awesome-icon icon="fa-regular fa-clone" /></td>
                                                        <td>Delete</td>
                                                    </tr>
                                                    <tr>
                                                        <td>MM/DD/YYYY</td>
                                                        <td>12:30pm PT</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <th>Go to Chat</th>
                                                        <td><font-awesome-icon icon="fa-regular fa-clone" /></td>
                                                        <td>Delete</td>
                                                    </tr>
                                                    <tr>
                                                        <td>MM/DD/YYYY</td>
                                                        <td>12:30pm PT</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <th>Go to Chat</th>
                                                        <td><font-awesome-icon icon="fa-regular fa-clone" /></td>
                                                        <td>Delete</td>
                                                    </tr>
                                                    <tr>
                                                        <td>MM/DD/YYYY</td>
                                                        <td>12:30pm PT</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <td>Max. of 16 chars..</td>
                                                        <th>Go to Chat</th>
                                                        <td><font-awesome-icon icon="fa-regular fa-clone" /></td>
                                                        <td>Delete</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>

                            </div>
                        </div>
                    </div>
                </section>

                <div className="modal fade deActivateAccountModal" id="deActivateAccountModal" role="dialog" tabIndex='-1'>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h5>Need a break?</h5>
                                <p>You can login again at anytime to reactivate and resume using Split-Side.</p>
                                <div className="row">
                                    <div className="col-sm-12 text-center mb-3"><button data-dismiss="modal" className="btn btn-success text-uppercase" type="submit">nevermind</button></div>
                                    <div className="col-sm-12 text-center "><button data-dismiss="modal" data-toggle="modal" data-target="#confirmDeActivateAccountModal" data-keyboard="true" className="btn btn-danger text-uppercase" type="submit">deactivate</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade deActivateAccountModal" id="confirmDeActivateAccountModal" role="dialog" tabIndex='-1'>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <h5 className="mb-3">Hope to see you again soon!</h5>
                                <p className="mb-1">Your account has been deactivated</p>
                                <p>You will now be logged out.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default React.memo(EditAccount)

