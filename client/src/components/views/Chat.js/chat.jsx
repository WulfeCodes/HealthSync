import React from 'react';
import './index.css';
import { useState, useEffect, useRef } from 'react';
import { UPDATE_CHATS } from '../../../apiConfig';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaCamera  } from "react-icons/fa";
import { IoSend } from "react-icons/io5";


function Chat(props) {
    const { patient } = props.props;
    console.log(props)
    const [newMessage, setNewMessage] = useState('');
    const [chats, setChats] = useState(patient.chats);

    const handleSendMessage = async () => {
        if (newMessage !== "") {
            try {
                const currentDate = new Date();
                const dateString = currentDate.toISOString().slice(0, 10);
                const timeString = currentDate.toLocaleTimeString();
    
                const chatMessage = {
                    content: `${props.props.user.name}: ${newMessage}`,
                    date: dateString,
                    time: timeString
                };
    
    
                const response = await fetch(UPDATE_CHATS, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: patient.email,
                        newChats: [...chats, chatMessage]
                    })
                });

                const data = await response.json();

                if (data.status === 'ok') {
                    console.log("User Chats Updated");
                    setChats([...chats, chatMessage]);
                    setNewMessage('');
                } else {
                    console.error("Failed to update user chats");
                }
            } catch (error) {
                console.error("Error updating user chats:", error);
            }
        }
    };

    useEffect(() => {
        setChats(patient.chats);
    }, [patient]);

    function toggleSpeech() {
        if (listening) {
            SpeechRecognition.stopListening()
        }
        else {
            SpeechRecognition.startListening()
        }
    }

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();


    useEffect(() => {
        setNewMessage(transcript)
    }, [transcript])

    if (!browserSupportsSpeechRecognition) {
        alert("no voice recog allowed")
    }

    const chatContainerRef = useRef(null);


    return (
        <div className="chats_component">
            <div className='chats_chats' ref={chatContainerRef}>

                {chats.map((message, index) => {
                    const isDocMessage = message.content.startsWith(props.props.user.name);
                    const messageClass = isDocMessage ? 'outgoing_message' : 'incoming_message';

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
            <div className='send_message'>
                <textarea
                    className='add_text_btn'
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <div className='msg_btns1'>
                <div className='patient_send_msg_btn_right1'>
                    <button className={listening ? 'patient_send_msg_btn_right2 extra': 'patient_send_msg_btn_right2'} onClick={toggleSpeech}>
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
            <div>
            </div>
        </div>
    );
}

export default Chat;