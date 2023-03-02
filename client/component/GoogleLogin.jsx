import { useEffect } from 'react'
import Script from 'next/script'
import { GOOGLE_LOGIN } from '/context/AppUrl'

function GoogleLogin({context, textType, loginSuccess}) {
    useEffect(() => {
        // google handler needs to be referencable from the root window
        window.handleGoogleLogin = async function (googleCredentials) {
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
        }
    }, [loginSuccess]);

    return (
        <>
            <Script src="https://accounts.google.com/gsi/client" />
            <div id="g_id_onload"
                 data-client_id="401041321374-gc7pa91fpmoplvoimf1t9l91vbiqteuh.apps.googleusercontent.com"
                 data-context={context}
                 data-ux_mode="popup"
                 data-callback="handleGoogleLogin"
                 data-auto_prompt="false">
            </div>
            <div className="g_id_signin"
                 data-type="standard"
                 data-shape="rectangular"
                 data-theme="outline"
                 data-text={textType}
                 data-size="large"
                 data-logo_alignment="left">
            </div>
        </>
    )
}

export default GoogleLogin