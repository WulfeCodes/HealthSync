import React, { useEffect } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import Header from "../../shared/Header/header";
function Home(props) {
    function gotoDashboard(e) {
        e.preventDefault();
        window.location = "/dashboard"
    }

    function gotoChat(e) {
        e.preventDefault();
        window.location = "/chat"
    }


    return <>
        <div className="page1">
            <div className="main_content content">
                <Header setSignedIn={props.setSignedIn} signedIn={props.signedIn} openLogIn={props.openLogIn} closeLogIn={props.closeLogIn} openSignUp={props.openSignUp} closeSignUp={props.closeSignUp} />
                <div className="hero_title">

                    {props.signedIn ? <>
                        {props.user.name && props.user.type === "Doctor" ? <>
                            Welcome, Dr. {props.user.name}
                        </> : <>
                            {props.user.name && props.user.type === "Patient" ? <>
                                Welcome, {props.user.name}
                            </> : <>

                            </>}

                        </>}
                    </> : <>
                        Therapy for the Digital Age
                    </>}

                    <div className="btns">
                        {props.signedIn ?
                            <>
                                {props.user && props.user.type === "Doctor" ? <>
                                    <Link onClick={gotoDashboard} className="btn_link">
                                        <div className="btn1 try_btn">
                                            dashboard
                                        </div>
                                    </Link>
                                </> : <>

                                    {props.user && props.user.type === "Patient" ? <>
                                        <Link onClick={gotoChat} className="btn_link">
                                            <div className="btn1 try_btn">
                                                chat
                                            </div>
                                        </Link>
                                    </> : <>



                                    </>
                                    }


                                </>
                                }
                            </> :
                            <>
                                <Link onClick={props.openSignUp} className="btn_link">
                                    <div className="btn1 try_btn">
                                        sign up
                                    </div>
                                </Link>
                            </>
                        }
                        <a href="#about" className="btn_link">
                            <div className="btn1 learn_btn">
                                learn more
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Home;