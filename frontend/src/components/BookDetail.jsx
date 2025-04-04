import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Badge,
  Card,
  Modal,
  ProgressBar,
  Alert,
  Tabs, // Import Tabs
  Tab, // Import Tab
  ListGroup, // Import ListGroup
} from "react-bootstrap";
import {
  faStar,
  faHeart as fasHeart,
  faBookOpen,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faHeart as farHeart,
} from "@fortawesome/free-regular-svg-icons";
import "../styles/BookDetail.css";

const DetailBook = ({book}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [author, setAuthor] = useState(null)
  const [similarBooks, setSimilarBooks] = useState([])
  const [loadingAuthor, setLoadingAuthor] = useState(true); // State quản lý trạng thái loading
  const [errorAuthor, setErrorAuthor] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchAuthor = async () => {
        setAuthor();
        try {
          const response = await fetch(`${BASE_URL}/authors/api/${book.author.id}`); 
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();           
          setAuthor(data);
        } catch (error) {
          setErrorAuthor("Không thể tải tác giả. Vui lòng thử lại sau.");
        } finally {
          setLoadingAuthor(false); 
        }
    }

    const fetchSimilarBook = async () => {
      setSimilarBooks([]);
      try {
        const response = await fetch(`${BASE_URL}/books/api/random/${book.id}`); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); 
        
        setSimilarBooks(data);
      } catch (error) {
        console.log("Không thể tải sách tương tự");
        
      }
    }
    
    fetchAuthor();
    fetchSimilarBook();
  }, []);
//   const book = {
//     title: "Don't Make Me Think",
//     author: "Steve Krug",
//     edition: "Second Edition",
//     year: 2000,
//     rating: 5.0,
//     status: "Available",
//     stock: 5,
//     language: "English",
//     genres: ["Design", "UX", "Web Development"],
//     coverImage: "book.jpg",
//     description:
//       "Steve Krug is a usability consultant with over 30 years of experience working with companies like Apple, Netscape, AOL, Lexus, and others. He is the author of the famous book 'Don't Make Me Think', which is considered a classic in the field of user experience design. This book helps you understand how users really use websites and applications, while providing simple but effective design principles.",
//     previewContent: `Chapter 1: Don't Make Me Think

// A usability test is essentially a reality check. When you watch users try to use something you've designed (whether it's a website, a mobile app, or a toaster), you quickly realize that what you thought was perfectly clear often isn't clear at all.

// The first law of usability: Don't make me think!

// This means that as far as humanly possible, when I look at a web page it should be self-evident. Obvious. Self-explanatory. I should be able to "get it" - what it is and how to use it - without expending any effort thinking about it.

// Chapter 2: How We Really Use the Web

// Facts of life:
// 1. We don't read pages. We scan them.
// 2. We don't make optimal choices. We satisfice.
// 3. We don't figure out how things work. We muddle through.

// Understanding these facts will help you design better websites that match how people actually use the web.`,
//     similarBooks: [
//       {
//         title: "The Design of Everyday Things",
//         author: "Don Norman",
//         cover: "book.jpg",
//       },
//       {
//         title: "Don't Make Me Think Revisited",
//         author: "Steve Krug",
//         cover: "book.jpg",
//       },
//       {
//         title: "Lean UX",
//         author: "Jeff Gothelf",
//         cover: "book.jpg",
//       },
//     ],
//   };

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
      {/* Modal Preview */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Preview: {book.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ whiteSpace: "pre-line" }}>{book.preview}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        {/* Main Book Info */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                {/* Book Cover */}
                <Col md={4} className="mb-4 mb-md-0">
                  <Image
                    src={book.image.slice(16)}
                    alt={book.title}
                    fluid
                    className="shadow-sm rounded"
                  />
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowPreview(true)}
                    >
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      Preview
                    </Button>
                  </div>
                </Col>

                {/* Book Details */}
                <Col md={8}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h1 className="h3 mb-2">{book.title}</h1>
                      <h2 className="h5 text-muted mb-3">
                        by {book.author.name} ({book.publication_date})
                      </h2>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-0 text-decoration-none"
                    >
                      <FontAwesomeIcon
                        icon={isFavorite ? fasHeart : farHeart}
                        className={
                          isFavorite ? "text-danger" : "text-secondary"
                        }
                        style={{ fontSize: "1.2rem" }}
                      />
                    </Button>
                  </div>

                  <div className="mb-3">
                    <span className="me-2">
                      {renderRatingStars(book.rating)}
                    </span>
                    <span className="text-muted">{book.rating}</span>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {book.category.map((obj, index) => (
                      <Badge
                        key={index}
                        bg="light"
                        text="dark"
                        className="fw-normal"
                      >
                        {obj.name}
                      </Badge>
                    ))}
                  </div>

                  <Alert
                    variant="success"
                    className="d-flex align-items-center"
                  >
                    <div className="me-3">
                      <Badge bg="success" className="me-2">
                        {/* {book.status} */}
                        Còn sách
                      </Badge>
                      <span className="text-muted small">
                        ({book.avaliable} trong kho)
                      </span>
                    </div>
                    <ProgressBar
                      now={(book.avaliable / book.quantity) * 100}
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
                  </div>
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
          </Tabs>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Author Info */}
          <Card className="mb-4">
            <Card.Header as="h5">Về tác giả</Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <Image
                  src={author?.avatar ? author.avatar.slice(16) : "icon.png"}
                  roundedCircle
                  width={80}
                  height={80}
                  className="me-3"
                />
                {loadingAuthor ? (
                    <p>Đang tải...</p>
                  ) : errorAuthor ? (
                        <p>{errorAuthor}</p>
                      ) : (
                        <div>
                          <h5 className="mb-1">{author.name}</h5>
                          <p className="text-muted small">{author.jobs}</p>
                        </div>
                        
                      )
                }
              </div>
              <p>{author?.biography ? author.biography : ""}</p>
              <Button variant="outline-primary" size="sm">
                View all books by this author
              </Button>
            </Card.Body>
          </Card>

          {/* Similar Books */}
          <Card>
            <Card.Header as="h5">Bạn cũng có thể thích</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {similarBooks.map((obj, index) => (
                  <ListGroup.Item key={index} className="border-0">
                    <div className="d-flex">
                      <Image
                        src={obj.image.slice(16)}
                        width={60}
                        className="me-3 shadow-sm"
                      />
                      <div>
                        <h6 className="mb-1">{obj.title}</h6>
                        <p className="small text-muted mb-0">
                          by {obj.author.name}
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
