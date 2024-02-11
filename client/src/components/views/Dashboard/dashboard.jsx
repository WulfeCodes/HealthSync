import React, { useState } from "react";
import "./index.css";
import Header from "../../shared/Header/header";
import 'react-circular-progressbar/dist/styles.css';
import { UPDATE_CHATS, UPDATE_PATIENT } from '../../../apiConfig'; // Import the API URL
import 'react-circular-progressbar/dist/styles.css';

function Dashboard(props) {

    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState("")


    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function sendIntroEmail(name, email) {
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().slice(0, 10);
            const timeString = currentDate.toLocaleTimeString();

            let newMessage = `Welcome, ${name}! I'm AI-DOC, and I will be assisting your Dcotor with collecting data and managing your diagnosis. I can answer any common questions you have, as well as provide guidance and assist you at any time required. I will be asking you questions throughout the day to get a sense of the issues you are facing, and that data will be used by the Doctor to aid you in your treatment. I look forward to asking you questions and I hope that you will communicate and share your journey with me! The Doctor can view our chats, but if you'd like to talk to the Doctor directly, please select the Doctor tab above. Thanks!`

            const chatMessage = {
                content: `AI: ${newMessage}`,
                date: dateString,
                time: timeString
            };

            console.log([chatMessage])
            const response = await fetch(UPDATE_CHATS, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    newChats: [chatMessage]
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

    }

    async function addPatientToDocAccount(
        type,
        docEmail,
        name,
        email,
        pass,
        age,
        phone,
        chats,
        activeTracking,
        trackingData,
        aiGeneratedInfo,
        notes,
        patients
    ) {
        const newnewpatients = {
            type: type,
            doctorEmail: docEmail,
            name: name,
            email: email,
            pass: pass,
            age: age,
            phone: phone,
            chats: chats,
            activeTracking: activeTracking,
            trackingData: trackingData,
            aiGeneratedInfo: aiGeneratedInfo,
            notes: notes,
            patients: patients // Assuming this is for future use to keep track of patients under this doctor
        };


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ docEmail: docEmail, newPatient: newnewpatients })
        };

        try {
            const response = await fetch(UPDATE_PATIENT, requestOptions);
            const data = await response.json();
            if (data.hasOwnProperty('error')) {
                return "Error"
            }
            return "Done"
            // Handle response here
        } catch (error) {
            console.error('Error:', error);
            return "Error"
            // Handle error here
        }
    }

    async function handlePatientCreate(event, props) {
        event.preventDefault();
        if (formData.name === "" || formData.email === "" || formData.phone === "" || formData.age === "") {
            alert("Enter all details.");
        } else {
            setLoading("Creating Account...")
            let r = addPatientToDocAccount(
                "Patient", // Type
                props.user.email, // Doctor's email
                formData.name, // Patient's name
                formData.email, // Patient's email
                "abc", // Password (you may need to adjust this)
                parseInt(formData.age), // Parse age to integer
                formData.phone, // Patient's phone
                [], // chats
                "smoking", // Active tracking system
                { smoking: 0, weight: 0, alcohol: 0 }, // Tracking data (assuming it's initialized with default values)
                { sleep_efficiency: [], smoking: [], exercise: [], age: [], mentalHealthScore: [], alcohol: [], doctorSummary: [] }, // AI-generated info (assuming it's initialized with default values)
                formData.initialNotes, // Notes (assuming it's not provided)
                [] // Patients (assuming it's not provided)
            );

            if (await r === "Error") {
                setLoading("Error occurred!")
            }
            else {
                setLoading("Created! Account credentials have been emailed to the patient.")
                sendIntroEmail(formData.name, formData.email)
            }

            setFormData({ email: "", name: "", age: "", phone: "", initialNotes: "" })
        }
    }

    const DataTable = ({ headers, data }) => {
        return (
            <table className="patient_table">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="tablerow">

                            {row.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {/* Check if the column is an object */}
                                    {typeof column === 'object' ? (
                                        // If it's an object, assume it's a button and render it
                                        <button className="openPatient" onClick={column.onClick}>{column.label}</button>
                                    ) : (
                                        // If not, render the regular data
                                        column
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // Example usage
    const TableExample = () => {
        const tableHeaders = ['Name', 'Actions'];
        const tab = [];
        if (Array.isArray(props.user.customP) && props.user.customP.length > 0) {
            props.user.customP.forEach((patient) => {
                if (typeof patient === 'object' && 'name' in patient) {
                    let da = [];
                    for (const key in patient) {
                        if (key === 'name') {
                            da.push(patient[key]);
                        }
                        // if (key === 'age') {
                        //     da.push(patient[key]);
                        // }
                        // if (key === 'phone') {
                        //     da.push(patient[key]);
                        // }
                        // if (key === 'dailycheckin') {
                        //     da.push(patient[key]);
                        // }
                    }
                    da.push({ label: 'View Details', onClick: () => window.location = "/patient/" + da[0] })
                    tab.push(da);
                }
            });
        }
        return <DataTable headers={tableHeaders} data={tab} />;
    };

    return (
        <div className="page1 dashb">
            <Header
                setSignedIn={props.setSignedIn}
                signedIn={props.signedIn}
                openLogIn={props.openLogIn}
                closeLogIn={props.closeLogIn}
                openSignUp={props.openSignUp}
                closeSignUp={props.closeSignUp}
            />
            <div className="dashboard_content">
                <div className="dashboard_title">
                    Dashboard Overview
                </div>
                <div className="dasboard_patients_appointments">
                    <div className="dashboard_patients">
                        <div className="dashboard_patients_title">
                            Patients
                        </div>
                        <TableExample />
                    </div>
                    <div className="col_chat_score">
                        <div className="dashboard_appointments">
                            <div className="dashboard_appointments_title">
                                Add Patient
                            </div>
                            <form className="chat_form" onSubmit={(event) => handlePatientCreate(event, props)}>
                                <label htmlFor="name">Name:</label>
                                <input
                                    className="patient_create"
                                    type="text"
                                    id="name"
                                    name="name"
                                    onChange={handleInputChange}
                                    value={formData.name}
                                    required
                                    placeholder="Enter patient name..."
                                />

                                <label htmlFor="email">Email:</label>
                                <input
                                    className="patient_create"
                                    type="email"
                                    id="email"
                                    name="email"
                                    onChange={handleInputChange}
                                    value={formData.email}
                                    required
                                    placeholder="Enter patient email..."
                                />

                                <label htmlFor="age">Age:</label>
                                <input
                                    className="patient_create"
                                    type="number"
                                    id="age"
                                    name="age"
                                    onChange={handleInputChange}
                                    value={formData.age}
                                    required
                                    placeholder="Enter patient age..."
                                />
                                <label htmlFor="Initial Diagnosis">Initial Diagnosis:</label>
                                <input
                                    className="patient_create"
                                    type="text"
                                    name="initialNotes"
                                    onChange={handleInputChange}
                                    value={formData.initialNotes}
                                    required
                                    placeholder="Enter patient's initial diagnosis"
                                />
                                <label htmlFor="phone">Phone:</label>
                                <input
                                    className="patient_create"
                                    type="number"
                                    id="phone"
                                    name="phone"
                                    onChange={handleInputChange}
                                    value={formData.phone}
                                    required
                                    placeholder="Enter patient phone..."
                                />

                                <button id="patient_create_submit"
                                    type="submit">Submit</button>
                                {loading === "" ? <></> : <>{loading}</>}
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
