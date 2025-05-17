import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Nav,
  Badge,
  Button,
  ProgressBar,
  Stack,
  Alert,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faBookOpen,
  faExclamationTriangle,
  faBook,
  faClock,
  faEye,
  faUndo,
  faHandPointer,
  faSearch,
  faFilter,
  faCalendarAlt,
  faTags,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const PersonalLibrary = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDays, setFilterDays] = useState("all");

  useEffect(() => {
    // const fetchBookById = async (bookId) => {
    //   try {
    //     const BASE_URL = import.meta.env.VITE_API_URL;
    //     const response = await axios.get(`${BASE_URL}/books/api/${bookId}`);
    //     if (response.status === 200) {
    //       return response.data;
    //     } else {
    //       throw new Error("Không lấy được thông tin sách");
    //     }
    //   } catch (error) {
    //     console.error("Lỗi khi gọi API sách:", error.message);
    //     return null;
    //   }
    // };

    const fetchBorrows = async () => {
      try {
        setLoading(true);
        setError(null);

        const id = userId || sessionStorage.getItem("idUser");
        if (!id) {
          throw new Error("User ID not found");
        }

        const BASE_URL = import.meta.env.VITE_API_URL;
        const token = sessionStorage.getItem("access_token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await axios.get(`${BASE_URL}/borrows/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched borrows from database:", response.data); // Dòng 76 trong log của bạn

        const rawData = Array.isArray(response.data) ? response.data : [];

        // Loại bỏ khối code gọi fetchBookById và khai báo enrichedData
        // const enrichedData = await Promise.all(
        //   rawData.map(async (borrow) => {
        //     const book = await fetchBookById(borrow.book); // Không cần dòng này nữa
        //     return {
        //       ...borrow,
        //       book,
        //       remainingDays: calculateRemainingDays(borrow.exp_date),
        //       isOverdue: new Date(borrow.exp_date) < new Date(),
        //     };
        //   })
        // );

        // Sử dụng processedData thay thế
        const processedData = rawData.map((borrow) => {
          // borrow.book từ rawData đã là đối tượng sách chi tiết
          return {
            ...borrow,
            remainingDays: calculateRemainingDays(borrow.exp_date),
            isOverdue: borrow.exp_date ? new Date(borrow.exp_date) < new Date() : false,
          };
        });
        // Dòng 102 trong log của bạn:
        console.log("Processed borrows data (should have book details directly):", processedData);

        // Dòng 105 trong file của bạn có thể là dòng setBorrows dưới đây.
        // Đảm bảo bạn sử dụng processedData ở đây:
        setBorrows(processedData);

      } catch (error) { // Dòng 108 trong log của bạn là console.error này
        console.error("Error fetching borrows:", error); // Lỗi ReferenceError xảy ra TRƯỚC KHI tới catch này
                                                        // và `error` object lúc này chính là ReferenceError đó.
        setError(error.message || "Failed to load borrow records");
        setBorrows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [userId]);

  const calculateRemainingDays = (expDate) => {
    if (!expDate) return null;
    const diffTime = new Date(expDate) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleActionClick = (borrow, action) => {
    console.log(`Action "${action}" for borrow ID: ${borrow.id}`);
    // TODO: Implement API calls for return/renew/etc.
  };

  const filteredBorrows = borrows.filter((borrow) => {
    // Filter by tab
    if (activeTab === "current" && borrow.status !== "borrowed") return false;
    if (activeTab === "overdue" && !borrow.isOverdue) return false;
    if (activeTab === "history" && borrow.status !== "returned") return false;

    // Filter by search term
    if (
      searchTerm &&
      !`${borrow.book?.title || ""} ${borrow.book?.author.name || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by days remaining
    if (filterDays !== "all" && borrow.remainingDays !== null) {
      const days = parseInt(filterDays);
      if (days === 7 && borrow.remainingDays > 7) return false;
      if (days === 3 && (borrow.remainingDays > 3 || borrow.remainingDays <= 7))
        return false;
      if (days === 0 && !borrow.isOverdue) return false;
    }

    return true;
  });

  const getStatusBadge = (status, isOverdue) => {
    const variants = {
      borrowed: isOverdue ? "danger" : "primary",
      waiting: "warning",
      returned: "success",
      cancelled: "secondary",
    };

    const labels = {
      borrowed: isOverdue ? "Quá hạn" : "Đang mượn",
      waiting: "Chờ xử lý",
      returned: "Đã trả",
      cancelled: "Đã hủy",
    };

    return (
      <Badge pill bg={variants[status] || "secondary"} className="ms-2">
        {labels[status] || status}
      </Badge>
    );
  };

  const getActionButton = (borrow) => {
    const actions = {
      borrowed: {
        label: borrow.isOverdue ? "Gia hạn" : "Trả sách",
        variant: borrow.isOverdue ? "warning" : "primary",
        icon: borrow.isOverdue ? faHandPointer : faUndo,
      },
      waiting: {
        label: "Hủy yêu cầu",
        variant: "outline-danger",
        icon: faHandPointer,
      },
      returned: {
        label: "Chi tiết",
        variant: "outline-secondary",
        icon: faBook,
      },
    };

    const { label, variant, icon } = actions[borrow.status] || {
      label: "Chi tiết",
      variant: "secondary",
      icon: faBook,
    };

    return (
      <Button
        variant={variant}
        size="sm"
        className="w-100 mt-2"
        onClick={() => handleActionClick(borrow, label)}
      >
        <FontAwesomeIcon icon={icon} className="me-2" />
        {label}
      </Button>
    );
  };

  const calculateDueProgress = (expDate) => {
    if (!expDate) return 0;

    const now = new Date();
    const due = new Date(expDate);
    const total = due - now;

    if (total <= 0) return 100; // Overdue

    const daysLeft = Math.ceil(total / (1000 * 60 * 60 * 24));
    const progress = Math.max(0, Math.min(100, 100 - daysLeft * 10));

    return progress;
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <ProgressBar animated now={100} className="mb-3" />
        <p>Đang tải thông tin mượn sách...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Lỗi khi tải dữ liệu</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FontAwesomeIcon icon={faBookOpen} className="me-2 text-primary" />
          Quản lý mượn sách
        </h2>

        <div className="d-flex">
          <div className="input-group" style={{ width: "250px" }}>
            <span className="input-group-text">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <Form.Control
              type="text"
              placeholder="Tìm sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Nav variant="tabs" className="flex-grow-1">
            <Nav.Item>
              <Nav.Link eventKey="all">
                <FontAwesomeIcon icon={faBook} className="me-1" />
                Tất cả ({borrows.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="current">
                <FontAwesomeIcon icon={faClock} className="me-1" />
                Đang mượn (
                {borrows.filter((b) => b.status === "borrowed").length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="overdue">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="me-1"
                />
                Quá hạn ({borrows.filter((b) => b.isOverdue).length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="history">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                Lịch sử ({borrows.filter((b) => b.status === "returned").length}
                )
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Form.Select
            size="sm"
            style={{ width: "150px" }}
            className="ms-3"
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
          >
            <option value="all">Tất cả thời hạn</option>
            <option value="7">Còn hơn 7 ngày</option>
            <option value="3">Còn 3-7 ngày</option>
            <option value="0">Đã quá hạn</option>
          </Form.Select>
        </div>
      </Tab.Container>

      {filteredBorrows.length === 0 ? (
        <Alert variant="info" className="text-center">
          <FontAwesomeIcon icon={faBook} size="2x" className="mb-3" />
          <h4>Không tìm thấy bản ghi mượn sách phù hợp</h4>
          <p>Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredBorrows.map((borrow) => {
            const dueProgress = calculateDueProgress(borrow.exp_date);
            const isOverdue = borrow.isOverdue;

            return (
              <Col key={borrow.id}>
                <Card className="h-100 shadow-sm border-0 overflow-hidden">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={
                        "image/" + borrow.book?.image ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={borrow.book?.title || "Không có tiêu đề"}
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        filter: isOverdue ? "grayscale(30%)" : "none",
                      }}
                    />

                    {isOverdue && (
                      <div className="position-absolute top-0 start-0 p-2">
                        <Badge pill bg="danger">
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="me-1"
                          />
                          Quá hạn
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <Stack direction="horizontal" className="mb-2">
                      <Card.Title className="mb-0 flex-grow-1 text-truncate">
                        {borrow.book?.title || "Không có tiêu đề"}
                      </Card.Title>
                      {getStatusBadge(borrow.status, isOverdue)}
                    </Stack>

                    <Card.Subtitle className="mb-2 text-muted small">
                      {borrow.book?.author.name || "Tác giả không xác định"}
                    </Card.Subtitle>

                    {/* Add category information */}
                    {borrow.book?.category?.[0]?.name && (
                      <div className="small text-muted mb-2">
                        <FontAwesomeIcon icon={faTags} className="me-2" />
                        <strong>Thể loại:</strong>{" "}
                        {borrow.book.category[0].name}
                      </div>
                    )}

                    {/* Add book status information */}
                    {borrow.book?.status && (
                      <div className="small text-muted mb-2">
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                        <strong>Tình trạng sách:</strong>{" "}
                        <Badge
                          pill
                          bg={
                            borrow.book.status === "returned"
                              ? "success"
                              : borrow.book.status === "borrowed"
                              ? "warning"
                              : "secondary"
                          }
                          className="ms-1"
                        >
                          {borrow.book.status === "returned"
                            ? "đã trả"
                            : borrow.book.status === "borrowed"
                            ? "Đang mượn"
                            : borrow.book.status}
                        </Badge>
                      </div>
                    )}

                    <div className="small text-muted mb-2">
                      <div>
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="me-2"
                        />
                        <strong>Ngày mượn:</strong>{" "}
                        {new Date(borrow.borrow_date).toLocaleDateString()}
                      </div>
                      <div>
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="me-2"
                        />
                        <strong>Hạn trả:</strong>{" "}
                        {new Date(borrow.exp_date).toLocaleDateString()}
                      </div>
                      {borrow.return_date && (
                        <div>
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="me-2"
                          />
                          <strong>Ngày trả:</strong>{" "}
                          {new Date(borrow.return_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="mt-auto">
                      {borrow.status === "borrowed" && (
                        <>
                          <div className="d-flex justify-content-between small mb-1">
                            <span>Thời hạn:</span>
                            <span
                              className={isOverdue ? "text-danger fw-bold" : ""}
                            >
                              {isOverdue
                                ? "Đã quá hạn"
                                : `${borrow.remainingDays} ngày còn lại`}
                            </span>
                          </div>
                          <ProgressBar
                            variant={
                              isOverdue
                                ? "danger"
                                : dueProgress > 70
                                ? "warning"
                                : "success"
                            }
                            now={dueProgress}
                            className="mb-2"
                          />
                        </>
                      )}

                      {getActionButton(borrow)}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default PersonalLibrary;
