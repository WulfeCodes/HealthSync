import React, { useState } from 'react';
import './index.css';
import { LOGIN_API_URL } from '../../../apiConfig'; // Import the API URL
import ClockLoader from "react-spinners/ClockLoader";



function LogIn(props) {
  const [formData, setFormData] = useState({
    username: '',
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
      const res = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.username,
          pass: formData.password
        })
      });
      console.log(res)


      if (res.status === 400 || !res.ok) {
        throw new Error('Invalid Credentials');
      }

      document.cookie = `email=${formData.username}`;
      setError('Logged In.')
      props.setSignedIn(true)
      window.location = "/";
      props.closePopup()
    } catch (err) {
      setError(err.message); // Set error state
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className='logInStyles'>
        <div className="join">
      <div className="join-content">
        <h2>Welcome back!</h2>
        {loading ?           <ClockLoader
          color={"black"}
          size={'30px'}
        />: <></> }
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <button className="closepopup" onClick={props.closePopup}>X Close</button>
      </div>
    </div>
    </div>
  );
}

export default LogIn;
