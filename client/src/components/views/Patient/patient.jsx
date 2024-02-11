import React, { useState, useEffect } from "react";
import "./index.css";
import Header from "../../shared/Header/header";
import 'react-circular-progressbar/dist/styles.css';
import Chat from "../Chat.js/chat";
import { UPDATE_NOTES_API } from "../../../apiConfig"
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'


function Patient(props) {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    )

    let n = props.patient.aiGeneratedInfo.sleep_efficiency ? props.patient.aiGeneratedInfo.sleep_efficiency.length : 0
    const [chartData, setChartData] = useState([
        {
            label: "Sleep Efficiency",
            data: props.patient.aiGeneratedInfo.sleep_efficiency,
            labels: generateLastNDays(n), // Default labels
        },
        {
            label: "Alcohol Consumption",
            data: props.patient.aiGeneratedInfo.alcohol,
            labels: generateLastNDays(n), // Default labels
        },
        {
            label: "Exercise",
            data: props.patient.aiGeneratedInfo.exercise,
            labels: generateLastNDays(n), // Default labels
        },
        {
            label: "Mental Health",
            data: props.patient.aiGeneratedInfo.mentalHealthScore,
            labels: generateLastNDays(n), // Default labels
        },
    ]);

    function generateLastNDays(n) {
        const labels = [];
        for (let i = n - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const formattedDate = formatDate(date);
            labels.push(formattedDate);
        }
        return labels;
    }

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().substring(2); // Get last two digits of the year
        return `${day}/${month}/${year}`;
    }

    console.log(props)
    const [notesArea, setNotesArea] = useState("")

    useEffect(() => {
        if (props.patient.notes) {
            setNotesArea(props.patient.notes);
        }
    }, []);

    const handleNotesChange = (e) => {
        setNotesArea(e.target.value);
    };

    const handleNotesSubmit = () => {
        // Make API call to update notes
        fetch(UPDATE_NOTES_API, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: props.patient.email,
                newNotes: notesArea,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    window.location.reload()
                    console.log('User notes updated successfully');
                } else {
                    alert("Error!")
                    console.error('Failed to update user notes');
                    window.location.reload()
                }
            })
            .catch(error => {
                alert("Error!")
                console.error('Error updating user notes:', error);
                window.location.reload()
            });
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
                    <a href="/dashboard">Dashboard →  </a>
                    Patient Overview
                </div>
                <div className="patient_info">

                    <div className="patient_info_notes">
                        <div className="first_2">
                            <div className="patient_dash">
                                <div className="patient_dash_left">
                                    <div className="patient_dash_title">Name </div>
                                    <div className="patient_dash_value">{props.patient.name}</div>
                                    <div className="patient_dash_title">Age </div>
                                    <div className="patient_dash_value">{props.patient.age}</div>
                                    <div className="patient_dash_title">Phone </div>
                                    <div className="patient_dash_value">{props.patient.phone}</div>
                                    <div className="patient_dash_title">Email </div>
                                    <div className="patient_dash_value">{props.patient.email}</div>
                                </div>
                                <div className="patient_dash_right">
                                    <div className="patient_dash_active_amt">
                                        <div className="dash_amt">
                                            {props.patient.aiGeneratedInfo.mentalHealthScore ? props.patient.aiGeneratedInfo.mentalHealthScore[props.patient.aiGeneratedInfo.mentalHealthScore.length - 1] : "NA"}
                                            <div style={{ marginTop: '20px', marginLeft: "5px", fontSize: '18px' }}>
                                                %
                                            </div>
                                        </div>
                                        Latest Mental Health Score
                                    </div>

                                </div>
                            </div>
                            <div className="patient_notes">
                                <div className="patient_notes_title">
                                    Patient Notes
                                </div>
                                <textarea className="patient_notes_textarea" placeholder="Add patient notes here..." onChange={handleNotesChange} value={notesArea} />
                                <button onClick={handleNotesSubmit} className="patient_notes_save">
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className="second_2">
                            <div className="patient_vitals">
                                <div className="patient_vitals_title">
                                    Data Analysis
                                </div>
                                <div className="patient_vitals_doctor_summary">

                                    {chartData.map((data, index) => (
                                            <div className="line-chart-container">
                                                <Line
                                                    className="line_chart"
                                                    data={{
                                                        datasets: [{
                                                            data: data.data,
                                                            label: data.label,
                                                            backgroundColor: 'white', // Background color
                                                            borderColor: '#0bb8e4', // Border color
                                                            borderWidth: 3, // Border width (optional)
                                                        }],
                                                        labels: data.labels
                                                    }}
                                                    options={{
                                                        plugins: {}
                                                    }}
                                                />
                                                <div className="abc">
                                                <div className="diff_patient_dash_active_amt">
                                                <div className="dash_amt">
                                                {+(data.data.reduce((acc, val) => acc + val, 0) / data.data.length).toFixed(1)}
                                                </div>
                                                Average {data.label}
                                            </div>
                                                        </div>
                                            </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard_chats">
                        <div className="dashboard_appointments_title">
                            Chat History
                        </div>
                        <Chat props={props} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Patient;
