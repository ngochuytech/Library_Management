import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Image,
  // Pagination, // Sẽ dùng sau
  Button,
  Tabs,
  Tab,
  Spinner,
  Alert,
  // InputGroup, // Cho tìm kiếm
  // Form        // Cho tìm kiếm
} from "react-bootstrap";
import {
  faBook,
  // faCalendarAlt, // Chưa dùng
  faCheckCircle,
  faTimesCircle,
  faHistory,
  // faSearch, // Chưa dùng
  faEye,
  faCheck,
  faTimes,
  faSync,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminBorrows = () => {
  const navigate = useNavigate();

  

  const [borrowingHistoryList, setBorrowingHistoryList] = useState([]);
  const [borrowingRequestsList, setBorrowingRequestsList] = useState([]);

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // Thêm state cho việc cập nhật

  const [errorHistory, setErrorHistory] = useState(null);
  const [errorRequests, setErrorRequests] = useState(null);

  const [activeTabKey, setActiveTabKey] = useState('history');



  const fetchBorrowingHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setErrorHistory(null);
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) throw new Error("Yêu cầu xác thực.");
      const response = await axios.get(`${API_BASE_URL}/borrows/api/admin/all`, {
        params: { status__ne: 'PENDING' },
        headers: { Authorization: `Bearer ${token}` }
      });
      setBorrowingHistoryList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setErrorHistory(err.response?.data?.message || err.message || "Không thể tải lịch sử mượn sách.");
      setBorrowingHistoryList([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const fetchBorrowingRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    setErrorRequests(null);
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) throw new Error("Yêu cầu xác thực.");
      const response = await axios.get(`${API_BASE_URL}/borrows/api/admin/all`, {
        params: { status: 'PENDING' },
        headers: { Authorization: `Bearer ${token}` }
      });
      setBorrowingRequestsList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setErrorRequests(err.response?.data?.message || err.message || "Không thể tải yêu cầu mượn sách.");
      setBorrowingRequestsList([]);
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    if (activeTabKey === 'history') {
      fetchBorrowingHistory();
    } else if (activeTabKey === 'requests') {
      fetchBorrowingRequests();
    }
  }, [activeTabKey, fetchBorrowingHistory, fetchBorrowingRequests]);

  const renderStatus = (status) => {
    // (Giữ nguyên hàm renderStatus của bạn)
    const normalizedStatus = status ? status.toLowerCase() : 'unknown';
    switch (normalizedStatus) {
      case "returned":
        return (
          <Badge bg="success" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
            Đã trả
          </Badge>
        );
      case "approved": // Trạng thái này sẽ hiển thị trong Lịch sử
      case "borrowing": // Thường thì 'APPROVED' sẽ chuyển thành 'BORROWING' sau khi người dùng nhận sách
        return (
          <Badge bg="primary" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faBook} className="me-1" />
            Đang mượn/Đã duyệt
          </Badge>
        );
      case "overdue":
        return (
          <Badge bg="danger" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
            Trả trễ
          </Badge>
        );
      case "pending":
        return (
          <Badge bg="warning" text="dark" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faClock} className="me-1" />
            Chờ duyệt
          </Badge>
        );
      case "rejected": // Trạng thái này sẽ hiển thị trong Lịch sử
        return (
          <Badge bg="secondary" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            Đã từ chối
          </Badge>
        );
      default:
        return <Badge bg="dark">{status || "Không rõ"}</Badge>;
    }
  };

  const handleViewDetail = (borrowId) => {
    navigate(`/admin/borrowDetail/${borrowId}`);
  };

  const handleViewRequestDetail = (requestId) => {
    navigate(`/admin/requestDetail/${requestId}`);
  };

  // Hàm chung để cập nhật trạng thái
  const updateBorrowStatus = async (requestId, newStatus, successMessage, errorMessagePrefix) => {
    if (isUpdatingStatus) return; // Ngăn chặn click nhiều lần
    setIsUpdatingStatus(true);

    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        alert("Yêu cầu xác thực. Vui lòng đăng nhập lại.");
        setIsUpdatingStatus(false);
        return;
      }
      const requestDetails = borrowingRequestsList.find(req => req.id === requestId);
      if (!requestDetails) {
        alert("Không tìm thấy chi tiết yêu cầu để cập nhật.");
        console.error("Request details not found for ID:", requestId, "in list:", borrowingRequestsList);
        setIsUpdatingStatus(false);
        return;
      }

      const userId = requestDetails.user?.id;
      const bookId = requestDetails.book?.id;

      // Kiểm tra xem user.id và book.id có tồn tại không
      if (!userId) {
        console.error("Không tìm thấy User ID trong requestDetails:", requestDetails);
        alert("Dữ liệu yêu cầu không hợp lệ (thiếu User ID).");
        setIsUpdatingStatus(false);
        return;
      }
      if (!bookId) {
        console.error("Không tìm thấy Book ID trong requestDetails:", requestDetails);
        alert("Dữ liệu yêu cầu không hợp lệ (thiếu Book ID).");
        setIsUpdatingStatus(false);
        return;
      }

      console.log(`Attempting to update request ID: ${requestId} to status: ${newStatus}`);
      const payload = {
        user_id: userId, // Hoặc user: userId nếu backend cần object user đầy đủ
        book_id: bookId, // Hoặc book: bookId nếu backend cần object book đầy đủ
        status: newStatus,
        // Backend có thể cần thêm các trường khác từ requestDetails, ví dụ:
        // borrow_date: requestDetails.borrow_date,
        // exp_date: requestDetails.exp_date,
        // Nếu backend là Django REST Framework và dùng ModelSerializer cho PUT,
        // nó có thể yêu cầu tất cả các trường (hoặc các trường required của model).
      };
      console.log("Sending payload:", payload);
      await axios.put(
        `${API_BASE_URL}/borrows/api/edit/${requestId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(successMessage);
      fetchBorrowingRequests(); // Tải lại danh sách yêu cầu
      fetchBorrowingHistory();  // Tải lại danh sách lịch sử
      // Chuyển tab nếu cần thiết (ví dụ, nếu đang ở tab Yêu cầu và duyệt thành công)
      // if (activeTabKey === 'requests') {
      //   setActiveTabKey('history'); 
      // }

    } catch (err) {
      console.error(`${errorMessagePrefix} ID ${requestId}:`, err);
      if (err.response) {
        console.error("Lỗi từ server (err.response.data):", err.response.data);
        // Cố gắng hiển thị thông báo lỗi chi tiết hơn từ các trường cụ thể nếu có
        let detailedErrors = "";
        if (err.response.data && err.response.data.error) {
            const errorObj = err.response.data.error;
            for (const key in errorObj) {
                if (Array.isArray(errorObj[key])) {
                    detailedErrors += `${key}: ${errorObj[key].join(', ')}\n`;
                }
            }
        }
        alert(`${errorMessagePrefix}: ${err.response.data?.message || err.message}\n${detailedErrors}`);
      } else {
        alert(`${errorMessagePrefix}: ${err.message}`);
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };


  const handleApproveRequest = (requestId) => {
    // Optional: Thêm xác nhận từ người dùng
    // if (!window.confirm("Bạn có chắc chắn muốn duyệt yêu cầu này?")) return;
    updateBorrowStatus(requestId, 'Approved', 'Yêu cầu đã được duyệt thành công!', 'Lỗi khi duyệt yêu cầu');
  };

  const handleRejectRequest = (requestId) => {
    // Optional: Thêm xác nhận
    // if (!window.confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) return;
    updateBorrowStatus(requestId, 'Canceled', 'Yêu cầu đã được từ chối!', 'Lỗi khi từ chối yêu cầu');
  };


  // --- PHẦN JSX GIỮ NGUYÊN NHƯ TRƯỚC, chỉ cập nhật disable cho button ---
  // Mình sẽ chỉ paste lại phần table Yêu cầu để minh họa việc disable nút
  // Bạn cần áp dụng tương tự cho các nút khác nếu cần
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white pb-0">
              <Tabs
                activeKey={activeTabKey}
                onSelect={(k) => setActiveTabKey(k)}
                id="library-tabs"
                className="mb-0"
              >
                <Tab
                  eventKey="history"
                  title={
                    <span>
                      <FontAwesomeIcon icon={faHistory} className="me-2" />
                      Lịch sử ({borrowingHistoryList.length})
                    </span>
                  }
                >
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">Lịch sử mượn sách</h4>
                      <Button variant="outline-primary" size="sm" onClick={fetchBorrowingHistory} disabled={isLoadingHistory || isUpdatingStatus}>
                        <FontAwesomeIcon icon={faSync} className={isLoadingHistory ? "fa-spin" : ""} /> Tải lại
                      </Button>
                    </div>
                    {/* ... loading/error/empty states for history ... */}
                    {!isLoadingHistory && !errorHistory && borrowingHistoryList.length > 0 && (
                      <Table hover responsive className="mb-0">
                        <thead>
                          <tr>
                            <th>Sách</th>
                            <th>Người mượn</th>
                            <th>Ngày mượn</th>
                            <th>Hạn trả</th>
                            <th>Ngày trả</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {borrowingHistoryList.map((record) => (
                            <tr key={record.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Image
                                    src={record.book?.image ? `${API_BASE_URL}${record.book.image}` : "/book_placeholder.jpg"}
                                    alt={record.book?.title}
                                    width={50}
                                    className="me-3 rounded shadow-sm"
                                    onError={(e) => { e.target.onerror = null; e.target.src="/book_placeholder.jpg"; }}
                                  />
                                  <div>
                                    <h6 className="mb-1">
                                      {record.book?.title || "N/A"}
                                    </h6>
                                    <p className="text-muted small mb-0">
                                      {record.book?.author?.name || "N/A"}
                                    </p>
                                    {record.book?.category && record.book.category.length > 0 && (
                                        <Badge bg="light" text="dark" className="mt-1">
                                            {record.book.category.map(cat => cat.name).join(', ')}
                                        </Badge>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>{record.user?.username || record.user?.name || "N/A"}</td>
                              <td>{record.borrow_date ? new Date(record.borrow_date).toLocaleDateString() : "-"}</td>
                              <td>{record.exp_date ? new Date(record.exp_date).toLocaleDateString() : "-"}</td>
                              <td>{record.return_date ? new Date(record.return_date).toLocaleDateString() : "-"}</td>
                              <td>{renderStatus(record.status)}</td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleViewDetail(record.id)}
                                  disabled={isUpdatingStatus}
                                >
                                  <FontAwesomeIcon icon={faEye} className="me-1" /> Xem
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                     {/* Fallback for loading/error/empty states for history */}
                    {isLoadingHistory && <div className="text-center p-3"><Spinner animation="border" /> <p>Đang tải lịch sử...</p></div>}
                    {errorHistory && !isLoadingHistory && <Alert variant="danger" className="m-3">{errorHistory}</Alert>}
                    {!isLoadingHistory && !errorHistory && borrowingHistoryList.length === 0 && (
                      <div className="text-center py-5">
                        <FontAwesomeIcon icon={faHistory} className="text-muted mb-3" style={{ fontSize: "3rem" }} />
                        <h5>Không có lịch sử mượn sách</h5>
                      </div>
                    )}
                  </div>
                </Tab>
                <Tab
                  eventKey="requests"
                  title={
                    <span>
                      <FontAwesomeIcon icon={faBook} className="me-2" />
                      Yêu cầu ({borrowingRequestsList.length})
                    </span>
                  }
                >
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">Yêu cầu mượn sách</h4>
                        <Button variant="outline-primary" size="sm" onClick={fetchBorrowingRequests} disabled={isLoadingRequests || isUpdatingStatus}>
                          <FontAwesomeIcon icon={faSync} className={isLoadingRequests ? "fa-spin" : ""} /> Tải lại
                      </Button>
                    </div>
                    {/* ... loading/error/empty states for requests ... */}
                    {!isLoadingRequests && !errorRequests && borrowingRequestsList.length > 0 && (
                      <Table hover responsive className="mb-0">
                        <thead>
                          <tr>
                            <th>Sách</th>
                            <th>Người yêu cầu</th>
                            <th>Ngày yêu cầu</th>
                            <th>Số ngày mượn</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {borrowingRequestsList.map((request) => (
                            <tr key={request.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Image
                                    src={request.book?.image ? `${API_BASE_URL}${request.book.image}` : "/book_placeholder.jpg"}
                                    alt={request.book?.title}
                                    width={50}
                                    className="me-3 rounded shadow-sm"
                                    onError={(e) => { e.target.onerror = null; e.target.src="/book_placeholder.jpg"; }}
                                  />
                                  <div>
                                    <h6 className="mb-1">{request.book?.title || "N/A"}</h6>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <h6 className="mb-1">{request.user?.username || request.user?.name || "N/A"}</h6>
                                  </div>
                                </div>
                              </td>
                              <td>{request.borrow_date ? new Date(request.borrow_date).toLocaleDateString() : (request.created_at ? new Date(request.created_at).toLocaleDateString() : "N/A")}</td>
                              <td>{request.borrow_days} ngày</td>
                              <td>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleApproveRequest(request.id)}
                                  disabled={isUpdatingStatus}
                                >
                                  <FontAwesomeIcon icon={faCheck} className="me-1" /> {isUpdatingStatus ? "Đang..." : "Duyệt"}
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleRejectRequest(request.id)}
                                  disabled={isUpdatingStatus}
                                >
                                  <FontAwesomeIcon icon={faTimes} className="me-1" /> {isUpdatingStatus ? "Đang..." : "Từ chối"}
                                </Button>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleViewRequestDetail(request.id)}
                                  disabled={isUpdatingStatus}
                                >
                                  <FontAwesomeIcon icon={faEye} className="me-1" /> Xem
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                     {/* Fallback for loading/error/empty states for requests */}
                    {isLoadingRequests && <div className="text-center p-3"><Spinner animation="border" /> <p>Đang tải yêu cầu...</p></div>}
                    {errorRequests && !isLoadingRequests && <Alert variant="danger" className="m-3">{errorRequests}</Alert>}
                    {!isLoadingRequests && !errorRequests && borrowingRequestsList.length === 0 && (
                      <div className="text-center py-5">
                        <FontAwesomeIcon icon={faBook} className="text-muted mb-3" style={{ fontSize: "3rem" }} />
                        <h5>Không có yêu cầu mượn sách nào</h5>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Header>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminBorrows;