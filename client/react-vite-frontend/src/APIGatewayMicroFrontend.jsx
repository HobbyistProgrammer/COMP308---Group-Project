// APIGatewayMicroFrontend.js
import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { gql, useQuery } from '@apollo/client';
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

  const [selectedSymptoms, setSelectedSymptoms] = useState('');

  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescriptions] = useState('');

  const [patientHeartRate, setPatientHeartRate] = useState('');
  const [patientCoreTemp, setPatientCoreTemp] = useState('');
  const [patientBloodPressure, setPatientBloodPressure] = useState('');
  const [patientRespiratoryRate, setPatientRespiratoryRate] = useState('');
  // const [patientSymptoms, setPatientSymptoms] = useState([]);

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

  async function handleAddMotivationalTips(e) {
    e.preventDefault();
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
      const tempTextArea = Document.getElementById('motivationalarea');
      tempTextArea.value = '';
    } catch (error) {
      console.error('Error adding tips: ', error);
    }
  }
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if(checked){
      setSelectedSymptoms([...selectedSymptoms, value]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(item => item !== value));
    }
  }

  async function handleAlertSubmit(){
    try{
      const response = await fetch('http://localhost:3005/emergency/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emergencyType, location, description }),
      });

      //console.log('Tips: ', response);
      const data = await response.json();

      console.log('Emergency data: ', data);
    } catch (error) {
      console.error('Error adding Emergency: ', error);
    }
  }

  async function checkAlertMessages(e){
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3005/emergency');
      if (!response.ok) {
        throw new Error('Failed to fetch emergency data');
      }
      const data = await response.json();
      console.log('emergency data:', data);
    } catch (error) {
      console.error('Error fetching emergency:', error);
    }
  }

  // Server-side functionlity to delete motivational tips.
  async function handleRandomMotivational() {

    /* Code commented below is for removing tip by id */
    // const id = "660cc7afb3ce8ecc4b970df0";
    // try {
    //   const response = await fetch(`http://localhost:3004/tips/delete/${id}`, {
    //     method: 'DELETE',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       id: id,
    //     }),
    //   });
  
    //   if (!response.ok) {
    //     throw new Error('Failed to delete tip');
    //   }
  
    //   console.log('Tip deleted successfully');
    // } catch (error) {
    //   console.error('Error deleting tip:', error);
    // }
    try {
      const response = await fetch('http://localhost:3004/tips');
      if (!response.ok) {
        throw new Error('Failed to fetch emergency data');
      }
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.length);
      const h2Element = document.getElementById('randomQuote');

      //console.log(data);

      h2Element.textContent = '* ' + data[randomIndex].tips + ' *';
      console.log('tips data:', data); 
    } catch (error) {
      console.error('Error fetching emergency:', error);
    }
  }

  async function handlePatientVitals() {
    try{
      //console.log("Creating vitals:", heartrate, coretemp, bloodPressure);
      const response = await fetch('http://localhost:3005/patient/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientHeartRate, patientCoreTemp, patientBloodPressure, patientRespiratoryRate, selectedSymptoms}),
      });
      console.log("after fetch",response);
      const data = await response.json();
    } catch (error) {
      console.error('Error adding patient: ', error);
    }
  }

  async function displayPatients() {
    try {
      const response = await fetch('http://localhost:3005/patient');
      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }
      const data = await response.json();

      console.log('patient data list:', data); 
    } catch (error) {
      console.error('Error fetching emergency:', error);
    }
  }

  function handleFitnessGame() {
    window.location.href = 'http://localhost:3000'
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
                      id="motivationalarea"
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
          <h2>Click to play a fitness game</h2>
          <button onClick={handleFitnessGame}>Play Game</button>
          <h2>Generate Motivational Quote</h2>
          <table>
            <tr>
              <td><button onClick={handleRandomMotivational}>Display Motivational</button></td>
              <td><h3 id="randomQuote"></h3></td>
            </tr>
          </table>
         
          
          <h2>Send Emergency Alert to First Responders</h2>
          <div>
            <form onSubmit={handleAlertSubmit}>
              <table>
                <tr>
                  <th>Emergency Type: </th>
                  <td>
                    <select required value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)}>
                      <option value="">Select a option</option>
                      <option value="Fire">Fire</option>
                      <option value="Medical">Medical</option>
                      <option value="Severe Weather">Severe Weather</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Location: </th>
                  <td><input required type="text" value={location} onChange={(e) => setLocation(e.target.value)}/></td>
                </tr>
                <tr>
                  <th>Description: </th>
                  <td><textarea required value={description} onChange={(e) => setDescriptions(e.target.value)}></textarea></td>
                </tr>
                <tr>
                  <td><input type="submit" value="Send Alert" /></td>
                  <td><button onClick={checkAlertMessages}>Check Alerts(For Testing)</button></td>
                </tr>
              </table>
            </form>
          </div>
          <h2>Create Patient Vitals Information</h2>
          <form onSubmit={handlePatientVitals}>
            <table>
              <tbody>
                <tr>
                  <td><label>Heart Rate:</label></td>
                  <td><input
                        type="number"
                        required
                        value={patientHeartRate}
                        onChange={(e) => setPatientHeartRate(e.target.value)}
                      />
                  </td>
                </tr>
                <tr>
                  <td><label>Core Temperature:</label></td>
                  <td><input
                        type="text"
                        required
                        value={patientCoreTemp}
                        onChange={(e) => setPatientCoreTemp(e.target.value)}
                      />
                  </td>
                </tr>
                <tr>
                  <td><label>Blood Pressure:</label></td>
                  <td><input
                        type="text"
                        required
                        value={patientBloodPressure}
                        onChange={(e) => setPatientBloodPressure(e.target.value)}
                      />
                  </td>
                </tr>
                <tr>
                  <td><label>Respiratory Rate:</label></td>
                  <td><input
                        type="text"
                        required
                        value={patientRespiratoryRate}
                        onChange={(e) => setPatientRespiratoryRate(e.target.value)}
                      />
                  </td>
                </tr>
              </tbody>
            </table>
            <h3>Checklist of common signs and symptoms</h3>
            <h4>Please check any that apply:</h4>
            <table>
              <tr>
                <td>
                  <label>
                    <input type="checkbox" value="Fever" onChange={handleCheckboxChange} />
                    Fever
                  </label>
                </td>
                <td>
                  <label>
                    <input type="checkbox" value="Cough" onChange={handleCheckboxChange} />
                    Cough
                  </label>
                </td>
                <td>
                  <label>
                    <input type="checkbox" value="Sore Throat" onChange={handleCheckboxChange} />
                    Sore Throat
                  </label>
                </td>
              </tr>
              <tr>
                <td>
                  <label>
                    <input type="checkbox" value="Body Aches" onChange={handleCheckboxChange} />
                    Body Aches
                  </label>
                </td>
                <td>
                  <label>
                    <input type="checkbox" value="Irritable Bowels" onChange={handleCheckboxChange} />
                    Irritable Bowels
                  </label>
                </td>
                <td>
                  <label>
                    <input type="checkbox" value="Headache" onChange={handleCheckboxChange} />
                    Headache
                  </label>
                </td>
              </tr>
              <tr>
                <td><button type="submit">Submit</button></td>
                <td><button onClick={displayPatients}>Display Patients</button></td>
              </tr>
            </table>
          </form>
        </>
      )}
    </div>
  );
}
export default APIGatewayMicroFrontend;
