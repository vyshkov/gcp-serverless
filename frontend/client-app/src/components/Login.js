import { GoogleLogin } from 'react-google-login';

const clientId = "736194043976-ks3e2r68img0ldda4danrbo9j9olvjf3.apps.googleusercontent.com"
// {
//     "error": "idpiframe_initialization_failed",
//     "details": "You have created a new client application that uses libraries for user authentication or authorization that will soon be deprecated. New clients must use the new libraries instead; existing clients must also migrate before these libraries are deprecated. See the [Migration Guide](https://developers.google.com/identity/gsi/web/guides/gis-migration) for more information."
// }
const Login = () => {

    const onSuccess = (res) => {
        console.log("Logged in", res);
    }

    const onFailure = (res) => {
        console.log("Fail", res);
    }

    return (
        <div id="signInButton">
            <GoogleLogin 
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )

}

export default Login;