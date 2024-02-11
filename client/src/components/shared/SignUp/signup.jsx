import React, { useState } from 'react';
import './index.css';
import { SIGNUP_API_URL } from '../../../apiConfig'; // Import the API URL
import ClockLoader from "react-spinners/ClockLoader";

function SignUp(props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track error state

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state

    try {
      // Fetch data
      const res = await fetch(SIGNUP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Doctor",
          doctorEmail: "",
          name: formData.name,
          email: formData.email,
          pass: formData.password,
          age: 0,
          phone: "",
          chats: [],
          activeTracking: "none",
          trackingData: {}, 
          aiGeneratedInfo: {}, 
          notes: "", 
          patients: []
        })
      });

      if (!res.ok) {
        throw new Error('User Registration Failed');
      }

      const data = await res.json();

      if (data.status === 'ok') {
        console.log("User Created");
        setError("Account Created!");
        document.cookie = `email=${formData.email}`;
        props.setSignedIn(true);
        window.location = "/";
        props.closePopup();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message); // Set error state
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="join">
      <div className="join-content">
        <h2>Sign Up</h2>
        {loading ? <ClockLoader
          color={"black"}
          size={'30px'}
        /> : <></>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        <button className="closepopup" onClick={props.closePopup}>Close</button>
      </div>
    </div>
  );
}

export default SignUp;
