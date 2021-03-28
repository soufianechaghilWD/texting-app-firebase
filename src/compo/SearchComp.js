import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { useStateValue } from "../compo/StateProvider"

const SearchComp = ({ waitingOnContact, setNewWaitingOnContact, currentUser, setCurrentContactFun }) => {

    const [users, setUsers] = useState([])
    const [state, dispatch] = useStateValue()

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
        <div>
            <h1>Search</h1>
            <div>
                {users?.filter(user => user?.id !== state?.user?.uid)?.map(user => <div key={user.email} style={{cursor: 'pointer'}}
                    onClick={() => setStuff(user)}
                >
                    {user.username}
                </div>)}
            </div>
        </div>
    )
}

export default SearchComp
