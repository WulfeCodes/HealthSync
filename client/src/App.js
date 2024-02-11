import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from "./components/views/Home/home";
import Error404 from "./components/views/Error404/error404";
import { useState, useEffect } from 'react';
import LogIn from "../src/components/shared/LogIn/login"
import SignUp from "../src/components/shared/SignUp/signup"
import { FIND_API_URL, FIND_API_ID_URL } from './apiConfig';
import Dashboard from './components/views/Dashboard/dashboard';
import Patient from './components/views/Patient/patient';
import PatientChat from './components/views/PatientChat/patientChat';


function App() {
  let [signedIn, setSignedIn] = useState(false)
  let [user, setUser] = useState({ name: '', email: '' })

  useEffect(() => {

    async function getUserDetailsById(id) {
      let response = await fetch(FIND_API_ID_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          'userId': id,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.user) {
          const userDetails = {
            type: data.user.type,
            doctorEmail: data.user.doctorEmail,
            name: data.user.name,
            age: data.user.age,
            phone: data.user.phone,
            email: data.user.email,
            pass: data.user.pass,
            chats: data.user.chats,
            activeTracking: data.user.activeTracking,
            trackingData: data.user.trackingData,
            aiGeneratedInfo: user.aiGeneratedInfo ? user.aiGeneratedInfo : data.user.aiGeneratedInfo,
            notes: data.user.notes,
            patients: data.user.patients,
            // Assuming customP is a placeholder for future custom properties
            customP: []
          };
          return userDetails
        } else {
          console.error('Patients data is null');
          return "Error"
        }
      } else {
        console.error('Failed to fetch data');
        return "Error"
      }
    }

    async function getUserDetails(a) {
      let response = await fetch(FIND_API_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          'email': a,
        }),
      })
      if (response.ok) {
        const data = await response.json();
        const userDetails = {
          type: data.user.type,
          doctorEmail: data.user.doctorEmail,
          name: data.user.name,
          age: data.user.age,
          phone: data.user.phone,
          email: data.user.email,
          pass: data.user.pass,
          chats: data.user.chats,
          activeTracking: data.user.activeTracking,
          trackingData: data.user.trackingData,
          aiGeneratedInfo: user.aiGeneratedInfo ? user.aiGeneratedInfo : data.user.aiGeneratedInfo,
          notes: data.user.notes,
          patients: data.user.patients,
          customP: [] // Assuming this is a placeholder for future custom properties
        };
        if (await data.user.patients && await data.user.patients.length >= 0) {
          console.log("Calling get Details for patient")
          const patientDetailsPromises = await data.user.patients.map(async (patientId) => {
            const patientDetails = await getUserDetailsById(patientId);
            if (patientDetails !== "Error") {
              return patientDetails;
            }
          });
          const patientDetails = await Promise.all(patientDetailsPromises);
          userDetails.customP = patientDetails
          setUser(userDetails);
          return userDetails
        }
      } else {
        console.error('Failed to fetch data');
        alert("Don't mess with cookies!")

        document.cookie = 'email' + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location = "/"
        return "Error"
      }
    }

    const fetchData = async () => {
      const emailCookie = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('email='));

      if (emailCookie) {
        const emailValue = emailCookie.split('=')[1];
        // temp(emailValue)
        getUserDetails(emailValue);
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    };

    fetchData(); // Run once initially

    const intervalId = setInterval(fetchData, 2000); // Run every 30 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount


  }, [signedIn])



  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLogInOpen, setIsLogInOpen] = useState(false);

  const openSignUp = () => {
    if (isLogInOpen) {
      setIsLogInOpen(false);
    }
    setIsSignUpOpen(true);
  };

  const closeSignUp = () => {
    setIsSignUpOpen(false);
  };

  const openLogIn = () => {

    if (isSignUpOpen) {
      setIsSignUpOpen(false);
    }
    setIsLogInOpen(true);
  };

  const closeLogIn = () => {
    setIsLogInOpen(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home user={user} openSignUp={openSignUp} closeSignUp={closeSignUp} openLogIn={openLogIn} closeLogIn={closeLogIn} signedIn={signedIn} setSignedIn={setSignedIn} />} />
          {signedIn && user.type === "Doctor" ?
            <>
              <Route path="/dashboard" element={<Dashboard user={user} openSignUp={openSignUp} closeSignUp={closeSignUp} openLogIn={openLogIn} closeLogIn={closeLogIn} signedIn={signedIn} setSignedIn={setSignedIn} />} />
              {user && user.customP && user.customP.length > 0 ? (
                <>
                  {user.customP.map((patient, index) => {
                    return (
                      <Route key={index} path={`/patient/${patient.name}`} element={<Patient patient={patient} user={user} openSignUp={openSignUp} closeSignUp={closeSignUp} openLogIn={openLogIn} closeLogIn={closeLogIn} signedIn={signedIn} setSignedIn={setSignedIn} />} />
                    )
                  })}
                </>
              )
                :
                (
                  <></>
                )
              }
            </>
            :
            <>
            </>
          }
          {signedIn && user.type === "Patient" ?
            <>
              <Route path="/chat" element={<PatientChat user={user} openSignUp={openSignUp} closeSignUp={closeSignUp} openLogIn={openLogIn} closeLogIn={closeLogIn} signedIn={signedIn} setSignedIn={setSignedIn} />} />
            </>
            :
            <>
            </>
          }
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
      {isSignUpOpen && (
        <SignUp className="page1_create" signedIn={signedIn} setSignedIn={setSignedIn} closePopup={closeSignUp} />
      )}

      {isLogInOpen && (
        <LogIn className="page2_create" signedIn={signedIn} setSignedIn={setSignedIn} closePopup={closeLogIn} />
      )}

    </div>
  );
}

export default App;
