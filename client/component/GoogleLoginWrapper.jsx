import { useEffect, useCallback, useState } from 'react'
import Script from 'next/script'
import { GOOGLE_LOGIN } from '/context/AppUrl'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'

function GoogleLoginWrapper({context, textType, loginSuccess}) {

    const handleGoogleLogin = useCallback(async (googleCredentials) => {
        const response = await fetch(GOOGLE_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(googleCredentials)
        });
        if (response.status === 200) {
            const data = await response.json();
            loginSuccess(data)
        } else {
            swal("Error", "There was an error logging you in with your google account. Please try again.", "error");
        }
    }, [loginSuccess]);

    return (
        <GoogleOAuthProvider clientId="401041321374-gc7pa91fpmoplvoimf1t9l91vbiqteuh.apps.googleusercontent.com">
            <div className="google_signin">
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    text={textType}
                    context={context}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    ux_mode="popup"
                />
            </div>
        </GoogleOAuthProvider>
    )
}

export default GoogleLoginWrapper