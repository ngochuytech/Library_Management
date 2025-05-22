import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Image,
  Button,
  Tabs,
  Tab,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import {
  faBook,
  faCheckCircle,
  faTimesCircle,
  faHistory,
  faEye,
  faCheck,
  faTimes,
  faSync,
  faClock,
  faSort,
  faFilter,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- HÀM TIỆN ÍCH CHO SẮP XẾP VÀ LỌC ---

/**
 * Sắp xếp mảng dữ liệu.
 * @param {Array} data - Mảng cần sắp xếp.
 * @param {Object} config - Cấu hình sắp xếp { key: string, direction: 'asc' | 'desc' }.
 * @returns {Array} Mảng đã sắp xếp.
 */
const sortData = (data, config) => {
  if (!config || !config.key) {
    return data;
  }
  const sortedData = [...data].sort((a, b) => {
    let valA = a;
    let valB = b;

    if (config.key.includes(".")) {
      const keys = config.key.split(".");
      valA = keys.reduce(
        (obj, k) => (obj && typeof obj[k] !== "undefined" ? obj[k] : null),
        a
      );
      valB = keys.reduce(
        (obj, k) => (obj && typeof obj[k] !== "undefined" ? obj[k] : null),
        b
      );
    } else {
      valA = a[config.key];
      valB = b[config.key];
    }

    if (valA === null || typeof valA === "undefined") return 1;
    if (valB === null || typeof valB === "undefined") return -1;

    const dateKeys = ["borrow_date", "exp_date", "return_date", "require_date"];
    if (dateKeys.includes(config.key)) {
      const dateA = new Date(valA).getTime();
      const dateB = new Date(valB).getTime();
      if (dateA < dateB) return config.direction === "asc" ? -1 : 1;
      if (dateA > dateB) return config.direction === "asc" ? 1 : -1;
      return 0;
    }

    if (typeof valA === "number" && typeof valB === "number") {
      if (valA < valB) return config.direction === "asc" ? -1 : 1;
      if (valA > valB) return config.direction === "asc" ? 1 : -1;
      return 0;
    }

    if (typeof valA === "string" && typeof valB === "string") {
      const strA = valA.toLowerCase();
      const strB = valB.toLowerCase();
      if (strA < strB) return config.direction === "asc" ? -1 : 1;
      if (strA > strB) return config.direction === "asc" ? 1 : -1;
      return 0;
    }

    return 0;
  });
  return sortedData;
};

/**
 * Lọc dữ liệu dựa trên văn bản tìm kiếm.
 * @param {Array} data - Mảng cần lọc.
 * @param {string} text - Văn bản tìm kiếm.
 * @param {Array<string>} fieldsToSearch - Các trường cần tìm kiếm.
 * @returns {Array} Mảng đã lọc.
 */
const filterDataByText = (data, text, fieldsToSearch) => {
  if (!text) {
    return data;
  }
  const lowercasedText = text.toLowerCase();
  return data.filter((item) => {
    return fieldsToSearch.some((field) => {
      let value;
      if (field.includes(".")) {
        const keys = field.split(".");
        value = keys.reduce(
          (obj, k) => (obj && typeof obj[k] !== "undefined" ? obj[k] : null),
          item
        );
      } else {
        value = item[field];
      }
      return value && String(value).toLowerCase().includes(lowercasedText);
    });
  });
};

/**
 * Lọc dữ liệu theo một ngày cụ thể trên một trường ngày được chọn.
 * @param {Array} data - Mảng cần lọc.
 * @param {string} dateField - Tên trường ngày cần lọc.
 * @param {string} selectedDate - Ngày được chọn (định dạng YYYY-MM-DD).
 * @returns {Array} Mảng đã lọc.
 */
const filterDataByDate = (data, dateField, selectedDate) => {
  if (!selectedDate || !dateField) {
    return data;
  }
  const filterDay = new Date(selectedDate).toISOString().split("T")[0];

  return data.filter((item) => {
    const itemDateValue = item[dateField];
    if (!itemDateValue) return false;
    const itemDay = new Date(itemDateValue).toISOString().split("T")[0];
    return itemDay === filterDay;
  });
};

const AdminBorrows = () => {
  const navigate = useNavigate();

  const [borrowingHistoryList, setBorrowingHistoryList] = useState([]);
  const [borrowingRequestsList, setBorrowingRequestsList] = useState([]);

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(null);

  const [errorHistory, setErrorHistory] = useState(null);
  const [errorRequests, setErrorRequests] = useState(null);

  const [activeTabKey, setActiveTabKey] = useState("history");

  const [historySortConfig, setHistorySortConfig] = useState({
    key: "borrow_date",
    direction: "desc",
  });
  const [historyFilterText, setHistoryFilterText] = useState("");
  const [historyFilterDate, setHistoryFilterDate] = useState({
    field: "",
    date: "",
  });

  const [requestsSortConfig, setRequestsSortConfig] = useState({
    key: "require_date",
    direction: "desc",
  });
  const [requestsFilterText, setRequestsFilterText] = useState("");
  const [requestsFilterDate, setRequestsFilterDate] = useState({
    field: "",
    date: "",
  });

  const fetchBorrowingHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setErrorHistory(null);
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) throw new Error("Yêu cầu xác thực.");
      const response = await axios.get(
        `${API_BASE_URL}/borrows/api/admin/all`,
        {
          params: { status__ne: "PENDING" },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBorrowingHistoryList(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      setErrorHistory(
        err.response?.data?.message ||
          err.message ||
          "Không thể tải lịch sử mượn sách."
      );
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
      const response = await axios.get(
        `${API_BASE_URL}/borrows/api/admin/all`,
        {
          params: { status: "PENDING" },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBorrowingRequestsList(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      setErrorRequests(
        err.response?.data?.message ||
          err.message ||
          "Không thể tải yêu cầu mượn sách."
      );
      setBorrowingRequestsList([]);
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      navigate("/login", {
        state: { message: "Vui lòng đăng nhập để truy cập trang này." },
      });
      return;
    }
    if (activeTabKey === "history") {
      fetchBorrowingHistory();
    } else if (activeTabKey === "requests") {
      fetchBorrowingRequests();
    }
  }, [activeTabKey, fetchBorrowingHistory, fetchBorrowingRequests, navigate]);

  const processedHistoryList = useMemo(() => {
    let list = [...borrowingHistoryList];
    list = filterDataByText(list, historyFilterText, [
      "book.title",
      "user.username",
      "user.name",
    ]);
    if (historyFilterDate.field && historyFilterDate.date) {
      list = filterDataByDate(
        list,
        historyFilterDate.field,
        historyFilterDate.date
      );
    }
    list = sortData(list, historySortConfig);
    return list;
  }, [
    borrowingHistoryList,
    historyFilterText,
    historyFilterDate,
    historySortConfig,
  ]);

  const processedRequestsList = useMemo(() => {
    let list = [...borrowingRequestsList];
    list = filterDataByText(list, requestsFilterText, [
      "book.title",
      "user.username",
      "user.name",
    ]);
    if (requestsFilterDate.field && requestsFilterDate.date) {
      list = filterDataByDate(
        list,
        requestsFilterDate.field,
        requestsFilterDate.date
      );
    }
    list = sortData(list, requestsSortConfig);
    return list;
  }, [
    borrowingRequestsList,
    requestsFilterText,
    requestsFilterDate,
    requestsSortConfig,
  ]);

  const renderStatus = (status) => {
    const normalizedStatus = status ? status.toUpperCase() : "UNKNOWN";
    switch (normalizedStatus) {
      case "RETURNED":
        return (
          <Badge bg="success" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
            Đã trả
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge bg="info" text="dark" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faCheck} className="me-1" />
            Đã duyệt
          </Badge>
        );
      case "BORROWED":
        return (
          <Badge bg="primary" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faBook} className="me-1" />
            Đang mượn
          </Badge>
        );
      case "OVERDUE":
        return (
          <Badge bg="danger" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
            Trả trễ
          </Badge>
        );
      case "PENDING":
        return (
          <Badge bg="warning" text="dark" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faClock} className="me-1" />
            Chờ duyệt
          </Badge>
        );
      case "REJECTED":
      case "CANCELED":
        return (
          <Badge bg="secondary" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            Đã từ chối/Hủy
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

  const updateBorrowStatus = async (
    item,
    newStatus,
    successMessage,
    errorMessagePrefix
  ) => {
    if (isUpdatingStatus === item.id) return;
    setIsUpdatingStatus(item.id);

    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        alert("Yêu cầu xác thực. Vui lòng đăng nhập lại.");
        setIsUpdatingStatus(null);
        return;
      }

      if (!item || !item.id || !item.user?.id || !item.book?.id) {
        console.error("Dữ liệu phiếu mượn không đầy đủ:", item);
        alert(
          "Dữ liệu phiếu mượn không hợp lệ (thiếu ID, User ID hoặc Book ID)."
        );
        setIsUpdatingStatus(null);
        return;
      }

      const payload = {
        user_id: item.user.id,
        book_id: item.book.id,
        status: newStatus,
        borrow_days: item.borrow_days,
      };

      console.log(
        `Attempting to update item ID: ${item.id} to status: ${newStatus}`
      );
      console.log("Sending payload:", payload);

      await axios.put(`${API_BASE_URL}/borrows/api/edit/${item.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (newStatus === "BORROWED") {
        await api.post(
          `${API_BASE_URL}/notifications/api/create`,
          {
            user_id: item.user.id,
            message: `Bạn đã mượn sách "${item.book.title}" thành công!`,
          }
        );
      } else if (newStatus === "CANCELED") {
        await api.post(
          `${API_BASE_URL}/notifications/api/create`,
          {
            user_id: item.user.id,
            message: `Yêu cầu mượn sách "${item.book.title}" đã bị từ chối!`,
          }
        );
      } else if (newStatus === "RETURNED") {
        await api.post(
          `${API_BASE_URL}/notifications/api/create`,
          {
            user_id: item.user.id,
            message: `Bạn đã trả sách "${item.book.title}" thành công!`,
          }
        );
      }

      alert(successMessage);
      fetchBorrowingRequests();
      fetchBorrowingHistory();
    } catch (err) {
      console.error(`${errorMessagePrefix} ID ${item.id}:`, err);
      if (err.response) {
        console.error(
          "Lỗi chi tiết từ server (err.response.data):",
          err.response.data
        );
        let detailedErrors = "";
        if (err.response.data && typeof err.response.data === "object") {
          if (err.response.data.message) {
            detailedErrors = err.response.data.message;
          } else if (err.response.data.detail) {
            detailedErrors = err.response.data.detail;
          } else {
            for (const key in err.response.data) {
              if (Array.isArray(err.response.data[key])) {
                detailedErrors += `${key}: ${err.response.data[key].join(
                  ", "
                )}\n`;
              } else {
                detailedErrors += `${key}: ${String(err.response.data[key])}\n`;
              }
            }
          }
          if (
            err.response.data.message === "Edit book unsuccessfull!" &&
            err.response.data.error
          ) {
            detailedErrors =
              "Edit book unsuccessfull! Specific error: " +
              JSON.stringify(err.response.data.error);
          }
        } else if (err.response.data) {
          detailedErrors = String(err.response.data);
        }
        if (!detailedErrors && err.message) detailedErrors = err.message;
        const displayMessage =
          err.response.data?.message === "Edit book unsuccessfull!" &&
          err.response.data?.error
            ? `Lỗi khi duyệt yêu cầu: Edit book unsuccessfull! Chi tiết: ${JSON.stringify(
                err.response.data.error
              )}`
            : `${errorMessagePrefix}: ${
                detailedErrors || "Lỗi không xác định từ server."
              }`;
        alert(displayMessage);
      } else {
        alert(`${errorMessagePrefix}: ${err.message}`);
      }
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleReturnBook = (item) => {
    if (!window.confirm(`Xác nhận sách đã được trả?`)) return;
    updateBorrowStatus(
      item,
      "RETURNED",
      "Đã xác nhận trả sách thành công!",
      "Lỗi khi xác nhận trả sách"
    );
  };
  const handleApproveRequest = (requestItem) => {
    updateBorrowStatus(
      requestItem,
      "APPROVED",
      "Yêu cầu đã được duyệt thành công!",
      "Lỗi khi duyệt yêu cầu"
    );
  };
  const handleRejectRequest = (requestItem) => {
    updateBorrowStatus(
      requestItem,
      "CANCELED",
      "Yêu cầu đã được từ chối!",
      "Lỗi khi từ chối yêu cầu"
    );
  };
  const handleConfirmBorrowing = (historyItem) => {
    if (
      !window.confirm(
        `Xác nhận cho người dùng "${
          historyItem.user?.username || historyItem.user?.name
        }" mượn sách "${
          historyItem.book?.title
        }"?\nHành động này sẽ cập nhật ngày mượn và hạn trả.`
      )
    )
      return;
    updateBorrowStatus(
      historyItem,
      "BORROWED",
      "Đã xác nhận cho mượn sách và cập nhật ngày!",
      "Lỗi khi xác nhận cho mượn"
    );
  };

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
                {/* TAB LỊCH SỬ */}
                <Tab
                  eventKey="history"
                  title={
                    <span>
                      <FontAwesomeIcon icon={faHistory} className="me-2" />
                      Lịch sử ({processedHistoryList.length})
                    </span>
                  }
                >
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">Lịch sử mượn sách</h4>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={fetchBorrowingHistory}
                        disabled={isLoadingHistory || !!isUpdatingStatus}
                      >
                        <FontAwesomeIcon
                          icon={faSync}
                          className={isLoadingHistory ? "fa-spin" : ""}
                        />{" "}
                        Tải lại
                      </Button>
                    </div>

                    <Card body className="mb-3 bg-light">
                      <Row className="g-2 align-items-end">
                        <Col md={6} lg={3}>
                          <Form.Group controlId="historyFilterName">
                            <Form.Label className="small mb-1">
                              <FontAwesomeIcon
                                icon={faFilter}
                                className="me-1"
                              />{" "}
                              Lọc tên sách/người mượn
                            </Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              placeholder="Nhập tên..."
                              value={historyFilterText}
                              onChange={(e) =>
                                setHistoryFilterText(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} lg={2}>
                          <Form.Group controlId="historyFilterDateField">
                            <Form.Label className="small mb-1">
                              <FontAwesomeIcon
                                icon={faFilter}
                                className="me-1"
                              />{" "}
                              Lọc theo trường ngày
                            </Form.Label>
                            <Form.Select
                              size="sm"
                              value={historyFilterDate.field}
                              onChange={(e) =>
                                setHistoryFilterDate((prev) => ({
                                  ...prev,
                                  field: e.target.value,
                                  date: e.target.value ? prev.date : "",
                                }))
                              }
                            >
                              <option value="">Chọn trường</option>
                              <option value="borrow_date">Ngày mượn</option>
                              <option value="exp_date">Hạn trả</option>
                              <option value="return_date">Ngày trả</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6} lg={2}>
                          <Form.Group controlId="historyFilterDateValue">
                            <Form.Label className="small mb-1">
                              Chọn ngày
                            </Form.Label>
                            <Form.Control
                              type="date"
                              size="sm"
                              value={historyFilterDate.date}
                              onChange={(e) =>
                                setHistoryFilterDate((prev) => ({
                                  ...prev,
                                  date: e.target.value,
                                }))
                              }
                              disabled={!historyFilterDate.field}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} lg={2}>
                          <Form.Group controlId="historySortField">
                            <Form.Label className="small mb-1">
                              <FontAwesomeIcon icon={faSort} className="me-1" />{" "}
                              Sắp xếp
                            </Form.Label>
                            <Form.Select
                              size="sm"
                              value={historySortConfig.key || ""}
                              onChange={(e) =>
                                setHistorySortConfig((prev) => ({
                                  ...prev,
                                  key: e.target.value || null,
                                }))
                              }
                            >
                              <option value="">Chọn trường</option>
                              <option value="book.title">Tên sách</option>
                              <option value="user.username">Người mượn</option>
                              <option value="borrow_date">Ngày mượn</option>
                              <option value="exp_date">Hạn trả</option>
                              <option value="return_date">Ngày trả</option>
                              <option value="status">Trạng thái</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6} lg={2}>
                          <Form.Group controlId="historySortDirection">
                            <Form.Label className="small mb-1">
                              Thứ tự
                            </Form.Label>
                            <Form.Select
                              size="sm"
                              value={historySortConfig.direction}
                              onChange={(e) =>
                                setHistorySortConfig((prev) => ({
                                  ...prev,
                                  direction: e.target.value,
                                }))
                              }
                              disabled={!historySortConfig.key}
                            >
                              <option value="asc">Tăng dần / Cũ nhất</option>
                              <option value="desc">Giảm dần / Mới nhất</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={12} lg={1} className="text-end">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              setHistoryFilterText("");
                              setHistoryFilterDate({ field: "", date: "" });
                              setHistorySortConfig({
                                key: "borrow_date",
                                direction: "desc",
                              });
                            }}
                            title="Xóa bộ lọc & sắp xếp"
                          >
                            <FontAwesomeIcon icon={faEraser} />
                          </Button>
                        </Col>
                      </Row>
                    </Card>

                    {isLoadingHistory && (
                      <div className="text-center p-3">
                        <Spinner animation="border" />{" "}
                        <p>Đang tải lịch sử...</p>
                      </div>
                    )}
                    {errorHistory && !isLoadingHistory && (
                      <Alert variant="danger" className="m-3">
                        {errorHistory}
                      </Alert>
                    )}
                    {!isLoadingHistory &&
                      !errorHistory &&
                      processedHistoryList.length === 0 && (
                        <div className="text-center py-5">
                          <FontAwesomeIcon
                            icon={faHistory}
                            className="text-muted mb-3"
                            style={{ fontSize: "3rem" }}
                          />
                          <h5>
                            Không có lịch sử mượn sách{" "}
                            {historyFilterText || historyFilterDate.date
                              ? "nào khớp với tiêu chí lọc"
                              : ""}
                          </h5>
                        </div>
                      )}
                    {!isLoadingHistory &&
                      !errorHistory &&
                      processedHistoryList.length > 0 && (
                        <Table hover responsive className="mb-0 align-middle">
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
                            {processedHistoryList.map((record) => (
                              <tr key={record.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <Image
                                      src={
                                        record.book?.image
                                          ? `${API_BASE_URL}${record.book.image}`
                                          : "/book_placeholder.jpg"
                                      }
                                      alt={record.book?.title}
                                      width={40}
                                      height={60}
                                      style={{ objectFit: "cover" }}
                                      className="me-2 rounded shadow-sm"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/book_placeholder.jpg";
                                      }}
                                    />
                                    <div>
                                      <h6 className="mb-0 small">
                                        {record.book?.title || "N/A"}
                                      </h6>
                                      <p className="text-muted small mb-0">
                                        {record.book?.author?.name || "N/A"}
                                      </p>
                                      {record.book?.category &&
                                        record.book.category.length > 0 && (
                                          <Badge
                                            pill
                                            bg="light"
                                            text="dark"
                                            className="mt-1 me-1 small"
                                            key={record.id + "-catpill"}
                                          >
                                            {record.book.category
                                              .map((cat) => cat.name)
                                              .join(", ")}
                                          </Badge>
                                        )}
                                    </div>
                                  </div>
                                </td>
                                <td className="small">
                                  {record.user?.username ||
                                    record.user?.name ||
                                    "N/A"}
                                </td>
                                <td className="small">
                                  {record.borrow_date
                                    ? new Date(
                                        record.borrow_date
                                      ).toLocaleDateString()
                                    : "-"}
                                </td>
                                <td className="small">
                                  {record.exp_date
                                    ? new Date(
                                        record.exp_date
                                      ).toLocaleDateString()
                                    : "-"}
                                </td>
                                <td className="small">
                                  {record.return_date
                                    ? new Date(
                                        record.return_date
                                      ).toLocaleDateString()
                                    : "-"}
                                </td>
                                <td>{renderStatus(record.status)}</td>
                                <td>
                                  {record.status === "APPROVED" && (
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      className="me-1 mb-1"
                                      onClick={() =>
                                        handleConfirmBorrowing(record)
                                      }
                                      disabled={
                                        isUpdatingStatus === record.id ||
                                        (!!isUpdatingStatus &&
                                          isUpdatingStatus !== record.id)
                                      }
                                      title="Xác nhận cho mượn (cập nhật ngày mượn/trả)"
                                    >
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="me-1"
                                      />
                                      {isUpdatingStatus === record.id ? (
                                        <Spinner
                                          as="span"
                                          animation="border"
                                          size="sm"
                                        />
                                      ) : (
                                        "Cho mượn"
                                      )}
                                    </Button>
                                  )}
                                  {(record.status === "BORROWED" ||
                                    record.status === "OVERDUE") && (
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      className="me-1 mb-1"
                                      onClick={() => handleReturnBook(record)}
                                      disabled={
                                        isUpdatingStatus === record.id ||
                                        (!!isUpdatingStatus &&
                                          isUpdatingStatus !== record.id)
                                      }
                                      title="Xác nhận sách đã được trả"
                                    >
                                      <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="me-1"
                                      />
                                      {isUpdatingStatus === record.id ? (
                                        <Spinner
                                          as="span"
                                          animation="border"
                                          size="sm"
                                        />
                                      ) : (
                                        "Xác nhận trả"
                                      )}
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    className="mb-1"
                                    onClick={() => handleViewDetail(record.id)}
                                    disabled={!!isUpdatingStatus}
                                    title="Xem chi tiết phiếu mượn"
                                  >
                                    <FontAwesomeIcon icon={faEye} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                  </div>
                </Tab>

                {/* TAB YÊU CẦU */}
                <Tab
                  eventKey="requests"
                  title={
                    <span>
                      <FontAwesomeIcon icon={faBook} className="me-2" />
                      Yêu cầu ({processedRequestsList.length})
                    </span>
                  }
                >
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">Yêu cầu mượn sách</h4>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={fetchBorrowingRequests}
                        disabled={isLoadingRequests || !!isUpdatingStatus}
                      >
                        <FontAwesomeIcon
                          icon={faSync}
                          className={isLoadingRequests ? "fa-spin" : ""}
                        />{" "}
                        Tải lại
                      </Button>
                    </div>

                    <Card body className="mb-3 bg-light">
                      <Row className="g-2 align-items-end">
                        <Col md={6} lg={3}>
                          <Form.Group controlId="requestsFilterName">
                            <Form.Label className="small mb-1">
                              <FontAwesomeIcon
                                icon={faFilter}
                                className="me-1"
                              />{" "}
                              Lọc tên sách/người yêu cầu
                            </Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              placeholder="Nhập tên..."
                              value={requestsFilterText}
                              onChange={(e) =>
                                setRequestsFilterText(e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} lg={2}>
                          <Form.Group controlId="requestsFilterDateField">
                            <Form.Label className="small mb-1">
                              <FontAwesomeIcon
                                icon={faFilter}
                                className="me-1"
                              />{" "}
                              Lọc theo trường ngày
                            </Form.Label>
                            <Form.Select
                              size="sm"
                              value={requestsFilterDate.field}
                              onChange={(e) =>
                                setRequestsFilterDate((prev) => ({
                                  ...prev,
                                  field: e.target.value,
                                  date: e.target.value ? prev.date : "",
                                }))
                              }
                            >
                              <option value="">Chọn trường</option>
                              <option value="require_date">Ngày yêu cầu</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6} lg={2}>
                          <Form.Group controlId="requestsFilterDateValue">
                            <Form.Label className="small mb-1">
                              Chọn ngày
                            </Form.Label>
                            <Form.Control
                              type="date"
                              size="sm"
                              value={requestsFilterDate.date}
                              onChange={(e) =>
                                setRequestsFilterDate((prev) => ({
                                  ...prev,
                                  date: e.target.value,
                                }))
                              }
                              disabled={!requestsFilterDate.field}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} lg={2}>
                          <Form.Group controlId="requestsSortField">
                            <Form.Label className="small mb-1">
                              <FontAwesomeIcon icon={faSort} className="me-1" />{" "}
                              Sắp xếp
                            </Form.Label>
                            <Form.Select
                              size="sm"
                              value={requestsSortConfig.key || ""}
                              onChange={(e) =>
                                setRequestsSortConfig((prev) => ({
                                  ...prev,
                                  key: e.target.value || null,
                                }))
                              }
                            >
                              <option value="">Chọn trường</option>
                              <option value="book.title">Tên sách</option>
                              <option value="user.username">
                                Người yêu cầu
                              </option>
                              <option value="require_date">Ngày yêu cầu</option>
                              <option value="borrow_days">Số ngày mượn</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6} lg={2}>
                          <Form.Group controlId="requestsSortDirection">
                            <Form.Label className="small mb-1">
                              Thứ tự
                            </Form.Label>
                            <Form.Select
                              size="sm"
                              value={requestsSortConfig.direction}
                              onChange={(e) =>
                                setRequestsSortConfig((prev) => ({
                                  ...prev,
                                  direction: e.target.value,
                                }))
                              }
                              disabled={!requestsSortConfig.key}
                            >
                              <option value="asc">Tăng dần / Cũ nhất</option>
                              <option value="desc">Giảm dần / Mới nhất</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={12} lg={1} className="text-end">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              setRequestsFilterText("");
                              setRequestsFilterDate({ field: "", date: "" });
                              setRequestsSortConfig({
                                key: "require_date",
                                direction: "desc",
                              });
                            }}
                            title="Xóa bộ lọc & sắp xếp"
                          >
                            <FontAwesomeIcon icon={faEraser} />
                          </Button>
                        </Col>
                      </Row>
                    </Card>

                    {isLoadingRequests && (
                      <div className="text-center p-3">
                        <Spinner animation="border" />{" "}
                        <p>Đang tải yêu cầu...</p>
                      </div>
                    )}
                    {errorRequests && !isLoadingRequests && (
                      <Alert variant="danger" className="m-3">
                        {errorRequests}
                      </Alert>
                    )}
                    {!isLoadingRequests &&
                      !errorRequests &&
                      processedRequestsList.length === 0 && (
                        <div className="text-center py-5">
                          <FontAwesomeIcon
                            icon={faBook}
                            className="text-muted mb-3"
                            style={{ fontSize: "3rem" }}
                          />
                          <h5>
                            Không có yêu cầu mượn sách nào{" "}
                            {requestsFilterText || requestsFilterDate.date
                              ? "khớp với tiêu chí lọc"
                              : ""}
                          </h5>
                        </div>
                      )}
                    {!isLoadingRequests &&
                      !errorRequests &&
                      processedRequestsList.length > 0 && (
                        <Table hover responsive className="mb-0 align-middle">
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
                            {processedRequestsList.map((request) => (
                              <tr key={request.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <Image
                                      src={
                                        request.book?.image
                                          ? `${API_BASE_URL}${request.book.image}`
                                          : "/book_placeholder.jpg"
                                      }
                                      alt={request.book?.title}
                                      width={40}
                                      height={60}
                                      style={{ objectFit: "cover" }}
                                      className="me-2 rounded shadow-sm"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/book_placeholder.jpg";
                                      }}
                                    />
                                    <div>
                                      <h6 className="mb-0 small">
                                        {request.book?.title || "N/A"}
                                      </h6>
                                    </div>
                                  </div>
                                </td>
                                <td className="small">
                                  {request.user?.username ||
                                    request.user?.name ||
                                    "N/A"}
                                </td>
                                <td className="small">
                                  {request.require_date
                                    ? new Date(
                                        request.require_date
                                      ).toLocaleString()
                                    : "N/A"}
                                </td>
                                <td className="small">
                                  {request.borrow_days} ngày
                                </td>
                                <td>
                                  {request.status === "PENDING" && (
                                    <>
                                      <Button
                                        variant="outline-success"
                                        size="sm"
                                        className="me-1 mb-1"
                                        onClick={() =>
                                          handleApproveRequest(request)
                                        }
                                        disabled={
                                          isUpdatingStatus === request.id ||
                                          (!!isUpdatingStatus &&
                                            isUpdatingStatus !== request.id)
                                        }
                                        title="Duyệt yêu cầu"
                                      >
                                        <FontAwesomeIcon
                                          icon={faCheck}
                                          className="me-1"
                                        />
                                        {isUpdatingStatus === request.id ? (
                                          <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                          />
                                        ) : (
                                          "Duyệt"
                                        )}
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="me-1 mb-1"
                                        onClick={() =>
                                          handleRejectRequest(request)
                                        }
                                        disabled={
                                          isUpdatingStatus === request.id ||
                                          (!!isUpdatingStatus &&
                                            isUpdatingStatus !== request.id)
                                        }
                                        title="Từ chối yêu cầu"
                                      >
                                        <FontAwesomeIcon
                                          icon={faTimes}
                                          className="me-1"
                                        />
                                        {isUpdatingStatus === request.id ? (
                                          <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                          />
                                        ) : (
                                          "Từ chối"
                                        )}
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    className="mb-1"
                                    onClick={() =>
                                      handleViewRequestDetail(request.id)
                                    }
                                    disabled={!!isUpdatingStatus}
                                    title="Xem chi tiết yêu cầu"
                                  >
                                    <FontAwesomeIcon
                                      icon={faEye}
                                      className="me-1"
                                    />{" "}
                                    Xem
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
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
