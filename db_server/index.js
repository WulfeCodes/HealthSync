const express = require('express')
const app = express()
const cors = require('cors')
const User = require('./models/user.model')
const mongoose = require('mongoose')
const corsOptions ={
    origin: "*",
    preflightContinue: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionSuccessStatus:204,
 }
 app.use(cors(corsOptions)) // Use this after the variable declaration

 app.use(express.json())

mongoose.connect("mongodb+srv://pramitbhatia25:GA45FDj59FEuqBht@cluster0.gqh1qhi.mongodb.net/?retryWrites=true&w=majority")

app.post('/api/createUser', async (req, res) => {
	try {
		await User.create({
            type: req.body.type,
            doctorEmail: req.body.doctorEmail,
			name: req.body.name,
			email: req.body.email,
			pass: req.body.pass,
            age: req.body.age,
            phone: req.body.phone,
            chats: req.body.chats,
            activeTracking: req.body.activeTracking, // New field for active tracking system
            trackingData: req.body.trackingData, // New field for tracking data
            aiGeneratedInfo: req.body.aiGeneratedInfo, // New field for AI-generated information
            notes: req.body.notes,
            patients: req.body.patients,
		})
		console.log("User Created")
		res.json({ status: 'ok' })
	} catch (err) {
        console.log(err);
		res.json({ status: 'error', error: "User Creation Error" })
	}
})

app.post('/api/findUser', async (req, res) => {
    let email = req.body.email;
    try {
        const userLogin = await User.findOne({ email: email });
        res.json({ status: "ok", user: userLogin });
    } catch (err) {
        res.json({ status: "error", error: err })
    }
})

app.post('/api/findUserById', async (req, res) => {
    let userId = req.body.userId;

    try {
        const user = await User.findById(userId);
        
        if (user) {
            res.json({ status: "ok", user: user });
        } else {
            res.status(404).json({ status: "error", message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ status: "error", error: err });
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { email, pass } = req.body;

        if (!email || !pass) {
            return res.status(400).json({ error: "Incomplete fields" });
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = pass === userLogin.pass;

            if (!isMatch) {
                return res.status(400).json({ error: "Incorrect password" });
            } else {
                const userData = {
                    type: userLogin.type,
                    doctorEmail: userLogin.doctorEmail,
                    name: userLogin.name,
                    age: userLogin.age,
                    phone: userLogin.phone,
                    email: userLogin.email,
                    pass: userLogin.pass,
                    chats: userLogin.chats,
                    activeTracking: userLogin.activeTracking,
                    trackingData: userLogin.trackingData,
                    aiGeneratedInfo: userLogin.aiGeneratedInfo,
                    notes: userLogin.notes,
                    patients: userLogin.patients
                };

                return res.json({
                    message: "User login successful",
                    userData: userData,
                });
            }
        } else {
            return res.status(400).json({ error: "User not found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// Update user patients by adding a new patient to the doctor's patients array
app.post('/api/updatePatients', async (req, res) => {
    const doctorEmail = req.body.docEmail;
    const patientData = req.body.newPatient;

    try {
        console.log("REQ REC")
        // Find the doctor by their email
        const doctor = await User.findOne({ email: doctorEmail });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Create the patient in the database
        const patient = new User(patientData);

        // Save the patient to the database
        await patient.save();

        // Append the patient's ObjectId to the doctor's patients array
        doctor.patients.push(patient._id);

        // Save the updated doctor document
        await doctor.save();

        console.log("Patient Added to Doctor's Patients");
        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err });
    }
});


// Update user notes
app.put('/api/updateNotes', async (req, res) => {
    const email = req.body.email;
    const newNotes = req.body.newNotes;

    try {
        await User.updateOne(
            { email: email },
            { $set: { notes: newNotes } }
        );
        console.log("User Notes Updated");
        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: err });
    }
});

// Update user age
app.put('/api/updateAge', async (req, res) => {
    const email = req.body.email;
    const newAge = req.body.newAge;

    try {
        await User.updateOne(
            { email: email },
            { $set: { age: newAge } }
        );
        console.log("User Age Updated");
        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: err });
    }
});


// Update user phone number
app.put('/api/updateUserPhone', async (req, res) => {
    const email = req.body.email;
    const newPhone = req.body.newPhone;

    try {
        await User.updateOne(
            { email: email },
            { $set: { phone: newPhone } }
        );
        console.log("User Phone Number Updated");
        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: err });
    }
});

// Update user chats
app.put('/api/updateUserChats', async (req, res) => {
    const email = req.body.email;
    const newChats = req.body.newChats;

    try {
        await User.updateOne(
            { email: email },
            { $set: { chats: newChats } }
        );
        console.log("User Chats Updated");
        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: err });
    }
});

app.listen(1337, () => {
	console.log('Server started on 1337')
})