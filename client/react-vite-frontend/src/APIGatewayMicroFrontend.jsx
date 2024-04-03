// APIGatewayMicroFrontend.js
import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { getToken, setToken, removeToken } from './TokenHelper';

function APIGatewayMicroFrontend() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isnurse, setIsNurse] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Checks to see if the user logged in is a nurse
  const [loginNurse, setLoginNurse] = useState(false);

  const [registrationStatus, setRegistrationStatus] = useState('');

  const [vitals, setVitals] = useState('');
  const [heartrate, setHeartRate] = useState('');
  const [coretemp, setCoreTemp] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');

  const [editVitalId, setEditVitalId] = useState('');
  const [editHeartrate, setEditHeartrate] = useState('');
  const [editCoretemp, setEditCoretemp] = useState('');
  const [editBloodPressure, setEditBloodPressure] = useState('');
  const [editRespiratoryRate, setEditRespiratoryRate] = useState('');

  const [motivationalTip, setMotivationalTip] = useState('');

  // Used to manipulate the loginstatus (Display login or others)
  const [loginStatus, setLoginStatus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchVitals() {
      try {
        const response = await fetch('http://localhost:3002/vitals');
        console.log('response', response);
        const data = await response.json();
        setVitals(data);
      } catch (error) {
        console.error('Error fetching vitals:', error);
      }
    }

    fetchVitals();
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      const timeUntilExpiry = decodedToken.exp - currentTime;
      console.log('token will expiry in: ', timeUntilExpiry / 60, " minutes");

      if(decodedToken.exp > currentTime){
        setIsLoggedIn(true);
      } else {
        removeToken();
      }
      setLoginEmail(localStorage.getItem('email'));
    }
  }, []);

  async function handleLogout() {
    try{
      setLoginNurse(false);
      const response = await fetch('http://localhost:3003/auth/logoff', {
        method: 'POST',
      });
      //localStorage.removeItem('authToken');
      removeToken();
      const data = await response.text();
      setLoginStatus('Logged Off Successfully');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  }

  async function handleRegistration() {
    try{
      const response = await fetch('http://localhost:3003/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, isnurse }),
      });
      //console.log(response);
      const data = await response.json();
      //console.log("Checking error");
      setRegistrationStatus(data.message);
    } catch (error) {
      console.error('Error Registering user: ', error);
      setRegistrationStatus('Error Registering user. Please Try again');
    }
  }

  // login test:
  // Username: test
  // email: test@test.ca
  // password: 12345
  async function handleLogin(e) {
    e.preventDefault();
    //console.log("checking response");
    try {
      //console.log("checking response");
      const response = await fetch('http://localhost:3003/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if(response.ok){

        const {token, user} = await response.json();
        setToken(token);

        // Set the email locally to be displayed on vitals page.
        localStorage.setItem('email', loginEmail);
        //console.log('This is passed login user:', user);
        setLoginNurse(user.isnurse);

        setLoginStatus('Login successful');
        setIsLoggedIn(true);
      } else {
        setLoginStatus('Invalid Credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  async function handleCreateVitals() {
    try{
      //console.log("Creating vitals:", heartrate, coretemp, bloodPressure);
      const response = await fetch('http://localhost:3002/vitals/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ heartrate, coretemp, bloodPressure, respiratoryRate}),
      });
      console.log("after fetch",response);
      const data = await response.json();
    } catch (error) {
      console.error('Error adding vitals: ', error);
    }
  }

  async function handleSaveVital(id) {
    try {
      const response = await fetch(`http://localhost:3002/vitals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heartrate: editHeartrate,
          coretemp: editCoretemp,
          bloodPressure: editBloodPressure,
          respiratoryRate : editRespiratoryRate
        }),
      });

      if(response.ok){
        const updatedVitals = vitals.map(vital => {
          if(vital._id === id) {
            return {
              ...vital,
              heartrate: editHeartrate,
              coretemp: editCoretemp,
              bloodPressure: editBloodPressure,
              respiratoryRate: editRespiratoryRate
            };
          }
          return vital;
        });
        console.log("This is new edit: ",updatedVitals)
        setVitals(updatedVitals);
        handleCancelEdit();

      } else {
        throw new Error('Failed to update vital');
      }
    } catch (error) {
      console.error('Error saving vital:', error);
    }
  }

  async function handleEditVitals(id) {
    setEditVitalId(id);
    const vitalToEdit = vitals.find(vital => vital._id === id);
    console.log(vitalToEdit);
    if(vitalToEdit){
      setEditHeartrate(vitalToEdit.heartrate);
      setEditCoretemp(vitalToEdit.coretemp);
      setEditBloodPressure(vitalToEdit.bloodpressure);
      setEditRespiratoryRate(vitalToEdit.respiratoryrate);
    }
  }

  async function handleAddMotivationalTips() {
    
    try{
      console.log(motivationalTip);
      const response = await fetch('http://localhost:3004/tips/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motivationalTip }),
      });

      //console.log('Tips: ', response);
      const data = await response.json();

      console.log('Tips data: ', data);
    } catch (error) {
      console.error('Error adding tips: ', error);
    }
  }

  function handleCancelEdit() {
    setEditVitalId(null);
    setEditHeartrate('');
    setEditCoretemp('');
    setEditBloodPressure('');
    setEditRespiratoryRate('');
  }

  if(!isLoggedIn){
    return (
      <div>
        <h1>User Authentication Microservice</h1>
        <h3>Please Login Below:</h3>
        <form onSubmit={handleLogin}>
          <label>
            Email:
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </label>
          <button type="submit">Login</button>
        </form>
        {loginStatus && <p>{loginStatus}</p>}
        <h2>User Registration</h2>
        <div>
          <form onSubmit={handleRegistration}>
            <table>
              <tbody>
                <tr>
                  <td><label>Username:</label></td>
                  <td>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>Email:</label></td>
                  <td>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>Password:</label></td>
                  <td>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td><label>Are You a Nurse?:&nbsp;&nbsp;</label></td>
                  <td>
                    <input
                      type="checkbox"
                      value={isnurse}
                      onChange={(e) => setIsNurse(e.target.checked)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <button type="submit">Register</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
          {registrationStatus && <p>{registrationStatus}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      {loginNurse ? (
        <>
          <h1>Nurse - Viewing Patient Vital Signs</h1>
          <div>
          <p>Welcome, {loginEmail}!</p>
          <button onClick={handleLogout}>Logout</button>
          </div>
          <h2>Create Patient Vitals Information</h2>
          <form onSubmit={handleCreateVitals}>
            <table>
              <tbody>
                <tr>
                  <td><label>Heart Rate:</label></td>
                  <td><input
                        type="number"
                        value={heartrate}
                        onChange={(e) => setHeartRate(e.target.value)}
                      />
                  </td>
                </tr>
                <tr>
                  <td><label>Core Temperature:</label></td>
                  <td><input
                        type="text"
                        value={coretemp}
                        onChange={(e) => setCoreTemp(e.target.value)}
                      />
                  </td>
                </tr>
                <tr>
                  <td><label>Blood Pressure:</label></td>
                  <td><input
                        type="text"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                      />
                  </td>
                </tr>
                <tr>
                  <td><label>Respiratory Rate:</label></td>
                  <td><input
                        type="text"
                        value={respiratoryRate}
                        onChange={(e) => setRespiratoryRate(e.target.value)}
                      />
                  </td>
                </tr>
                <tr>
                  <td><button type="submit">Submit</button></td>
                </tr>
              </tbody>
            </table>
          </form>
          <h2>List of Previous Documented Vital Signs</h2>
          {vitals ? (
            <ul>
              {vitals.map((vital) => (
                <li key={vital._id}>
                  {editVitalId  === vital._id ? (
                    <>
                      <input
                        type="number"
                        value={editHeartrate}
                        onChange={e => setEditHeartrate(e.target.value)}
                      />
                      <input
                        type="text"
                        value={editCoretemp}
                        onChange={e => setEditCoretemp(e.target.value)}
                      />
                      <input
                        type="text"
                        value={editBloodPressure}
                        onChange={e => setEditBloodPressure(e.target.value)}
                      />
                      <input
                        type="text"
                        value={editRespiratoryRate}
                        onChange={e => setEditRespiratoryRate(e.target.value)}
                      />
                      <button onClick={() => handleSaveVital(vital._id)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                    Heart Rate: {vital.heartrate}, &nbsp;
                    Core Temperature: {vital.coretemp},&nbsp;
                    Blood Pressure: {vital.bloodpressure},&nbsp;
                    Respiratory Rate: {vital.respiratoryrate}&nbsp;&nbsp;&nbsp;
                    <button onClick={() => handleEditVitals(vital._id)}>Edit</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading vitals...</p>
          )}
          <div>
            <h2>Create Daily Motivational Tip</h2>
            <form id="tipform" onSubmit={handleAddMotivationalTips}>
              <table>
                <tr>
                  <td>Enter motivational tip: </td>
                  <td>
                    <textarea
                      form="tipform"
                      cols="30"
                      wrap="soft"
                      value={motivationalTip}
                      onChange={e => setMotivationalTip(e.target.value)}
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <td>
                    <button type="submit">Submit</button>
                  </td>
                </tr>
              </table>
            </form>
          </div>
        </>
      ) : (
        <>
          <h1>Patient - Viewing Patient Vital Signs</h1>
          <div>
          <p>Welcome, {loginEmail}!</p>
          <button onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default APIGatewayMicroFrontend;
