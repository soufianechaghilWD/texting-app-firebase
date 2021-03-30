import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { FirstLetterMaji, getIdConversation } from '../outils'
import { useStateValue } from "../compo/StateProvider"
import "../styles/texting.css"
import { AiOutlineSend } from 'react-icons/ai'
import Picker from 'emoji-picker-react';
import { GrEmoji } from "react-icons/gr"

const TextingComp = ({ currentContact, waitingOnContact, setCurrentContactFun, setNewWaitingOnContact, currentUser }) => {

    const [msg, setMsg] = useState('')
    const [state, dispatch] = useStateValue()
    const [txts, setTxts] = useState([])
    const [lasMsgSeen, setLastMsgSeen] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [emojiSh, setEmojiSh] = useState(false)

    const onEmojiClick  = (event, emojiObject) => {
      setChosenEmoji(emojiObject);
      if(chosenEmoji?.emoji !== undefined) setMsg(msg + chosenEmoji?.emoji)
    };


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

    // Set the last_msg_seen if the last msg not from the user
    useEffect(() => {
        if(currentContact && txts[txts?.length - 1]?.sender !== state?.user?.uid){
            db.collection(currentContact?.othedid || currentContact?.id).doc(state?.user?.uid)?.update({
                last_Msg_seen: true
            })
        }
    }, [txts])

    // Set the LastMsgSeen variable if the contact has seen the Text
    useEffect(() => {
        setLastMsgSeen(currentUser?.contacts?.filter(x => x?.conversation_id === currentContact?.conversation_id)[0]?.last_Msg_seen)
    }, [currentUser, currentContact])

    const sendMsg = () => {
        if(waitingOnContact){
            // if the user is not in the contact list (Meaning: sending a new msg to a new contact)
            const configureSendingFirstMsg = new Promise((reso, reje) => {
                reso(db.collection(getIdConversation(waitingOnContact?.id, state?.user?.uid))
                .add({
                    sender: state?.user?.uid,
                    timeStamp: new Date(),
                    msgData: msg
                })
                .then(() => {
                    const UpdateTheSenderContactsList = new Promise((reso, reje) => {
                        reso(db.collection(state?.user?.uid).doc(waitingOnContact?.id).set({
                            conversation_id: getIdConversation(waitingOnContact?.id, state?.user?.uid),
                            othedid: waitingOnContact?.id,
                            last_Msg: msg,
                            last_Msg_seen: false,
                            last_Msg_sender: state?.user?.uid,
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
                            last_Msg_seen: false,
                            last_Msg_sender: state?.user?.uid,
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
                    timeStamp: new Date()
                }))
            })
            addTheMsg.then(() => {
                const updateMyContactLastMsg = new Promise((reso, reje) => {
                    reso(db.collection(state?.user?.uid).doc(currentContact?.othedid).update({
                        last_Msg: msg,
                        last_Msg_time: new Date(),
                        last_Msg_seen: false,
                        last_Msg_sender: state?.user?.uid,
                    }))
                })
                updateMyContactLastMsg.then(() => {
                    db.collection(currentContact?.othedid).doc(state?.user?.uid).update({
                        last_Msg: msg,
                        last_Msg_time: new Date(),
                        last_Msg_seen: false,
                        last_Msg_sender: state?.user?.uid,
                    })
                })
            })
        }
        setMsg('')
    }

    useEffect(() => {
        document.addEventListener('mouseup', function(e) {
            var container = document?.getElementById('emoji');
            if (!container?.contains(e.target)) {
              setEmojiSh(false)
            }
          });
    }, [])
    

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
                    {txts?.map((txt, index) =><div key={index} 
                    className={`${txt?.sender === state?.user?.uid && "texting__textfromMe"} texting__text`} 
                    id={`${index === txts.length - 1 && "last"}`}
                    >
                        {( lasMsgSeen === true && index === txts.length - 1) && <p className="txt__seen">Seen</p>}  
                        <small>{txt?.sender === state?.user?.uid ? FirstLetterMaji(state?.user?.displayName) : FirstLetterMaji(currentContact?.username)}</small>
                        <div>
                            <p>{txt?.msgData}</p>
                        </div>
                    </div>
                    ) }
                </div>
                <div className="form__wraper">
                    <button className="emoji__picker" onClick={(e) => { e.preventDefault(); setEmojiSh(!emojiSh)}}><GrEmoji onClick={(e) => { e.preventDefault(); setEmojiSh(!emojiSh)}} /></button>
                    <form className="texting__sending">
                        <input placeholder="Type your message ..." type="text" value={msg} onChange={e => setMsg(e.target.value)}/>
                        <button onClick={sendMsg} disabled={msg === ""}><AiOutlineSend /></button>

                        {emojiSh === true  && <div className="emoji__wraper" id="emoji">
                            <Picker onEmojiClick={onEmojiClick} />
                        </div>}
                        

                    </form>
                </div>
                
            </div>
        }

            
        </>

    )
}

export default TextingComp
