import React, { useState } from 'react'
import "../styles/signup.css"
import Logo from '../files/BlackLogo.svg'
import { useHistory } from 'react-router-dom'
import { auth } from '../firebase'
import { useStateValue } from "../compo/StateProvider"



const Signin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()
    const [ state , dispatch] = useStateValue();

    const signup = (e) => {
        e.preventDefault()
        
        // Log In 
        auth.signInWithEmailAndPassword(email, password)
        .then((authUser) => {

                // Store the user in the app State and go to the home page
                const setTheUserInState = new Promise((reso, reje) => {
                reso(dispatch({
                    type: "SET__USER",
                    user: authUser.user
                }))
            })

            setTheUserInState.then(() => {
                history.push('/home')
            })
        })

    }


    return (
        <div className="signup">
            <div className="signup__content">
                <img src={Logo} alt="Logo" />
                <form>
                    <div>
                        <label>Email</label>
                        <input placeholder="Type your email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input placeholder="Type your password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <button onClick={signup}>Sign In</button>
                </form>
                <p>If you already have an account <span onClick={() => history.push('/')} >Sign Up</span></p>
            </div>
        </div>
    )
}

export default Signin
