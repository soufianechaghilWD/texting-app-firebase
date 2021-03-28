import React from 'react'
import { useStateValue } from "../compo/StateProvider"
import { FirstLetterMaji } from '../outils'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Logo from '../files/WhiteLogo.svg'
import '../styles/nav.css'
import { auth } from '../firebase';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

  
const Navbar = () => {

    const [state, dispatch] = useStateValue()
    const classes = useStyles();
    const history = useHistory()

    const logout = () => {
        auth.signOut()
        .then(() => {
            history.push('/')
        })
    }

    return (
        <nav>
            <div className="nav__content">
                <div className={`${classes.root} navbar__avatarAndUsername`}  >
                    <Avatar alt="profilePic" src={state?.user?.photoURL} />
                    <h3>{ FirstLetterMaji(state?.user?.displayName)}</h3>
                </div>
                <div className="navbar__logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="navbar__logout">
                    <button onClick={logout}>Log out</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
