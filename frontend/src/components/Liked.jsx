import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Image,
  ListGroup,
  Pagination,
} from "react-bootstrap";
import {
  faHeart,
  faBookOpen,
  faShoppingCart,
  faTrash,
  faStar,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Liked = () => {
  // Danh sách sách đã like (dữ liệu mẫu)
  const likedBooks = [
    {
      id: 1,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      coverImage: "/book.jpg",
      rating: 4.5,
      reviews: 128,
      category: "Công nghệ thông tin",
      status: "Available",
    },
    {
      id: 2,
      title: "The Design of Everyday Things",
      author: "Don Norman",
      coverImage: "/book.jpg",
      rating: 4.7,
      reviews: 256,
      category: "Thiết kế",
      status: "Out of stock",
    },
    {
      id: 3,
      title: "Rich Dad Poor Dad",
      author: "Robert T. Kiyosaki",
      coverImage: "/book.jpg",
      rating: 4.3,
      reviews: 342,
      category: "Kinh tế",
      status: "Available",
    },
    {
      id: 4,
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: "/book.jpg",
      rating: 4.8,
      reviews: 512,
      category: "Phát triển bản thân",
      status: "Available",
    },
  ];

  // Hàm xử lý xóa sách khỏi danh sách yêu thích
  const handleRemove = (bookId) => {
    console.log(`Remove book with id: ${bookId}`);
    // Thực hiện call API hoặc cập nhật state ở đây
  };

  // Hàm xử lý mượn sách
  const handleBorrow = (bookId) => {
    console.log(`Borrow book with id: ${bookId}`);
    // Thực hiện call API hoặc chuyển hướng ở đây
  };

  // Hàm render rating sao
  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        style={{
          color: i < Math.floor(rating) ? "#FFD700" : "#E0E0E0",
          marginRight: "2px",
          fontSize: "0.9rem",
        }}
      />
    ));
  };

  // Màu sắc cho từng thể loại
  const getCategoryColor = (category) => {
    const colors = {
      "Công nghệ thông tin": "primary",
      "Thiết kế": "success",
      "Kinh tế": "warning",
      "Phát triển bản thân": "info",
      // Thêm các thể loại khác nếu cần
    };
    return colors[category] || "secondary";
  };

  return (
    <Container className="mt-3 mb-5">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faHeart} className="text-danger me-2" />
                Danh sách yêu thích
              </h4>
            </Card.Header>
            <Card.Body>
              {likedBooks.length === 0 ? (
                <div className="text-center py-5">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-muted mb-3"
                    style={{ fontSize: "3rem" }}
                  />
                  <h5>Danh sách yêu thích trống</h5>
                  <p className="text-muted">
                    Bạn chưa thêm sách nào vào danh sách yêu thích
                  </p>
                  <Button variant="primary" className="mt-3">
                    Khám phá sách ngay
                  </Button>
                </div>
              ) : (
                <>
                  <ListGroup variant="flush">
                    {likedBooks.map((book) => (
                      <ListGroup.Item key={book.id} className="py-3">
                        <Row className="align-items-center">
                          <Col md={2} className="mb-3 mb-md-0">
                            <Image
                              src={book.coverImage}
                              alt={book.title}
                              fluid
                              className="rounded shadow-sm"
                              style={{ maxHeight: "120px" }}
                            />
                          </Col>
                          <Col md={5}>
                            <h5>{book.title}</h5>
                            <p className="text-muted mb-2">{book.author}</p>
                            {/* <div className="d-flex align-items-center mb-2">
                              {renderRatingStars(book.rating)}
                              <span className="ms-2 small text-muted">
                                {book.rating} ({book.reviews} đánh giá)
                              </span>
                            </div> */}
                            <Badge
                              bg={
                                book.status === "Available"
                                  ? "success"
                                  : "danger"
                              }
                              pill
                            >
                              {book.status}
                            </Badge>
                          </Col>
                          <Col md={3} className="text-md-center">
                            <Badge
                              pill
                              bg={getCategoryColor(book.category)}
                              className="py-2 px-3"
                            >
                              <FontAwesomeIcon icon={faBook} className="me-2" />
                              {book.category}
                            </Badge>
                          </Col>
                          <Col md={2} className="text-md-end">
                            <div className="d-flex flex-column flex-md-row gap-2 justify-content-end">
                              <Button
                                variant={
                                  book.status === "Available"
                                    ? "primary"
                                    : "secondary"
                                }
                                size="sm"
                                disabled={book.status !== "Available"}
                                onClick={() => handleBorrow(book.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  className="me-1"
                                />
                                {book.status === "Available" ? "Mượn" : "Hết"}
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemove(book.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  {/* Phân trang */}
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First />
                      <Pagination.Prev />
                      <Pagination.Item active>{1}</Pagination.Item>
                      <Pagination.Item>{2}</Pagination.Item>
                      <Pagination.Item>{3}</Pagination.Item>
                      <Pagination.Next />
                      <Pagination.Last />
                    </Pagination>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Liked;
