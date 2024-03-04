import {useState, useRef} from "react";

function LoginPage({loggedIn}) {

    const [loginOrSignup, setLoginOrSignup] = useState("Login");
    const user = useRef('');
    const pass = useRef('');

    const handleChange = (event) => {
        setLoginOrSignup(event.target.value);
    };

    function validate(e) {
        e.preventDefault();
        const usernameFromRequest = user.current.value;
        const passwordFromRequest = pass.current.value;
        if (loginOrSignup === 'Login') {
            fetch('/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({usernameFromRequest, passwordFromRequest})
            }).then((response) => {
                return response.json();
            }).then((response) => {
                if (response.data === 'Ok') {
                    loggedIn(response.userDetails);
                } else {
                    alert('Wrong Username or Password');
                }
            }).catch((err) => {
                console.error(err);
            });
        } else {
            fetch('/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({usernameFromRequest, passwordFromRequest})
            }).then((response) => {
                return response.json();
            }).then((response) => {
                if (response.data === 'Ok') {
                    loggedIn(response.userDetails);
                } else {
                    alert('Username already exists');
                }
            }).catch((err) => {
                console.error(err);
            });
        }
        user.current.value = '';
        pass.current.value = '';
    }

    return (
        <div className="login-container">
            <div className="login-toggle">
                <label>
                    <input type="radio" name="login" value="Login" checked={loginOrSignup === "Login"} onChange={handleChange}/>
                    Login
                </label>
                <label>
                    <input type="radio" name="login" value="Signup" checked={loginOrSignup === "Signup"} onChange={handleChange}/>
                    Signup
                </label>
            </div>
            <form onSubmit={validate} className="login-form">
                <div className="login-input">
                    <p>Username</p>
                    <input type="text" name="username" maxLength="10" placeholder="Username" ref={user} required></input>
                </div>
                <div className="login-input">
                    <p>Password</p>
                    <input type="password" minLength="8" placeholder="Password" ref={pass} required></input>
                </div>
                <div>
                    <button type="submit">{loginOrSignup}</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;