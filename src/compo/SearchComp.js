import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { useStateValue } from "../compo/StateProvider"
import "../styles/search.css"
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { FirstLetterMaji, getDataAccToInp } from '../outils'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

  

const SearchComp = ({ waitingOnContact, setNewWaitingOnContact, currentUser, setCurrentContactFun }) => {

    const [users, setUsers] = useState([])
    const [state, dispatch] = useStateValue()
    const classes = useStyles();
    const [inp, setInp] = useState("")

    useEffect(() => {

        // Get all the users
        db.collection('users').onSnapshot(snap => setUsers(snap.docs.map(doc =>doc.data()).filter(x => x?.id !== state?.user?.uid)))
    }, [])

    const setStuff = (user) => {
        setCurrentContactFun(null)
        setNewWaitingOnContact(null)
        currentUser?.contacts?.some(x => x?.username === user?.username)
        ? setCurrentContactFun(user) : setNewWaitingOnContact(user)
    }


    return (
        <div className="search">
            <h1>Search</h1>
            <input type="text" placeholder="Type a Username ..." value={inp} onChange={e => setInp(e.target.value)} />
            <div>
                {(inp !== "" && getDataAccToInp(users, inp)?.length === 0) && <p>No Users By this username</p> }
                {getDataAccToInp(users, inp)?.filter(user => user?.id !== state?.user?.uid)?.map((user, index) => <div key={index} className={`${classes.root} search__each`}
                    onClick={() => setStuff(user)}
                >
                    <Avatar alt="profilePic" src={user?.photoURL} />
                    <h3>{ FirstLetterMaji(user.username)}</h3>
                </div>)}
            </div>
        </div>
    )
}

export default SearchComp
