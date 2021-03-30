import React, { useEffect } from 'react'
import { FirstLetterMaji, TheRightSize } from '../outils'
import "../styles/contactscomp.css"
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

  
  
const ContactsComp = ({ currentUser, setCurrentContactFun, currentContact }) => {

    const classes = useStyles();
    return (
        <div className="contactscomp">
            <h1>Contacts</h1>
            {currentUser?.contacts?.sort((a, b) => b.last_Msg_time - a.last_Msg_time)?.map((contact, index) => <div onClick={() => setCurrentContactFun(contact)} key={index} className={`${classes.root} ${currentContact?.username === contact?.username && "contactscomp__eachSelected"} contactscomp__each`}>
                <Avatar alt="profilePic" src={contact?.photoURL} />
                <div>
                    <h3>{FirstLetterMaji(contact.username)}</h3>
                    <p className={`${(contact?.last_Msg_seen === false && contact?.last_Msg_sender !== currentUser?.info?.id) && "txt__unseen"}`} >{ TheRightSize(contact.last_Msg)}
                    </p>
                </div>    
            </div>)}
        </div>
    )
}

export default ContactsComp
