import React from 'react'
import bookImage from "../images/bookImage.png";
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate=useNavigate();
  return (
    <div className='home-page'>
      <h1>Welcome Bookish Beauties!</h1>
      <div className='quote'>
      <img src={bookImage} alt="book-image" />
      <h1>"Join a community where trust is the binding cover of every book"</h1>
      </div>
      <button onClick={()=>{navigate("/preferences")}}>START READING!!</button>
    </div>
  )
}

export default Home
