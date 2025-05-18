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
  InputGroup,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faExclamationTriangle,
  faBook,
  faClock,
  faUndo,
  faHandPointer,
  faSearch,
  faCalendarAlt,
  faTags,
  faInfoCircle,
  faHourglassHalf, // Thêm icon cho "Chờ xử lý"
  faCheckCircle,   // Thêm icon cho "Đã duyệt trả"
} from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

// Đặt tên component là PersonalLibrary hoặc MyBookshelf tùy theo file của bạn
const PersonalLibrary = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDays, setFilterDays] = useState("all");

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        setLoading(true);
        const id = userId || sessionStorage.getItem("idUser");
        if (!id) {
          throw new Error("Không tìm thấy User ID người dùng.");
        }

        const BASE_URL = import.meta.env.VITE_API_URL;
        const token = sessionStorage.getItem("access_token");
        if (!token) {
          throw new Error("Yêu cầu xác thực tài khoản.");
        }

        const response = await axios.get(`${BASE_URL}/borrows/api/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawData = Array.isArray(response.data) ? response.data : [];
        const processedData = rawData.map((borrow) => {
          const expDate = borrow.exp_date ? new Date(borrow.exp_date) : null;
          let itemIsOverdue = false;
          // Coi "Approved" và "borrowed" là các trạng thái có thể bị quá hạn
          if (expDate && (borrow.status === "Approved" || borrow.status === "borrowed")) {
            const endOfExpDate = new Date(expDate);
            endOfExpDate.setHours(23, 59, 59, 999);
            const startOfCurrentDate = new Date();
            startOfCurrentDate.setHours(0,0,0,0);
            if (startOfCurrentDate > endOfExpDate) {
              itemIsOverdue = true;
            }
          }
          return {
            ...borrow,
            remainingDays: calculateRemainingDays(borrow.exp_date, borrow.status), // calculateRemainingDays cũng cần xem xét status "Approved"
            isOverdue: itemIsOverdue,
          };
        });
        setBorrows(processedData);
      // ...
      } catch (error) {
        console.error("Lỗi khi tải danh sách mượn sách:", error);
        toast.error(error.message || "Không tải được lịch sử mượn sách.");
        setBorrows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [userId]);

  const calculateRemainingDays = (expDateStr, borrowStatus) => {
    if (!["borrowed", "Approved"].includes(borrowStatus) || !expDateStr) {
      return null;
    }
    const now = new Date();
    now.setHours(0,0,0,0);
    const expDate = new Date(expDateStr);
    expDate.setHours(0,0,0,0);
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((expDate - now) / msPerDay);
  };

  const handleActionClick = (borrow, action) => {
    console.log(`Action "${action}" for borrow ID: ${borrow.id}, Book: ${borrow.book?.title}`);
    toast.info(`Chức năng "${action}" cho sách "${borrow.book?.title}" đang được phát triển.`);
  };

  // Badge cho TÌNH TRẠNG SÁCH (book.status)
  const getBookStatusBadge = (bookStatus) => {
    let variant = "light";
    let label = bookStatus;
    let textColor = "dark";

    if (!bookStatus) return null;
    const statusNormalized = String(bookStatus).toUpperCase();

    switch (statusNormalized) {
      case "PENDING":
        variant = "info";
        label = "Chờ duyệt";
        textColor = "blue";
        break;
      case "Approved":
        variant = "success";
        label = "Đã duyệt";
        textColor = "green";
        break;
      case "Canceled":
      // Hỗ trợ cả hai cách viết
        variant = "secondary";
        label = "Đã hủy";
        textColor = "gray";
        break;
      default:
        // Nếu trạng thái sách không nằm trong 3 trạng thái trên, hiển thị trạng thái gốc
        // Hoặc bạn có thể chọn không hiển thị gì cả nếu không muốn
        label = bookStatus;
        console.warn(`Trạng thái sách không xác định: ${bookStatus}`);
        break;
    }
    return (
      <Badge pill bg={variant} text={textColor} className="ms-1">
        {label}
      </Badge>
    );
  };
  
  // Badge cho TRẠNG THÁI PHIẾU MƯỢN (borrow.status)
  const getBorrowTransactionStatusBadge = (borrowStatus, isOverdue) => {
    // Sửa lỗi cú pháp: "let-" thành "let"
    let variants = { 
      borrowed: isOverdue ? "danger" : "primary",
      waiting: "info",
      returned: "success",
      cancelled: "secondary",
      approved_return: "success", // Trạng thái admin duyệt yêu cầu trả sách
    };
    let labels = {
      borrowed: isOverdue ? "Quá hạn" : "Đang mượn",
      waiting: "Chờ xử lý",
      returned: "Đã trả",
      cancelled: "Đã hủy",
      approved_return: "Đã duyệt trả",
    };

    return (
      <Badge pill bg={variants[borrowStatus] || "dark"} text={variants[borrowStatus] === "light" ? "dark" : "white"} className="ms-2">
        {labels[borrowStatus] || borrowStatus}
      </Badge>
    );
  };

  const getActionButton = (borrow) => {
    // (Giữ nguyên hàm getActionButton từ phiên bản trước hoặc điều chỉnh nếu cần)
    // ... (logic nút action)
    // Ví dụ cơ bản:
     const actionKey = borrow.isOverdue && borrow.status === "borrowed" ? "renew" : 
                      borrow.status === "borrowed" ? "return" :
                      borrow.status === "waiting" ? "cancel_request" :
                      borrow.status === "returned" ? "reborrow" : "details_other";

    let config = { label: "Chi tiết", variant: "outline-secondary", icon: faInfoCircle };

    if (borrow.status === "approved_return") {
        return (
            <Button variant="outline-success" size="sm" className="w-100 mt-2" disabled>
                <FontAwesomeIcon icon={faCheckCircle} className="me-2" /> 
                Đã duyệt trả
            </Button>
        );
    }
    
    switch(actionKey){
        case "renew":
            config = {label: "Gia hạn", variant: "outline-warning", icon: faHandPointer};
            break;
        case "return":
            config = {label: "Trả sách", variant: "outline-primary", icon: faUndo};
            break;
        case "cancel_request":
            config = {label: "Hủy yêu cầu", variant: "outline-danger", icon: faHandPointer};
            break;
        case "reborrow":
             config = {label: "Mượn lại", variant: "outline-success", icon: faBook};
            break;
        default: // details_other or any unhandled status
            // config remains "Chi tiết"
            break;
    }

    return (
      <Button
        variant={config.variant}
        size="sm"
        className="w-100 mt-2"
        onClick={() => handleActionClick(borrow, config.label)}
      >
        <FontAwesomeIcon icon={config.icon} className="me-2" />
        {config.label}
      </Button>
    );
  };
  
  const calculateDueProgress = (expDateStr, borrowStatus, borrowDateStr) => {
    if (borrowStatus !== "borrowed" || !expDateStr || !borrowDateStr) return 0;

    const now = new Date();
    const due = new Date(expDateStr);
    const start = new Date(borrowDateStr);

    if (isNaN(start.getTime()) || isNaN(due.getTime()) || start >= due) return 0; // Ngày không hợp lệ hoặc thời gian mượn = 0

    if (now >= due) return 100; // Quá hạn hoặc đến hạn
    if (now < start) return 0;   // Chưa bắt đầu mượn (lý thuyết)

    const totalDuration = due - start;
    const timeElapsed = now - start;
    
    return Math.min(100, Math.max(0, (timeElapsed / totalDuration) * 100));
  };

  const filteredBorrows = borrows.filter((borrow) => {  
    const currentStatus = String(borrow.status);
    if (
      searchTerm &&
      !`${borrow.book?.title || ""} ${borrow.book?.author?.name || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    let tabMatch = false;
    if (activeTab === "all") {
      tabMatch = true;
    } else if (activeTab === "current") {
      if ((borrow.status === "Approved" || borrow.status === "borrowed") && !borrow.isOverdue) {
        tabMatch = true;
      }
    } else if (activeTab === "overdue") {
      if ((currentStatus === "Approved" || currentStatus === "borrowed") && borrow.isOverdue) tabMatch = true;
    } else if (activeTab === "waiting") {
      if (borrow.status === "PENDING") tabMatch = true;
    } else if (activeTab === "history") {
      if (["returned", "Canceled", "approved_return"].includes(currentStatus)) tabMatch = true; // Sử dụng Canceled từ DB
    }
    if (!tabMatch) return false;

    if (filterDays !== "all") {
      const isBorrowedNotOverdue = borrow.status === "Approved" && !borrow.isOverdue;
      const isBorrowedAndOverdue = borrow.status === "Approved" && borrow.isOverdue;

      if (filterDays === "7") { // "Còn > 7 ngày"
        // remainingDays được tính từ đầu ngày hiện tại đến đầu ngày hết hạn
        // Nếu remainingDays = 7, nghĩa là còn đúng 7 ngày (tính cả ngày hiện tại nếu chưa qua)
        if (!(isBorrowedNotOverdue && borrow.remainingDays !== null && borrow.remainingDays >= 7)) {
          return false;
        }
      } else if (filterDays === "3") { // "Còn 3-7 ngày" (chính xác hơn là 3 đến <7 ngày)
        // Nếu remainingDays = 3, 4, 5, 6
        if (!(isBorrowedNotOverdue && borrow.remainingDays !== null && borrow.remainingDays >=3 && borrow.remainingDays < 7)) {
          return false;
        }
      } else if (filterDays === "0") { // "Đã quá hạn"
        if (!isBorrowedAndOverdue) return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <ProgressBar animated now={100} variant="primary" className="mb-3" />
        <p>Đang tải thông tin mượn sách...</p>
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
          <InputGroup style={{ width: "280px" }}> {/* Tăng độ rộng một chút */}
            <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Tìm theo tựa sách, tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap"> {/* Thêm flex-wrap */}
          <Nav variant="tabs" className="flex-grow-1 mb-2 mb-md-0"> {/* Điều chỉnh margin */}
            <Nav.Item>
              <Nav.Link eventKey="all">
                <FontAwesomeIcon icon={faBook} className="me-1" />
                Tất cả ({borrows.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="current">
                <FontAwesomeIcon icon={faClock} className="me-1" />
                Đang mượn ({borrows.filter(b => (String(b.status) === "Approved" || String(b.status) === "borrowed") && !b.isOverdue).length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="overdue">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-1 text-danger" />
                Quá hạn ({borrows.filter(b => (String(b.status) === "Approved" || String(b.status) === "borrowed") && b.isOverdue).length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                 <Nav.Link eventKey="waiting">
                     <FontAwesomeIcon icon={faHourglassHalf} className="me-1 text-info" /> 
                     Chờ xử lý ({borrows.filter(b => String(b.status) === "PENDING").length})
                 </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="history">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                Lịch sử ({borrows.filter(b => ["returned", "Canceled", "approved_return"].includes(String(b.status))).length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Form.Select
            size="sm"
            style={{ width: "200px" }} /* Tăng độ rộng một chút */
            className="ms-md-3" /* Thêm margin cho màn hình md trở lên */
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
            aria-label="Lọc theo thời hạn"
          >
            <option value="all">Tất cả thời hạn</option>
            <option value="7">Còn &gt;= 7 ngày</option> {/* Sửa lại ý nghĩa cho rõ */}
            <option value="3">Còn 3 đến &lt;7 ngày</option> {/* Sửa lại ý nghĩa cho rõ */}
            <option value="0">Đã quá hạn / Hôm nay</option> {/* Bao gồm cả hết hạn hôm nay */}
          </Form.Select>
        </div>
      </Tab.Container>

      {filteredBorrows.length === 0 ? (
        <Alert variant="info" className="text-center mt-4 py-4"> {/* Thêm padding */}
          <FontAwesomeIcon icon={faBookOpen} size="3x" className="mb-3 text-muted" />
          <h4>Không có sách nào phù hợp</h4>
          <p className="mb-0">Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4 mt-0">
          {filteredBorrows.map((borrow) => {
            const isCurrentlyBorrowedNotOverdue = borrow.status === "borrowed" && !borrow.isOverdue;
            const isCurrentlyOverdue = borrow.status === "borrowed" && borrow.isOverdue;
            const dueProgress = calculateDueProgress(borrow.exp_date, borrow.status, borrow.borrow_date);
            const remainingDaysDisplay = borrow.remainingDays; // Đã được tính toán ở useEffect

            return (
              <Col key={borrow.id}>
                <Card className={`h-100 shadow-sm border-0 overflow-hidden ${isCurrentlyOverdue ? 'border-2 border-danger' : ''}`}>
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={ (borrow.book?.image && borrow.book.image.startsWith('http') ? borrow.book.image : `/image/${borrow.book?.image}`) || "https://via.placeholder.com/300x200?text=S%C3%A1ch" }
                      alt={borrow.book?.title || "Không có tiêu đề"}
                      style={{ height: "200px", objectFit: "cover", filter: isCurrentlyOverdue ? "sepia(20%)" : "none" }}
                    />
                    {isCurrentlyOverdue && (
                      <div className="position-absolute top-0 start-0 m-2">
                        <Badge pill bg="danger" className="px-2 py-1 fs-small"> {/* Tùy chỉnh kích thước font */}
                          <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                          QUÁ HẠN
                        </Badge>
                      </div>
                    )}
                     {!(borrow.status === "borrowed") && ( // Hiển thị badge trạng thái phiếu mượn nếu không phải "đang mượn"
                         <div className="position-absolute top-0 end-0 m-2">
                             {getBorrowTransactionStatusBadge(borrow.status, borrow.isOverdue)}
                         </div>
                     )}
                  </div>

                  <Card.Body className="d-flex flex-column p-3">
                    <Card.Title className="h6 mb-1 flex-grow-0 text-truncate" title={borrow.book?.title || "Không có tiêu đề"}>
                      {borrow.book?.title || "Không có tiêu đề"}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted small">
                      {borrow.book?.author?.name || "Tác giả không xác định"}
                    </Card.Subtitle>

                    {borrow.book?.category?.length > 0 && (
                      <div className="small text-muted mb-1">
                        <FontAwesomeIcon icon={faTags} className="me-1 text-secondary" />
                        {borrow.book.category.map(cat => cat.name).join(', ')}
                      </div>
                    )}
                    {/* Chỉ hiển thị tình trạng sách nếu có và không phải trạng thái mặc định (APPROVED có thể là mặc định) */}
                    {borrow.book?.status && !["APPROVED", "AVAILABLE"].includes(String(borrow.book.status).toUpperCase()) && (
                      <div className="small text-muted mb-2">
                        <FontAwesomeIcon icon={faBook} className="me-1 text-secondary" />
                        Tình trạng sách: {getBookStatusBadge(borrow.book.status)}
                      </div>
                    )}
                    
                    <div className="small text-muted mt-1 mb-2">
                      {borrow.borrow_date && (
                        <div><FontAwesomeIcon icon={faCalendarAlt} className="me-1" />Mượn: {new Date(borrow.borrow_date).toLocaleDateString('vi-VN')}</div>
                      )}
                      {/* Chỉ hiển thị hạn trả nếu sách đang được mượn */}
                      {borrow.status === "borrowed" && borrow.exp_date && (
                        <div><FontAwesomeIcon icon={faClock} className="me-1 ${isCurrentlyOverdue ? 'text-danger' : 'text-secondary'}" />Hạn trả: {new Date(borrow.exp_date).toLocaleDateString('vi-VN')}</div>
                      )}
                      {borrow.return_date && ["returned", "approved_return"].includes(borrow.status) && (
                        <div><FontAwesomeIcon icon={faUndo} className="me-1 text-success" />Đã trả: {new Date(borrow.return_date).toLocaleDateString('vi-VN')}</div>
                      )}
                    </div>

                    <div className="mt-auto pt-2">
                      {isCurrentlyBorrowedNotOverdue && borrow.exp_date && (
                        <>
                          <div className="d-flex justify-content-between small mb-1">
                            <span>Thời hạn:</span>
                            <span className={remainingDaysDisplay !== null && remainingDaysDisplay < 3 ? "text-warning fw-bold" : ""}>
                              {remainingDaysDisplay !== null ? (remainingDaysDisplay >= 0 ? `${remainingDaysDisplay} ngày còn lại` : `Quá ${Math.abs(remainingDaysDisplay)} ngày`) : 'N/A'}
                              {remainingDaysDisplay === 0 && " (Hôm nay)"}
                            </span>
                          </div>
                          <ProgressBar
                            variant={remainingDaysDisplay !== null && remainingDaysDisplay < 1 ? "danger" : remainingDaysDisplay !== null && remainingDaysDisplay < 3 ? "warning" : "success"}
                            now={dueProgress}
                            className="mb-2" style={{height: '6px'}}
                          />
                        </>
                      )}
                      {isCurrentlyOverdue && (
                        <Alert variant="danger" className="p-2 small text-center mb-2">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-1"/>
                            Đã quá hạn {remainingDaysDisplay !== null ? Math.abs(remainingDaysDisplay) : ''} ngày!
                        </Alert>
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