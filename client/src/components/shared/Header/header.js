import React from "react"
import { Link } from "react-router-dom"
import './index.css'

function Header(props) {
    function logOutUser() {
        document.cookie = 'email' + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location = "/"
    }

    return <>
        <div className="navbar">
            <Link to="/" className="logo">
                <div className="logo1">
                    AID
                </div>
                {/*
                <div className="logo2">
                    D your mind
                </div> */}
            </Link>
            <div className="navs">
                {/*
        <a href="/#jobs"className="jobs">
            <div className="jobs1">
                jobs
            </div>
        </a>
        <Link to="/jobs" className='jobs'>
            <div className="jobs1">
                jobs
            </div>
        </Link>
        <Link onClick={props.openSignUp} className={props.signedIn ? 'signup' : 'hide_nav'}>
            <div className="signup1">
                recruiters
            </div>
        </Link>
        <Link onClick={props.openSignUp} className={props.signedIn ? 'signup' : 'hide_nav'}>
            <div className="signup1">
                candidates
            </div>
        </Link>
    */}
                <Link onClick={props.openLogIn} className={!props.signedIn ? 'signup' : 'hide_nav'}>
                    <div className="signup1">
                        LOG IN
                    </div>
                </Link>
                <Link onClick={logOutUser} className={props.signedIn ? 'jobs' : 'hide_nav'}>
                    <div className="jobs1">
                        LogOut
                    </div>
                </Link>


            </div>
        </div>

    </>
}

export default Header;