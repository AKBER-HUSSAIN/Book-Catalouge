import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://127.0.0.1:8000";

const Preferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('UserLoggedIn') !== 'true') {
      navigate('/userlogin');
    } else {
      fetchPreferences();
    }
  }, [sessionStorage.getItem('UserLoggedIn')]);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/preferences/?user_id=${sessionStorage.getItem('UserId')}`);
      setPreferences(response.data);
    } catch (error) {
      setError('Error fetching preferences');
    }
  };

  return (
    <div className='preferences-page'>
      <h1>Your Preferences</h1>
      {error && <p className='error'>{error}</p>}
      {console.log(preferences)}
      <div className="cards">
                {preferences.map((pref) => (
                    <div key={pref.book.id} className="card">
                        <img
                            src={pref.book.imageUrl}
                            alt={pref.book.title}
                            className="card-image"
                        />
                        <h5 className="card-title">{pref.book.title}</h5>
                        {/* <p className="card-description">
                            {pref.book.description}
                        </p> */}
                        <p className="card-price">Rs. {pref.book.price}</p>
                    </div>
                ))}
            </div>
    </div>
  );
};

export default Preferences;
