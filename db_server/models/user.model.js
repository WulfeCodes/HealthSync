const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    content: { type: String, required: true },
    date: { type: String },
    time: { type: String },
});

const userSchema = new mongoose.Schema({
    type: { type: String },
    doctorEmail: { type: String },
    name: { type: String, required: true },
    age: { type: Number },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    pass: {type: String},
    chats: { type: [chatSchema] },
    activeTracking: { type: String },
    trackingData: {
        type: {
            smoking: { type: Number },
            weight: { type: Number },
            alcohol: { type: Number }
        }
    },
    aiGeneratedInfo: {
        type: {
            sleep_efficiency: { type: [Number] },
            smoking: { type: [String] },
            exercise: { type: [Number] },
            alcohol: { type: [Number] },
            age: { type: [Number] },
            doctorSummary: { type: [String]},
            mentalHealthScore: {type: [Number]}
        }
    },
    notes: { type: [String] },
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;