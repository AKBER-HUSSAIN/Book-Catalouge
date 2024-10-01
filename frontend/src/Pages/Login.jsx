import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your API base URL

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/adminlogin`, { username, password });
      if (response.data.token) {
        sessionStorage.setItem('AdminLoggedIn','true');
        navigate("/dashboard")
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.log(error)
      setError('Error logging in');
    }
  };
  
  return (
    <div className='login-page main'>
      <h1>ADMIN LOGIN</h1>
      <form onSubmit={handleLogin}>
        {/* <input
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
        />
        <button type="submit">Login</button> */}
        <input autoComplete="off" type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required />
            <input type="password" placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required/>
            <button className="mainLogin" type='submit'>LOGIN</button>
        {error && <p className='error'>{error}</p>}
      </form>
    </div>
    
  );
};

export default Login;
