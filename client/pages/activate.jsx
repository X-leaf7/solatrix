import React, { useEffect, useState } from 'react'
import { ACTIVATE } from '/context/AppUrl'
import swal from 'sweetalert'
import Head from 'next/head'
import Router from 'next/router'

function Activate() {

    useEffect(async () => {
        const params = new URLSearchParams(window.location.search);
        console.log(params)
        const activationResponse = await fetch(ACTIVATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "uid": params.get("uid"),
                "token": params.get("token")
            })
        }).catch(err => {
            swal("Activation Failed", "Please try again", "failure");
        })

        if (activationResponse.status == 204) {
            swal("Success", "Your account has been activated!", "success").then(() => {
                Router.push('/login')
            });
        }

    }, [])
    return (
        <>
             <Head>
                <title>Split-Side - Activate Account</title>
            </Head>
            <div>
            <section id="activate" className="bg-light py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 mx-auto">
                            <h5 className="mt-2">Account Activation</h5>
                        </div>
                    </div>
                </div>
            </section>
         </div>
        </>
    )
}

export default React.memo(Activate)