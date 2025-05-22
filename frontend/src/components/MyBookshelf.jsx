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
  faInfoCircle, // Vẫn giữ icon này phòng trường hợp cần dùng cho mục đích khác
  faHourglassHalf,
  faCheckCircle,
  faQuestionCircle,
  faTimesCircle, // Icon cho hủy hoặc hết hạn
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_URL;

const PersonalLibrary = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDays, setFilterDays] = useState("all");

  // Define fetchBorrows outside useEffect using useCallback
  const fetchBorrows = React.useCallback(async () => {
    try {
      setLoading(true);
      const id = userId || sessionStorage.getItem("idUser");
      if (!id) {
        throw new Error("Không tìm thấy User ID người dùng.");
      }

      const token = sessionStorage.getItem("access_token");
      if (!token) {
        throw new Error("Yêu cầu xác thực tài khoản.");
      }

      const response = await axios.get(`${BASE_URL}/borrows/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawData = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];
      const processedData = rawData.map((borrow) => {
        const expDate = borrow.exp_date ? new Date(borrow.exp_date) : null;
        let itemIsOverdue = false;
        if (
          expDate &&
          (String(borrow.status).toLowerCase() === "approved" ||
            String(borrow.status).toLowerCase() === "borrowed")
        ) {
          const endOfExpDate = new Date(expDate);
          endOfExpDate.setHours(23, 59, 59, 999);
          const currentDate = new Date();
          if (currentDate > endOfExpDate) {
            itemIsOverdue = true;
          }
        }
        return {
          ...borrow,
          remainingDays: calculateRemainingDays(borrow.exp_date, borrow.status),
          isOverdue: itemIsOverdue,
        };
      });
      setBorrows(processedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách mượn sách:", error);
      toast.error(
        error.response?.data?.detail ||
          error.message ||
          "Không tải được lịch sử mượn sách."
      );
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const calculateRemainingDays = (expDateStr, borrowStatus) => {
    const statusLower = String(borrowStatus).toLowerCase();
    if (!["borrowed", "approved"].includes(statusLower) || !expDateStr) {
      return null;
    }
    const now = new Date();
    const expDate = new Date(expDateStr);
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfExpDate = new Date(
      expDate.getFullYear(),
      expDate.getMonth(),
      expDate.getDate()
    );

    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((startOfExpDate - startOfToday) / msPerDay);
  };

  const handleActionClick = (borrow, action) => {
    console.log(
      `Action "${action}" for borrow ID: ${borrow.id}, Book: ${borrow.book?.title}`
    );
    // Implement actual logic for actions here, e.g., API calls
    if (action === "Hủy YC" && borrow.status === "PENDING") {
      // Example: show confirmation modal then call API
      axios
        .post(
          `${BASE_URL}/borrows/api/cancel/${borrow.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            },
          }
        )
        .then(() => {
          fetchBorrows();
          toast.success("Yêu cầu đã được hủy.");
        })
        .catch(() => {
          toast.error("Không thể hủy yêu cầu.");
        });
      toast.info(`Đang xử lý hủy yêu cầu cho sách "${borrow.book?.title}"...`);
    } else {
      toast.info(
        `Chức năng "${action}" cho sách "${borrow.book?.title}" đang được phát triển.`
      );
    }
  };

  const getBookStatusBadge = (bookStatus) => {
    let variant = "light";
    let label = bookStatus;
    let textColor = "dark";

    if (!bookStatus) return null;
    const statusNormalized = String(bookStatus).toUpperCase();

    switch (statusNormalized) {
      case "PENDING":
        variant = "warning";
        label = "Chờ duyệt sách";
        textColor = "dark";
        break;
      case "APPROVED":
        variant = "success";
        label = "Sách sẵn có";
        textColor = "white";
        break;
      case "CANCELED":
        variant = "secondary";
        label = "Yêu cầu bị hủy";
        textColor = "white";
        break;
      default:
        label = bookStatus;
        textColor = "dark";
        break;
    }
    return (
      <Badge pill bg={variant} text={textColor} className="ms-1">
        {label}
      </Badge>
    );
  };

  const getBorrowTransactionStatusBadge = (borrowStatus, isOverdue) => {
    let variant = "secondary";
    let label = borrowStatus;
    let icon = faQuestionCircle;

    const statusLower = String(borrowStatus).toLowerCase();

    if (
      isOverdue &&
      (statusLower === "borrowed" || statusLower === "approved")
    ) {
      variant = "danger";
      label = "Quá hạn";
      icon = faExclamationTriangle;
    } else {
      switch (statusLower) {
        case "borrowed":
          variant = "primary";
          label = "Đang mượn";
          icon = faBookOpen;
          break;
        case "pending":
          variant = "info";
          label = "Chờ xử lý YC";
          icon = faHourglassHalf;
          break;
        case "returned":
          variant = "success";
          label = "Đã trả";
          icon = faUndo;
          break;
        case "canceled":
          variant = "secondary";
          label = "Đã hủy YC";
          icon = faTimesCircle;
          break;
        case "approved_return":
          variant = "success";
          label = "Đã duyệt trả";
          icon = faCheckCircle;
          break;
        case "approved":
          variant = "info";
          label = "Đã duyệt YC";
          icon = faCheckCircle;
          break;
        default:
          label = borrowStatus || "Không rõ";
          variant = "dark";
          break;
      }
    }
    return (
      <Badge
        pill
        bg={variant}
        text={variant === "light" || variant === "info" ? "dark" : "white"}
        className="px-2 py-1"
      >
        <FontAwesomeIcon icon={icon} className="me-1" />
        {label}
      </Badge>
    );
  };

  /**
   * Xác định và trả về component Button cho hành động tương ứng với trạng thái mượn sách.
   * Sẽ trả về null nếu không có hành động nào phù hợp hoặc nếu hành động là "Chi tiết".
   */
  const getActionButton = (borrow) => {
    const statusLower = String(borrow.status).toLowerCase();
    // Cấu hình mặc định, trước đây là "Chi tiết"
    // Bây giờ, chúng ta sẽ không đặt mặc định là "Chi tiết" nữa,
    // mà sẽ để logic quyết định. Nếu không có nút nào phù hợp, sẽ trả về null.
    let config = null;

    if (statusLower === "approved_return") {
      return null; // Không có action button cho trạng thái này
    }

    if (statusLower === "pending") {
      config = {
        label: "Hủy YC",
        variant: "outline-danger",
        icon: faHandPointer,
        disabled: false,
      };
    } else if (borrow.isOverdue) {
      if (statusLower === "borrowed") {
        
      } else if (statusLower === "approved") {
        config = {
          label: "YC hết hạn",
          variant: "outline-danger",
          icon: faTimesCircle,
          disabled: true,
        };
      }
      // Các trường hợp isOverdue khác sẽ không có nút nếu không được định nghĩa ở trên (config vẫn là null)
    }

    // Nếu sau tất cả các điều kiện, không có config nào được đặt, hoặc config là "Chi tiết" (dù đã loại bỏ), trả về null
    if (!config || config.label === "Chi tiết") {
      return null;
    }

    return (
      <Button
        variant={config.variant}
        size="sm"
        className="w-100 mt-2"
        onClick={() => handleActionClick(borrow, config.label)}
        disabled={config.disabled}
      >
        <FontAwesomeIcon icon={config.icon} className="me-2" />
        {config.label}
      </Button>
    );
  };

  const calculateDueProgress = (
    expDateStr,
    borrowStatus,
    actualBorrowDateStr
  ) => {
    const statusLower = String(borrowStatus).toLowerCase();
    if (!["borrowed", "approved"].includes(statusLower) || !expDateStr)
      return 0;

    const now = new Date();
    const due = new Date(expDateStr);
    const start = actualBorrowDateStr
      ? new Date(actualBorrowDateStr)
      : new Date(due.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (isNaN(start.getTime()) || isNaN(due.getTime()) || start >= due)
      return 0;
    if (now >= due) return 100;
    if (now < start) return 0;

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
    const statusLower = currentStatus.toLowerCase();

    if (activeTab === "all") {
      tabMatch = true;
    } else if (activeTab === "current") {
      if (
        (statusLower === "approved" || statusLower === "borrowed") &&
        !borrow.isOverdue
      ) {
        tabMatch = true;
      }
    } else if (activeTab === "overdue") {
      if (
        (statusLower === "approved" || statusLower === "borrowed") &&
        borrow.isOverdue
      )
        tabMatch = true;
    } else if (activeTab === "waiting") {
      if (statusLower === "pending") tabMatch = true;
    } else if (activeTab === "history") {
      if (["returned", "canceled", "approved_return"].includes(statusLower))
        tabMatch = true;
    }
    if (!tabMatch) return false;

    const isBorrowingOrApproved =
      statusLower === "approved" || statusLower === "borrowed";

    if (filterDays !== "all") {
      if (filterDays === "0") {
        if (
          !(
            isBorrowingOrApproved &&
            (borrow.isOverdue || borrow.remainingDays === 0)
          )
        )
          return false;
      } else if (
        isBorrowingOrApproved &&
        !borrow.isOverdue &&
        borrow.remainingDays !== null
      ) {
        if (filterDays === "7") {
          if (!(borrow.remainingDays >= 7)) return false;
        } else if (filterDays === "3") {
          if (!(borrow.remainingDays >= 3 && borrow.remainingDays < 7))
            return false;
        }
      } else if (filterDays !== "0") {
        return false;
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
          <InputGroup style={{ width: "280px" }}>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
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
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <Nav variant="tabs" className="flex-grow-1 mb-2 mb-md-0">
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
                {
                  borrows.filter(
                    (b) =>
                      (String(b.status).toLowerCase() === "approved" ||
                        String(b.status).toLowerCase() === "borrowed") &&
                      !b.isOverdue
                  ).length
                }
                )
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="overdue">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="me-1 text-danger"
                />
                Quá hạn (
                {
                  borrows.filter(
                    (b) =>
                      (String(b.status).toLowerCase() === "approved" ||
                        String(b.status).toLowerCase() === "borrowed") &&
                      b.isOverdue
                  ).length
                }
                )
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="waiting">
                <FontAwesomeIcon
                  icon={faHourglassHalf}
                  className="me-1 text-info"
                />
                Chờ xử lý (
                {
                  borrows.filter(
                    (b) => String(b.status).toLowerCase() === "pending"
                  ).length
                }
                )
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="history">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                Lịch sử (
                {
                  borrows.filter((b) =>
                    ["returned", "canceled", "approved_return"].includes(
                      String(b.status).toLowerCase()
                    )
                  ).length
                }
                )
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Form.Select
            size="sm"
            style={{ width: "240px" }}
            className="ms-md-3"
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
            aria-label="Lọc theo thời hạn"
          >
            <option value="all">Tất cả thời hạn</option>
            <option value="7">Còn &gt;= 7 ngày</option>
            <option value="3">Còn 3 đến &lt;7 ngày</option>
            <option value="0">Quá hạn / Hết hạn hôm nay</option>
          </Form.Select>
        </div>
      </Tab.Container>

      {filteredBorrows.length === 0 ? (
        <Alert variant="info" className="text-center mt-4 py-4">
          <FontAwesomeIcon
            icon={faBookOpen}
            size="3x"
            className="mb-3 text-muted"
          />
          <h4>Không có sách nào phù hợp</h4>
          <p className="mb-0">
            Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
          </p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4 mt-0">
          {filteredBorrows.map((borrow) => {
            const statusLower = String(borrow.status).toLowerCase();
            const isActivelyBorrowed = statusLower === "borrowed";
            const isApprovedForPickup = statusLower === "approved";

            const isConsideredActive =
              isActivelyBorrowed || isApprovedForPickup;
            const isOverdueForDisplay = isConsideredActive && borrow.isOverdue;

            const startDateForProgress =
              borrow.borrow_date ||
              (isApprovedForPickup ? borrow.require_date : null);
            const dueProgress = calculateDueProgress(
              borrow.exp_date,
              borrow.status,
              startDateForProgress
            );
            const remainingDaysDisplay = borrow.remainingDays;

            return (
              <Col key={borrow.id || borrow.book_id}>
                <Card
                  className={`h-100 shadow-sm border-0 overflow-hidden ${
                    isOverdueForDisplay ? "border-2 border-danger" : ""
                  }`}
                >
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={
                        (borrow.book?.image &&
                        borrow.book.image.startsWith("http")
                          ? borrow.book.image
                          : `/image/${borrow.book?.image}`) ||
                        "https://via.placeholder.com/300x200?text=S%C3%A1ch"
                      }
                      alt={borrow.book?.title || "Không có tiêu đề"}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        filter: isOverdueForDisplay ? "sepia(20%)" : "none",
                      }}
                    />
                    {isOverdueForDisplay && (
                      <div className="position-absolute top-0 start-0 m-2">
                        <Badge pill bg="danger" className="px-2 py-1 fs-small">
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="me-1"
                          />
                          QUÁ HẠN
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column p-3">
                    <Card.Title
                      className="h6 mb-1 flex-grow-0 text-truncate"
                      title={borrow.book?.title || "Không có tiêu đề"}
                    >
                      {borrow.book?.title || "Không có tiêu đề"}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted small">
                      {borrow.book?.author?.name || "Tác giả không xác định"}
                    </Card.Subtitle>

                    <div className="mb-2">
                      {getBorrowTransactionStatusBadge(
                        borrow.status,
                        borrow.isOverdue
                      )}
                    </div>

                    {borrow.book?.category?.length > 0 && (
                      <div className="small text-muted mb-1">
                        <FontAwesomeIcon
                          icon={faTags}
                          className="me-1 text-secondary"
                        />
                        {borrow.book.category.map((cat) => cat.name).join(", ")}
                      </div>
                    )}
                    {borrow.book?.status &&
                      !["APPROVED", "AVAILABLE", ""].includes(
                        String(borrow.book.status).toUpperCase()
                      ) && (
                        <div className="small text-muted mb-2">
                          <FontAwesomeIcon
                            icon={faBook}
                            className="me-1 text-secondary"
                          />
                          Tình trạng sách:{" "}
                          {getBookStatusBadge(borrow.book.status)}
                        </div>
                      )}

                    <div className="small text-muted mt-1 mb-2">
                      {borrow.require_date && (
                        <div>
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="me-1"
                          />
                          Ngày YC:{" "}
                          {new Date(borrow.require_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      )}
                      {isActivelyBorrowed && borrow.borrow_date && (
                        <div>
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="me-1 text-success"
                          />
                          Mượn từ:{" "}
                          {new Date(borrow.borrow_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      )}
                      {isConsideredActive && borrow.exp_date && (
                        <div>
                          <FontAwesomeIcon
                            icon={faClock}
                            className={`me-1 ${
                              isOverdueForDisplay
                                ? "text-danger"
                                : "text-secondary"
                            }`}
                          />
                          Hạn trả/lấy:{" "}
                          {new Date(borrow.exp_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      )}
                      {borrow.return_date &&
                        ["returned", "approved_return"].includes(
                          statusLower
                        ) && (
                          <div>
                            <FontAwesomeIcon
                              icon={faUndo}
                              className="me-1 text-success"
                            />
                            Đã trả:{" "}
                            {new Date(borrow.return_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        )}
                    </div>

                    <div className="mt-auto pt-2">
                      {isConsideredActive &&
                        !isOverdueForDisplay &&
                        borrow.exp_date && (
                          <>
                            <div className="d-flex justify-content-between small mb-1">
                              <span>Thời hạn:</span>
                              <span
                                className={
                                  remainingDaysDisplay !== null &&
                                  remainingDaysDisplay < 3
                                    ? "text-warning fw-bold"
                                    : ""
                                }
                              >
                                {remainingDaysDisplay !== null
                                  ? remainingDaysDisplay >= 0
                                    ? `${remainingDaysDisplay} ngày còn lại${
                                        remainingDaysDisplay === 0
                                          ? " (Hôm nay)"
                                          : ""
                                      }`
                                    : `Quá ${Math.abs(
                                        remainingDaysDisplay
                                      )} ngày`
                                  : "N/A"}
                              </span>
                            </div>
                            <ProgressBar
                              variant={
                                remainingDaysDisplay !== null &&
                                remainingDaysDisplay < 1
                                  ? "danger"
                                  : remainingDaysDisplay !== null &&
                                    remainingDaysDisplay < 3
                                  ? "warning"
                                  : "success"
                              }
                              now={dueProgress}
                              className="mb-2"
                              style={{ height: "6px" }}
                            />
                          </>
                        )}
                      {isOverdueForDisplay && (
                        <Alert
                          variant="danger"
                          className="p-2 small text-center mb-2"
                        >
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="me-1"
                          />
                          {statusLower === "approved"
                            ? "Quá hạn lấy sách!"
                            : `Đã quá hạn ${
                                remainingDaysDisplay !== null
                                  ? Math.abs(remainingDaysDisplay)
                                  : ""
                              } ngày!`}
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
