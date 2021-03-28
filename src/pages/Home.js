import React, { useEffect, useState } from 'react'
import { useStateValue } from "../compo/StateProvider"
import { useHistory } from 'react-router-dom';
import { db } from '../firebase';
import { scaleTheArray } from '../outils'
import SearchComp from '../compo/SearchComp';
import TextingComp from '../compo/TextingComp';
import ContactsComp from '../compo/ContactsComp';
import Navbar from '../compo/Navbar';
import '../styles/home.css'

const Home = () => {

    const [state, dispatch] = useStateValue()
    const history = useHistory()
    const [currentUser, setCurrentUser] = useState(null)
    const [currentContact, setCurrentContact] = useState(null)
    const [waitingOnContact, setWaitingOnContact] = useState(null)

    // Check if the user is Logged in or not
    useEffect(() => {
        if(state?.user === null){
            history.push('/')
        }else{
            db.collection(`${state?.user?.uid}`).onSnapshot(snap => setCurrentUser(scaleTheArray(snap.docs.map(doc => doc.data()))))
        }
    }, [])

    const setCurrentContactFun = (newContact) => {
        setCurrentContact(newContact)
    }

    const setNewWaitingOnContact = (newContact) => {
        setWaitingOnContact(newContact)
    }

    return (
        <div className="home">
            <Navbar />
            <div className="home__content">
                <div className="home__contacts">
                    <ContactsComp  currentUser={currentUser} setCurrentContactFun={setCurrentContactFun} currentContact={currentContact} />
                </div>
                <div className="home__currentConversation">
                    <TextingComp setCurrentContactFun={setCurrentContactFun} currentContact={currentContact} waitingOnContact={waitingOnContact} setNewWaitingOnContact={setNewWaitingOnContact}/>
                </div>
                <div className="home__search">
                    <SearchComp currentUser={currentUser} waitingOnContact={waitingOnContact}  setNewWaitingOnContact={setNewWaitingOnContact} setCurrentContactFun={setCurrentContactFun} />
                </div>
            </div>
        </div>

    )
}

export default Home
