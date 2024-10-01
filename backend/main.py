from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.orm import relationship

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./book_bazaar.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI instance
app = FastAPI()

# CORS configuration (optional)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    imageUrl = Column(String)
    price = Column(String)

class Preference(Base):
    __tablename__ = "preferences"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    book_id = Column(Integer)

class Rating(Base):
    __tablename__ = "ratings"
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    book_id = Column(Integer, ForeignKey('books.id'), primary_key=True)
    rating = Column(Integer)
    user_name = Column(String)

    user = relationship("User")
    book = relationship("Book")

Base.metadata.create_all(bind=engine)

# Pydantic models
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class BookBase(BaseModel):
    title: str
    description: str
    imageUrl: str
    price: str

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    pass

class PreferenceCreate(BaseModel):
    user_id: int
    book_id: int

class PurchaseRequest(BaseModel):
    id: int  # User ID
    bookId: int  # Book ID

class RatingCreate(BaseModel):
    book_id: int
    user_id: int
    rating: int
    user_name: str

# Update or create a new rating
@app.post("/ratings/")
def create_or_update_rating(rating: RatingCreate):
    db = SessionLocal()  # Manually create the session
    try:
        existing_rating = db.query(Rating).filter(
            Rating.book_id == rating.book_id,
            Rating.user_id == rating.user_id
        ).first()

        if existing_rating:
            # Update existing rating
            existing_rating.rating = rating.rating
            existing_rating.user_name = rating.user_name
            db.commit()
            db.refresh(existing_rating)
            return existing_rating
        else:
            # Create new rating
            db_rating = Rating(**rating.dict())
            db.add(db_rating)
            db.commit()
            db.refresh(db_rating)
            return db_rating
        
    finally:
        db.close()  # Ensure the session is closed

# Fetch ratings for a book
@app.get("/ratings/{book_id}")
def get_ratings(book_id: int):
    db = SessionLocal()
    ratings = db.query(Rating).filter(Rating.book_id == book_id).all()
    db.close()
    return ratings

# Create User
@app.post("/register")
def register(user: UserCreate):
    db = SessionLocal()
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="User already exists")
    db_user = User(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    db.close()
    return {"message": "User registered"}

# Example hardcoded admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class LoginForm(BaseModel):
    username: str
    password: str

@app.post("/adminlogin")
def login(form: LoginForm):
    if form.username == ADMIN_USERNAME and form.password == ADMIN_PASSWORD:
        return {"token": form.password }
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Login User
@app.post("/login")
def login(user: UserLogin):
    db = SessionLocal()
    db_user = db.query(User).filter(User.username == user.username, User.password == user.password).first()
    if db_user:
        return {"token": "dummy_token","user":db_user}  # Replace with real token generation
    db.close()
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Purchase endpoint
@app.post("/purchase")
def purchase_book(purchase_request: PurchaseRequest):
    db = SessionLocal()
    # Check if the book exists
    book = db.query(Book).filter(Book.id == purchase_request.bookId).first()
    if not book:
        db.close()
        raise HTTPException(status_code=404, detail="Book not found")

    # Create a new preference (which indicates a purchase in this case)
    db_preference = Preference(user_id=purchase_request.id, book_id=purchase_request.bookId)
    db.add(db_preference)
    db.commit()
    db.refresh(db_preference)
    db.close()

    return {"message": "Book purchased successfully", "preference": db_preference}

@app.get("/preferences/")
def get_preferences(user_id: int):
    db = SessionLocal()
    preferences = db.query(Preference).filter(Preference.user_id == user_id).all()

    # Prepare a list to hold the response data
    response_data = []

    # Iterate through each preference and fetch the associated book details
    for pref in preferences:
        book = db.query(Book).filter(Book.id == pref.book_id).first()
        if book:
            response_data.append({
                "preference_id": pref.id,
                "user_id": pref.user_id,
                "book": {
                    "id": book.id,
                    "title": book.title,
                    "description": book.description,
                    "imageUrl": book.imageUrl,
                    "price": book.price
                }
            })

    db.close()
    return response_data

@app.post("/preferences/")
def create_preference(preference: PreferenceCreate):
    db = SessionLocal()
    db_preference = Preference(**preference.dict())
    db.add(db_preference)
    db.commit()
    db.refresh(db_preference)
    db.close()
    return db_preference

# Book endpoints
@app.post("/books/")
def create_book(book: BookCreate):
    db = SessionLocal()
    db_book = Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    db.close()
    return db_book

@app.get("/books/")
def read_books():
    db = SessionLocal()
    books = db.query(Book).all()
    db.close()
    return books

@app.get("/books/{book_id}")
def read_book(book_id: int):
    db = SessionLocal()
    book = db.query(Book).filter(Book.id == book_id).first()
    
    if book is None:
        db.close()
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Count how many times the book's ID appears in the preferences table
    sold_count = db.query(Preference).filter(Preference.book_id == book_id).count()
    
    db.close()

    return {
        "id": book.id,
        "title": book.title,
        "description": book.description,
        "imageUrl": book.imageUrl,
        "price": book.price,
        "sold_count": sold_count  # Include the count of books sold
    }


@app.put("/books/{book_id}")
def update_book(book_id: int, book: BookUpdate):
    db = SessionLocal()
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if db_book is None:
        db.close()
        raise HTTPException(status_code=404, detail="Book not found")
    for key, value in book.dict().items():
        setattr(db_book, key, value)
    db.commit()
    db.refresh(db_book)
    db.close()
    return db_book

@app.delete("/books/{book_id}")
def delete_book(book_id: int):
    db = SessionLocal()
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if db_book is None:
        db.close()
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(db_book)
    db.commit()
    db.close()
    return db_book

# Root endpoint for testing
@app.get("/")
def read_root():
    return {"message": "Welcome to the Book Bazaar API"}
