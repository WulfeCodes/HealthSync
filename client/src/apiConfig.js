const API_BASE_URL = 'http://localhost:1337';
const ML_BASE_URL = 'http://localhost:5000';

export const LOGIN_API_URL = `${API_BASE_URL}/api/login`;

export const SIGNUP_API_URL = `${API_BASE_URL}/api/createUser`;
export const FIND_API_URL = `${API_BASE_URL}/api/findUser`;
export const UPDATE_POINTS_API_URL = `${API_BASE_URL}/api/updatePoints`;
export const ADD_IMAGE_URL = `${API_BASE_URL}/api/addImageToUser`;
export const UPDATE_PATIENT = `${API_BASE_URL}/api/updatePatients`;
export const FIND_API_ID_URL = `${API_BASE_URL}/api/findUserById`;
export const UPDATE_NOTES_API = `${API_BASE_URL}/api/updateNotes`;
export const UPDATE_CHATS = `${API_BASE_URL}/api/updateUserChats`;
export const AI_RESPONSE = `${ML_BASE_URL}/api/getAIResponse`;
