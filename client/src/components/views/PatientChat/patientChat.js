import React from 'react';
import './index.css';
import { useState, useEffect, useRef } from 'react';
import Header from '../../shared/Header/header';
import "./index.css"
import { AI_RESPONSE, UPDATE_CHATS } from '../../../apiConfig';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaCamera } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { Avatar } from './Avatar/Avatar';

function PatientChat(props) {
    console.log(props)
    const { user } = props;
    const [newMessage, setNewMessage] = useState('');
    const [chats, setChats] = useState(['']);
    const [selectedRespondent, setSelectedRespondent] = useState("AI");

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    function toggleRespondent() {
        if (selectedRespondent === "Doc") {
            setSelectedRespondent("AI")
        }
        else {
            setSelectedRespondent("Doc")
        }
    }

    function toggleSpeech() {
        if (listening) {
            SpeechRecognition.stopListening()
        }
        else {
            SpeechRecognition.startListening()
        }
    }

    const saveAIMessage = async (ai_response, newChats) => {
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().slice(0, 10);
            const timeString = currentDate.toLocaleTimeString();

            const chatMessage = {
                content: `AI: ${ai_response}`,
                date: dateString,
                time: timeString
            };

            const response = await fetch(UPDATE_CHATS, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: props.user.email,
                    newChats: [...newChats, chatMessage]
                })
            });

            const data = await response.json();

            if (data.status === 'ok') {
                console.log("User Chats Updated");
            } else {
                console.error("Failed to update user chats");
            }
        } catch (error) {
            console.error("Error updating user chats:", error);
        }
    };

    async function getAIResponse(a) {
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().slice(0, 10);
            const timeString = currentDate.toLocaleTimeString();

            const chatMessage = {
                content: `${user.name}: ${a}`,
                date: dateString,
                time: timeString
            };

            const response = await fetch(AI_RESPONSE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: props.user.email,
                    chats: [...chats, chatMessage]
                })
            });

            const data = await response.json();
            console.log(data)
            if (data.status === 'ok') {
                console.log("User Chats Updated");
                await saveAIMessage(data.ai_response, [...chats, chatMessage])
            } else {
                console.error("Failed to update user chats");
            }
        } catch (error) {
            console.error("Error updating user chats:", error);
        }

    }

    const handleSendMessage = async () => {
        if (newMessage !== "") {
            try {

                const currentDate = new Date();
                const dateString = currentDate.toISOString().slice(0, 10);
                const timeString = currentDate.toLocaleTimeString();
    
                const chatMessage = {
                    content: `${props.user.name}: ${newMessage}`,
                    date: dateString,
                    time: timeString
                };
    
                const response = await fetch(UPDATE_CHATS, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: props.user.email,
                        newChats: [...chats, chatMessage]
                    })
                });

                const data = await response.json();

                if (data.status === 'ok') {
                    console.log("User Chats Updated FIRST");
                    let a = newMessage
                    setNewMessage('');
                    if (selectedRespondent === "AI") {
                        await getAIResponse(a)
                    }
                } else {
                    console.error("Failed to update user chats");
                }
            } catch (error) {
                console.error("Error updating user chats:", error);
            }
        }
    };

    const avatarRef = useRef(null);

    useEffect(() => {
        if(chats.toString() !== user.chats.toString()) {
            if(user.chats[user.chats.length-1].content.startsWith("AI")) {
                console.log(user.chats[user.chats.length-1].content.split(":")[1].trim())
                console.log("av")
                console.log(avatarRef)
                if (avatarRef.current) {
                    avatarRef.current.speakSelectedText(user.chats[user.chats.length-1].content.split(":")[1].trim());
                }
            }
        }
        setChats(user.chats);
    }, [user]);

    
    const chatContainerRef = useRef(null);


    useEffect(() => {
        setNewMessage(transcript)
    }, [transcript])

    if (!browserSupportsSpeechRecognition) {
        alert("no voice recog allowed")
    }



    return (
        <div className="page1 patChat">
            <Header setSignedIn={props.setSignedIn} signedIn={props.signedIn} openLogIn={props.openLogIn} closeLogIn={props.closeLogIn} openSignUp={props.openSignUp} closeSignUp={props.closeSignUp} />
            <div className='patient_chats_analysis'>
            <Avatar ref={avatarRef} />

                <div className="patient_chats_component">
                    <div className='select_tabs'>
                        <div onClick={toggleRespondent} className={selectedRespondent !== "AI" ? `select_tabs_ai` : `select_tabs_ai selected_Respondent`}>
                            AI
                        </div>
                        <div onClick={toggleRespondent} className={selectedRespondent !== "Doc" ? `select_tabs_doc` : `select_tabs_doc selected_Respondent`}>
                            Doctor
                        </div>
                    </div>
                    <div className='patient_chats_chats' ref={chatContainerRef}>

                        {chats.map((message, index) => {
                            const isDocMessage = message.content ? message.content.startsWith(`${user.name}`) : false;
                            const messageClass = isDocMessage ? 'patient_outgoing_message' : 'patient_incoming_message';

                            return (
                                <div className='full_msg_with_date'>
                                    <div key={index} className={`message ${messageClass}`}>
                                        {message.content}
                                    </div>
                                    <div className='date_time_msg'>{message.date} {message.time}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className='patient_send_message1'>
                        <textarea
                            className='patient_add_text_btn1'
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <div className='msg_btns1'>
                            <div className='patient_send_msg_btn_right1'>
                                <button className={listening ? 'patient_send_msg_btn_right2 extra' : 'patient_send_msg_btn_right2'} onClick={toggleSpeech}>
                                    <FaMicrophone />
                                </button>
                                <button className='patient_send_msg_btn_right2' onClick={handleSendMessage}>
                                    <FaCamera />
                                </button>
                            </div>
                            <button className='patient_send_msg_btn1' onClick={handleSendMessage}>
                                <IoSend />
                            </button>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default PatientChat;
