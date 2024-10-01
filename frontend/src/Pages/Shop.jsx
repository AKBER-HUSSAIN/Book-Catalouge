import React, { useState, useEffect } from "react";
import axios from "axios";
import BookDetailsModal from "./BookDetailsModal";

const API_BASE_URL = "http://127.0.0.1:8000";

const Shop = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/books/`);
                setBooks(response.data);
                setFilteredBooks(response.data); // Initialize filteredBooks with all books
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        const results = books.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBooks(results);
    }, [searchQuery, books]);

    const handleBuy = async (bookId) => {
        try {
            const id = sessionStorage.getItem('UserId');
            const response = await axios.post(`${API_BASE_URL}/purchase`, {
                id,
                bookId,
            });
            if (response.status === 200) {
                alert("Successfully Bought! Happy reading...");
            }
        } catch (error) {
            console.error("Error purchasing book:", error);
            alert("You must login or register first.");
        }
    };

    const handleCardClick = (book) => {
        setSelectedBook(book);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="shop page-bg">
            <h1>Welcome {sessionStorage.getItem('UserName')}!</h1>
            <h4>Explore Our Book Collection</h4>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for books..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>
            <div className="cards">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <div key={book.id} className="card" onClick={() => handleCardClick(book)}>
                            <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="card-image"
                            />
                            <h5 className="card-title">{book.title}</h5>
                            {/* <p className="card-description">
                                {book.description}
                            </p> */}
                            <p className="card-price">Rs. {book.price}</p>
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleBuy(book.id);
                                }}
                            >
                                Buy
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No matching books found.</p>
                )}
            </div>

            <BookDetailsModal
                show={showModal}
                onHide={handleCloseModal}
                book={selectedBook}
            />
        </div>
    );
};

export default Shop;
