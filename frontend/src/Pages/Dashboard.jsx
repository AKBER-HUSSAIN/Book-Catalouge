import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Correctly import useNavigate

const API_BASE_URL = "http://127.0.0.1:8000";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [formBook, setFormBook] = useState({
    id: null,
    title: "",
    description: "",
    imageUrl: "",
    price: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if(sessionStorage.getItem('AdminLoggedIn')!='true') {
      navigate('/login');
    }
    fetchBooks();
  }, [sessionStorage.getItem('AdminLoggedIn')]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/books/`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleChange = (e) => {
    setFormBook({
      ...formBook,
      [e.target.name]: e.target.value,
    });
  };

  const createOrUpdateBook = async () => {
    try {
      if (formBook.id) {
        await axios.put(`${API_BASE_URL}/books/${formBook.id}`, formBook);
      } else {
        await axios.post(`${API_BASE_URL}/books/`, formBook);
      }
      fetchBooks();
      setFormBook({
        id: null,
        title: "",
        description: "",
        imageUrl: "",
        price: "",
      });
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const startUpdate = (book) => {
    setFormBook(book);
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.setItem('AdminLoggedIn','false');
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="dashboard page-bg">
      <h1>Book Dashboard</h1>
      <h4>Manage Your Book Collection</h4>
      <div className="new-book-form island">
        <h5>{formBook.id ? "Update Book" : "Create New Book"}</h5>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formBook.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formBook.description}
          onChange={handleChange}
        />
        <input
          className="book-image"
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formBook.imageUrl}
          onChange={handleChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={formBook.price}
          onChange={handleChange}
        />
        <button onClick={createOrUpdateBook}>
          {formBook.id ? "Update Book" : "Add Book"}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="cards">
        {books.map((book) => (
          <div key={book.id} className="card">
            <img src={book.imageUrl} alt={book.title} className="card-image" />
            <h5 className="card-title">{book.title}</h5>
            {/* <p className="card-description">{book.description}</p> */}
            <p className="card-price">Rs. {book.price}</p>
            <div className="buttons-container">
              <button onClick={() => startUpdate(book)}>Update</button>
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
