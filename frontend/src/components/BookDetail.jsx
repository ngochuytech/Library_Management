import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Badge,
  Dropdown,
  Card,
  ListGroup,
  Tab,
  Tabs,
  Accordion,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import {
  faBell,
  faStar,
  faBookmark,
  faHeart,
  faBookOpen,
  faShoppingCart,
  faShareAlt,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import "../styles/BookDetail.css";

const DetailBook = () => {
  const book = {
    title: "Don't Make Me Think",
    author: "Steve Krug",
    edition: "Second Edition",
    year: 2000,
    rating: 5.0,
    reviews: 25,
    readers: 119,
    status: "Available",
    stock: 5,
    pages: 216,
    language: "English",
    isbn: "978-0321344755",
    genres: ["Design", "UX", "Web Development"],
    coverImage: "book.jpg",
    description:
      "Steve Krug is a usability consultant with over 30 years of experience working with companies like Apple, Netscape, AOL, Lexus, and others. He is the author of the famous book 'Don't Make Me Think', which is considered a classic in the field of user experience design. This book helps you understand how users really use websites and applications, while providing simple but effective design principles.",
    authorBio:
      "Steve Krug (born 1950) is a user experience professional who has worked as a usability consultant for various companies such as Apple, Bloomberg.com, Lexus.com, NPR, the International Monetary Fund, and many others. He is best known for his book 'Don't Make Me Think', which is now in its third edition.",
    similarBooks: [
      {
        title: "The Design of Everyday Things",
        author: "Don Norman",
        cover: "book.jpg",
      },
      {
        title: "Don't Make Me Think Revisited",
        author: "Steve Krug",
        cover: "book.jpg",
      },
      {
        title: "Lean UX",
        author: "Jeff Gothelf",
        cover: "book.jpg",
      },
    ],
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarRegular}
          className="text-warning"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={faStarRegular}
          className="text-secondary"
        />
      );
    }

    return stars;
  };

  return (
    <Container className="mt-3 mb-5 book-detail-container">
      <Row>
        {/* Main Book Info */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                {/* Book Cover */}
                <Col md={4} className="mb-4 mb-md-0">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fluid
                    className="shadow-sm rounded"
                  />
                  <div className="d-flex justify-content-between mt-3">
                    <Button variant="outline-primary" size="sm">
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      Preview
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <FontAwesomeIcon icon={faShareAlt} />
                    </Button>
                  </div>
                </Col>

                {/* Book Details */}
                <Col md={8}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h1 className="h3 mb-2">{book.title}</h1>
                      <h2 className="h5 text-muted mb-3">
                        by {book.author} • {book.edition} ({book.year})
                      </h2>
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle variant="link" id="dropdown-more">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <FontAwesomeIcon icon={faBookmark} className="me-2" />
                          Save for later
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <FontAwesomeIcon icon={faHeart} className="me-2" />
                          Add to favorites
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>Report</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <div className="mb-3">
                    <span className="me-2">
                      {renderRatingStars(book.rating)}
                    </span>
                    <span className="text-muted">
                      {book.rating} ({book.reviews} reviews)
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {book.genres.map((genre, index) => (
                      <Badge
                        key={index}
                        bg="light"
                        text="dark"
                        className="fw-normal"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  <Alert
                    variant="success"
                    className="d-flex align-items-center"
                  >
                    <div className="me-3">
                      <Badge bg="success" className="me-2">
                        {book.status}
                      </Badge>
                      <span className="text-muted small">
                        ({book.stock} in stock)
                      </span>
                    </div>
                    <ProgressBar
                      now={(book.stock / 10) * 100}
                      variant="success"
                      className="flex-grow-1"
                      style={{ height: "8px" }}
                    />
                  </Alert>

                  <div className="d-flex gap-3 mb-4">
                    <Button variant="primary" size="lg" className="flex-grow-1">
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Borrow Now
                    </Button>
                    <Button variant="outline-secondary" size="lg">
                      Reserve
                    </Button>
                  </div>

                  <ListGroup horizontal className="mb-3 text-center">
                    <ListGroup.Item className="flex-fill border-0">
                      <div className="h5 mb-0">{book.readers}</div>
                      <div className="small text-muted">Readers</div>
                    </ListGroup.Item>
                    <ListGroup.Item className="flex-fill border-0">
                      <div className="h5 mb-0">{book.pages}</div>
                      <div className="small text-muted">Pages</div>
                    </ListGroup.Item>
                    <ListGroup.Item className="flex-fill border-0">
                      <div className="h5 mb-0">{book.language}</div>
                      <div className="small text-muted">Language</div>
                    </ListGroup.Item>
                    <ListGroup.Item className="flex-fill border-0">
                      <div className="h5 mb-0">{book.isbn}</div>
                      <div className="small text-muted">ISBN</div>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Book Description Tabs */}
          <Tabs defaultActiveKey="description" id="book-tabs" className="mb-4">
            <Tab eventKey="description" title="Description">
              <Card>
                <Card.Body>
                  <p className="lead">{book.description}</p>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="details" title="Details">
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Publisher:</strong> New Riders Press
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Publication Date:</strong> January 1, 2000
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Dimensions:</strong> 7 x 0.5 x 9.25 inches
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Weight:</strong> 12.8 ounces
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="reviews" title={`Reviews (${book.reviews})`}>
              <Card>
                <Card.Body>
                  <p>Reviews will be displayed here.</p>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Author Info */}
          <Card className="mb-4">
            <Card.Header as="h5">About the Author</Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <Image
                  src="https://via.placeholder.com/80"
                  roundedCircle
                  width={80}
                  height={80}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1">{book.author}</h5>
                  <p className="text-muted small">UX Designer & Consultant</p>
                </div>
              </div>
              <p>{book.authorBio}</p>
              <Button variant="outline-primary" size="sm">
                View all books by this author
              </Button>
            </Card.Body>
          </Card>

          {/* Similar Books */}
          <Card>
            <Card.Header as="h5">You May Also Like</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {book.similarBooks.map((similarBook, index) => (
                  <ListGroup.Item key={index} className="border-0">
                    <div className="d-flex">
                      <Image
                        src={similarBook.cover}
                        width={60}
                        className="me-3 shadow-sm"
                      />
                      <div>
                        <h6 className="mb-1">{similarBook.title}</h6>
                        <p className="small text-muted mb-0">
                          by {similarBook.author}
                        </p>
                        <div className="small text-warning">
                          {renderRatingStars(4.5)}
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailBook;
