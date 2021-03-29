import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { FirstLetterMaji, getIdConversation } from '../outils'
import { useStateValue } from "../compo/StateProvider"
import "../styles/texting.css"
import { AiOutlineSend } from 'react-icons/ai'


const TextingComp = ({ currentContact, waitingOnContact, setCurrentContactFun, setNewWaitingOnContact }) => {

    const [msg, setMsg] = useState('')
    const [state, dispatch] = useStateValue()
    const [txts, setTxts] = useState([])

    useEffect(() => {
        if(currentContact !== null){
            // Getting the Msgs from DB
            db.collection(currentContact?.conversation_id || getIdConversation(currentContact?.id, state?.user?.uid))?.onSnapshot(snap => setTxts(snap?.docs?.map(doc => doc?.data())?.sort((a, b) => a.timeStamp - b.timeStamp)))
            
        }
        
    }, [currentContact])

    useEffect(() => {
        const last = document?.getElementById('last')
        last?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start' })
    }, [txts])
    
    const sendMsg = () => {
        if(waitingOnContact){
            // if the user is not in the contact list (Meaning: sending a new msg to a new contact)
            const configureSendingFirstMsg = new Promise((reso, reje) => {
                reso(db.collection(getIdConversation(waitingOnContact?.id, state?.user?.uid))
                .add({
                    sender: state?.user?.uid,
                    seenByReceiver: false,
                    timeStamp: new Date(),
                    msgData: msg
                })
                .then(() => {
                    const UpdateTheSenderContactsList = new Promise((reso, reje) => {
                        reso(db.collection(state?.user?.uid).doc(waitingOnContact?.id).set({
                            conversation_id: getIdConversation(waitingOnContact?.id, state?.user?.uid),
                            othedid: waitingOnContact?.id,
                            last_Msg: msg,
                            username: waitingOnContact.username,
                            photoURL: waitingOnContact.photoURL,
                            last_Msg_time: new Date()
                        }))
                    })
    
                    UpdateTheSenderContactsList.then(() => {
                        db.collection(waitingOnContact?.id).doc(state?.user?.uid).set({
                            conversation_id: getIdConversation(waitingOnContact?.id, state?.user?.uid),
                            othedid: state?.user?.uid,
                            last_Msg: msg,
                            username: state?.user?.displayName,
                            photoURL: state?.user?.photoURL,
                            last_Msg_time: new Date()
                        })
                    })
                    
                }))
            })
            configureSendingFirstMsg.then(() => {
                setCurrentContactFun(waitingOnContact)
                setNewWaitingOnContact(null)
            })
        }else{
            // If the user is already in the contact list
            const addTheMsg = new Promise((reso, reje) => {
                reso(db.collection(currentContact?.conversation_id || getIdConversation(currentContact?.id, state?.user?.uid)).add({
                    msgData: msg,
                    sender: state?.user?.uid,
                    seenByReceiver: false,
                    timeStamp: new Date()
                }))
            })
            addTheMsg.then(() => {
                const updateMyContactLastMsg = new Promise((reso, reje) => {
                    reso(db.collection(state?.user?.uid).doc(currentContact?.othedid).update({
                        last_Msg: msg,
                        last_Msg_time: new Date()
                    }))
                })
                updateMyContactLastMsg.then(() => {
                    db.collection(currentContact?.othedid).doc(state?.user?.uid).update({
                        last_Msg: msg,
                        last_Msg_time: new Date()
                    })
                })
            })
        }
        setMsg('')
    }


    return (
        <>

            {(currentContact === null && waitingOnContact === null ) ? 

            <div className="texting__null">
                <h1>No Conversation is opened</h1>
            </div>
            :
            <div className="texting__in">
                <h1>{ FirstLetterMaji(currentContact?.username) || FirstLetterMaji(waitingOnContact?.username)}</h1>
                <div className="texting__texts">
                    {txts?.map((txt, index) => <div key={index} 
                    className={`${txt?.sender === state?.user?.uid && "texting__textfromMe"} texting__text`} 
                    id={`${index === txts.length - 1 && "last"}`}
                    >
                        <small>{txt?.sender === state?.user?.uid ? FirstLetterMaji(state?.user?.displayName) : FirstLetterMaji(currentContact?.username)}</small>
                        <div>
                            <p>{txt?.msgData}</p>
                        </div>
                    </div>
                    ) }
                </div>
                <form className="texting__sending">
                    <input placeholder="Type your message ..." type="text" value={msg} onChange={e => setMsg(e.target.value)}/>
                    <button onClick={sendMsg} disabled={msg === ""}><AiOutlineSend /></button>
                </form>
            </div>
        }

            
        </>

    )
}

export default TextingComp
