import React from 'react'
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
            {currentUser?.contacts?.map(contact => <div onClick={() => setCurrentContactFun(contact)} key={contact.username} className={`${classes.root} ${currentContact?.username === contact?.username && "contactscomp__eachSelected"} contactscomp__each`}>
                <Avatar alt="profilePic" src={contact?.photoURL} />
                <div>
                    <h3>{FirstLetterMaji(contact.username)}</h3>
                    <p>{ TheRightSize(contact.last_Msg)}</p>
                </div>    
            </div>)}
        </div>
    )
}

export default ContactsComp
