import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";

const ReCaptcha = React.forwardRef((props, ref) => {

    const siteKey = "6Lfe0qokAAAAAEH9yTZnbUbKetdlrfLywvRCSFkQ";
    return (
        <div className="form-group">
            <ReCAPTCHA
                sitekey={siteKey}
                ref={ref}
                name="recaptcha"
                size="invisible"
            />
            {props.errors.recaptcha && props.touched.recaptcha ? (<p className="error-msg">{props.errors.recaptcha}</p>) : null}
        </div>
    )
});

export default ReCaptcha