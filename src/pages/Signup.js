import React, { useState } from 'react'
import "../styles/signup.css"
import Logo from '../files/BlackLogo.svg'
import { useHistory } from 'react-router-dom'
import { auth, db } from '../firebase'
import { useStateValue } from "../compo/StateProvider"


const Signup = () => {

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()
    const [ state , dispatch] = useStateValue();

    const signup = (e) => {
        e.preventDefault()

        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {

            // Update the User
            const updateProfile = new Promise((reso, reje) => {
                reso(authUser.user.updateProfile({
                    displayName: username,
                    photoURL: 'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png'
                }))
            })

            updateProfile.then(() => {
                auth.signInWithEmailAndPassword(email, password)
                .then((updated) => {

                    // Store the User in DB at AllUsers 
                    const storeTheUserInAllUsers = new Promise((reso, reje) => {
                        reso(db.collection(`users`).doc(`${updated.user.uid}`).set({
                            id: updated.user.uid,
                            email: email,
                            username: username,
                            photoURL: 'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png'
                        }))
                    })
                    storeTheUserInAllUsers.then(() => {

                        // Store the User in DB
                        const StoreTheUserInDB = new Promise((reso, reje) => {
                            reso(db.collection(`${updated.user.uid}`).doc('info').set({
                                id: updated.user.uid,
                                email: email,
                                username: username,
                                photoURL: 'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png'
                            }))
                        })
                        StoreTheUserInDB.then((userInDb) => {

                            // Store the user in the app State and go to the home page
                            const setTheUserInState = new Promise((reso, reje) => {
                                reso(dispatch({
                                    type: "SET__USER",
                                    user: updated.user
                                }))
                            })
                            setTheUserInState.then(() => {
                                history.push('/home')
                            })
                        })
                    })
                })
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
                        <label>Username</label>
                        <input placeholder="Type your username" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input placeholder="Type your password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>
                    <button onClick={signup}>Sign Up</button>
                </form>
                <p>If you already have an account <span onClick={() => history.push('/signin')} >Sign In</span></p>
            </div>
        </div>
    )
}

export default Signup
