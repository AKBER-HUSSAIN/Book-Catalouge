import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const BookDetailsModal = ({ show, onHide, book }) => {
  const [data, setData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [userName, setUserName] = useState(sessionStorage.getItem('UserName'));  // Adjust to get actual user name
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0); 

  useEffect(() => {
    if (book?.id) {
      axios.get(`http://127.0.0.1:8000/books/${book.id}`)
        .then(response => {
          setData(response.data);
          // Fetch ratings for the book
          axios.get(`http://127.0.0.1:8000/ratings/${book.id}`)
            .then(response => {
              setRatings(response.data);
              calculateAverageRating(response.data);
            })
            .catch(error => console.error('Error fetching book ratings:', error));
        })
        .catch(error => console.error('Error fetching book details:', error));
    }
  }, [book?.id]);

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      setAverageRating(0);  // Set average rating to 0 if no ratings are present
      return;
    }
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    setAverageRating((total / ratings.length).toFixed(2));  // Calculate average and set state
  };

  const handleRatingSubmit = async () => {
    console.log("Submit rating function triggered"); // Debug line
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/ratings/', {
        book_id: book.id,
        user_id: sessionStorage.getItem('UserId'),
        rating: userRating,
        user_name: sessionStorage.getItem('UserName')
      });
      console.log("Hello fron vignesh")
      const updatedRatings = ratings.filter(r => r.user_id !== sessionStorage.getItem('UserId'));
      updatedRatings.push(response.data);
      setRatings(updatedRatings);
      calculateAverageRating(updatedRatings);
      setUserRating(0);  // Reset rating input
  
      alert("Rating submitted successfully!");
  
      await fetchBookDetails(book.id);
      window.location.reload();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('There was an error submitting your rating. Please Register or Login first!');
    }
  };  
  
  // Function to fetch updated book details
  const fetchBookDetails = async (bookId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/books/${bookId}`);
      // Update book details state with the new data
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  if (!data) return null;

  return (
    <Modal show={show} onHide={onHide} className='pop-up'>
      <Modal.Header closeButton >
        <Modal.Title className='pop-up-title'>{data.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='pop-up-body'>
        <img src={data.imageUrl} alt={data.title} className="img-fluid mb-3 modal-image" />
        <div className='pop-up-div'>
        <p ><strong>Description:</strong> {data.description}</p>
        <p><strong>Price:</strong> {data.price}</p>
        <p><strong>Sold Count:</strong> {data.sold_count}</p>
        
        <div className='ratings-div'>
          <strong>Ratings: {averageRating} / 5</strong>
          {ratings.map((rating) => (
            <div key={rating.id}>
              {rating.user_name}: {rating.rating} / 5
            </div>
          ))}
        </div>

        <Form>
          <Form.Group controlId="userName">
            <Form.Label><strong>Your Name</strong></Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter your name" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
            />
          </Form.Group>
          <Form.Group controlId="userRating">
            <Form.Label><strong>Your Rating</strong></Form.Label>
            <Form.Control 
              type="number" 
              min="1" 
              max="5" 
              placeholder="Rate out of 5" 
              value={userRating} 
              onChange={(e) => setUserRating(parseInt(e.target.value))} 
            />
          </Form.Group>
          <Button variant="primary" onClick={handleRatingSubmit} className='submit-rating'>
            Submit Rating
          </Button>
        </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookDetailsModal;
