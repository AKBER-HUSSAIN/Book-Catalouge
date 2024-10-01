import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://127.0.0.1:8000";

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/register' : '/login';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { username, password });
      
      if (isRegistering) {
        if (response.status === 200) {
          setSuccessMessage('Registration successful! Please login.');
          setUsername('');
          setPassword('');
          setError('');
          return; // Prevent further code execution on successful registration
        } else if (response.data.message === 'User already registered') {
          setError('Already registered, Please login!');
        } else {
          setError('Registration failed');
        }
      } else {
        if (response.data.token) {
          sessionStorage.setItem('UserLoggedIn', 'true');
          sessionStorage.setItem('UserName', response.data.user.username);
          sessionStorage.setItem('UserId', response.data.user.id);
          navigate('/preferences');
        } else {
          setError('Invalid credentials');
        }
      }
    } catch (error) {
      setError('Error logging in or registering');
    }
  };

  return (
    <div className='login-page main'>
      <h1>{isRegistering ? 'REGISTER' : 'LOGIN'}</h1>
      <form onSubmit={handleSubmit}>
{/*         <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /> */}
        <input autoComplete="off" type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required />
            <input type="password" placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required/>
        <button className="mainLogin" type="submit">{isRegistering ? 'Register' : 'Login'}</button> <br />
        <button className="mainLogin sec" onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Go to Login' : 'Go to Register'}
      </button>
        {error && <p className='error'>{error}</p>}
        {successMessage && <p className='success'>{successMessage}</p>} {/* Display success message */}
      
      </form>
    </div>
  );
};

export default UserLogin;
