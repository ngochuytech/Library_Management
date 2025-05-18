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
  Tabs,
  Tab,
  ListGroup,
  Form,
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../api';
import "../styles/BookDetail.css";

const DetailBook = ({ book: initialBook, onSearchByAuthor }) => {
  const [book, setBook] = useState(initialBook);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowDays, setBorrowDays] = useState(7); // Mặc định 7 ngày
  const [author, setAuthor] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [errorAuthor, setErrorAuthor] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAuthor();
    fetchSimilarBook();
  }, []);

  const fetchAuthor = async () => {
    setAuthor(null);
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
  };

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
  };

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/books/api/${book.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error("Không thể tải thông tin sách:", error);
    }
  };

  const handleBorrowBook = async () => {
    try {
      const currentUserId = sessionStorage.getItem("idUser"); // Đổi tên biến để rõ ràng hơn
      if (!currentUserId) {
        toast.error("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      if (!book || !book.id) {
        toast.error("Không tìm thấy thông tin sách để mượn.");
        return; 
      }
      const currentBookId = book.id;

      // Tạo payload với tên trường khớp với lỗi từ backend
      const payload = {
        user_id: parseInt(currentUserId, 10), // Đảm bảo user_id là số nếu serializer yêu cầu
        book_id: currentBookId,              // book.id đã là số
        borrow_days: borrowDays,
        // status: 'Pending' // Backend đã có default='PENDING' cho status, không cần gửi
      };

      console.log("Sending borrow request with payload:", payload); // Để debug

      // Sử dụng instance `api` đã cấu hình (có thể đã có token)
      const response = await api.post(`/borrows/api/create`, payload);

      // Kiểm tra status thành công (201 Created)
      if (response.status === 201 && response.data) { // Kiểm tra cả response.data
        toast.success("Mượn sách thành công, chúng tôi sẽ liên hệ bạn!", {
            position: "top-right", autoClose: 3000, hideProgressBar: false,
            closeOnClick: true, pauseOnHover: true, draggable: true,
        });

        await fetchBookDetails(); // Cập nhật lại thông tin sách (ví dụ: số lượng còn lại)
        
        // Gửi thông báo (notification)
        try {
            await api.post('/notifications/api/create', {
                user_id: parseInt(currentUserId, 10),
                message: `Bạn đã yêu cầu mượn sách "${book.title}". Chúng tôi sẽ sớm liên hệ với bạn.`
            });
        } catch (notificationError) {
            console.error("Error sending notification:", notificationError.response?.data || notificationError.message);
            // Không cần làm người dùng lo lắng nếu chỉ thông báo lỗi
        }
        
      } else {
        // Xử lý các trường hợp status khác 201 nhưng không phải lỗi (ít gặp với POST create)
        console.warn("Unexpected response status:", response.status, "Data:", response.data);
        toast.error(response.data?.message || `Yêu cầu không thành công (mã lỗi: ${response.status}).`);
      }

    } catch (error) {
      console.error("Borrow error object:", error); // Log toàn bộ object lỗi
      if (error.response) {
        console.error("Borrow error response data:", error.response.data);
        // error.response.data chính là {user_id: Array(1), book_id: Array(1)}
        let errorMessages = "Lỗi khi gửi yêu cầu mượn sách:\n";
        const responseData = error.response.data;
        if (typeof responseData === 'object' && responseData !== null) {
          // Nếu backend trả về lỗi theo format { field: ["message1", "message2"], ...}
          for (const key in responseData) {
            if (Array.isArray(responseData[key])) {
              errorMessages += `Trường ${key}: ${responseData[key].join('; ')}\n`;
            } else if (typeof responseData[key] === 'string') { // Trường hợp message chung như { "detail": "Not found."}
              errorMessages += `${responseData[key]}\n`;
            }
          }
           // Nếu có message chung ở ngoài cùng
           if (responseData.message && typeof responseData.message === 'string') {
            errorMessages = responseData.message + "\n" + errorMessages;
          } else if (responseData.detail && typeof responseData.detail === 'string') { // DRF hay dùng detail
            errorMessages = responseData.detail + "\n" + errorMessages;
          }
        } else if (typeof responseData === 'string') {
          errorMessages += responseData;
        } else {
          errorMessages += error.message || "Lỗi không xác định từ server.";
        }
        toast.error(errorMessages.trim(), { autoClose: 5000 });
      } else if (error.request) {
        console.error("Borrow error request:", error.request);
        toast.error("Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.");
      } else {
        console.error('Borrow setup error message:', error.message);
        toast.error(`Lỗi thiết lập yêu cầu: ${error.message}`);
      }
    } finally {
      setShowBorrowModal(false);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon key="half" icon={faStarRegular} className="text-warning" />
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
      <ToastContainer />
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
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
      <Modal show={showBorrowModal} onHide={() => setShowBorrowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận mượn sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có muốn mượn sách <strong>{book.title}</strong> không?</p>
          <Form.Group className="mb-3">
            <Form.Label>Chọn số ngày mượn</Form.Label>
            <Form.Select
              value={borrowDays}
              onChange={(e) => setBorrowDays(Number(e.target.value))}
            >
              <option value={7}>7 ngày</option>
              <option value={14}>14 ngày</option>
              <option value={30}>30 ngày</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBorrowModal(false)}>
            Không
          </Button>
          <Button variant="primary" onClick={handleBorrowBook}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4} className="mb-4 mb-md-0">
                  <Image
                    src={`image/${book.image}`}
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
                        className={isFavorite ? "text-danger" : "text-secondary"}
                        style={{ fontSize: "1.2rem" }}
                      />
                    </Button>
                  </div>
                  <div className="mb-3">
                    <span className="me-2">{renderRatingStars(book.rating)}</span>
                    <span className="text-muted">{book.rating}</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {book.category.map((obj, index) => (
                      <Badge key={index} bg="light" text="dark" className="fw-normal">
                        {obj.name}
                      </Badge>
                    ))}
                  </div>
                  <Alert
                    variant={book.avaliable > 0 ? "success" : "danger"}
                    className="d-flex align-items-center"
                  >
                    <div className="me-3">
                      <Badge
                        bg={book.avaliable > 0 ? "success" : "danger"}
                        className="me-2"
                      >
                        {book.avaliable > 0 ? "Còn sách" : "Hết sách"}
                      </Badge>
                      <span className="text-muted small">
                        ({book.avaliable} trong kho)
                      </span>
                    </div>
                    <ProgressBar
                      now={(book.avaliable / book.quantity) * 100}
                      variant={book.avaliable > 0 ? "success" : "danger"}
                      className="flex-grow-1"
                      style={{ height: "8px" }}
                    />
                  </Alert>
                  <div className="d-flex gap-3 mb-4">
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-grow-1"
                      onClick={() => setShowBorrowModal(true)}
                      disabled={book.avaliable <= 0}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Mượn ngay
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
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
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Về tác giả</Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <Image
                  src={author?.avatar ? `image/${author.avatar}` : "icon.png"}
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
                )}
              </div>
              <p>{author?.biography ? author.biography : ""}</p>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onSearchByAuthor(book.author.id, book.author.name)}
              >
                Xem tất cả sách của tác giả này
              </Button>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header as="h5">Bạn cũng có thể thích</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {similarBooks.map((obj, index) => (
                  <ListGroup.Item key={index} className="border-0">
                    <div className="d-flex">
                      <Image src={`image/${obj.image}`} width={60} className="me-3 shadow-sm" />
                      <div>
                        <h6 className="mb-1">{obj.title}</h6>
                        <p className="small text-muted mb-0">by {obj.author.name}</p>
                        <div className="small text-warning">{renderRatingStars(4.5)}</div>
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