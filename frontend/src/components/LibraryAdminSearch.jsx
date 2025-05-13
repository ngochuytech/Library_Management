import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
  Button,
  Dropdown,
  Table,
  Pagination,
  Form,
  Image,
  ButtonGroup,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

const dummyBooks = [
  {
    id: 1,
    image: "/book.jpg",
    title: "Don't Make Me Think",
    author: "Steve Krug",
    status: "Còn sách",
  },
  {
    id: 2,
    image: "/book.jpg",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    status: "Đã mượn",
  },
];
const dummyUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    code: "U001",
    email: "a@example.com",
    borrowed: 2,
  },
  {
    id: 2,
    name: "Trần Thị B",
    code: "U002",
    email: "b@example.com",
    borrowed: 0,
  },
];
const dummyBorrows = [
  {
    id: 1,
    code: "BR001",
    user: "Nguyễn Văn A",
    book: "Don't Make Me Think",
    status: "Đang mượn",
  },
  {
    id: 2,
    code: "BR002",
    user: "Trần Thị B",
    book: "The Design of Everyday Things",
    status: "Đã trả",
  },
];

const LibraryAdminSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [bookStatus, setBookStatus] = useState("");
  const [results, setResults] = useState([]);

  // Dummy search handler
  const handleSearch = (e) => {
    e.preventDefault();
    let data = [];
    if (type === "all" || type === "book") {
      data = dummyBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(keyword.toLowerCase()) ||
          b.author.toLowerCase().includes(keyword.toLowerCase())
      );
      if (bookStatus) {
        data = data.filter((b) => b.status === bookStatus);
      }
    } else if (type === "user") {
      data = dummyUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(keyword.toLowerCase()) ||
          u.code.toLowerCase().includes(keyword.toLowerCase()) ||
          u.email.toLowerCase().includes(keyword.toLowerCase())
      );
    } else if (type === "borrow") {
      data = dummyBorrows.filter(
        (br) =>
          br.code.toLowerCase().includes(keyword.toLowerCase()) ||
          br.user.toLowerCase().includes(keyword.toLowerCase()) ||
          br.book.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    setResults(data);
    setPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(results.length / rowsPerPage);
  const pagedResults = results.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Render table columns by type
  const renderTable = () => {
    if (type === "all" || type === "book") {
      return (
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh bìa</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pagedResults.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Không có kết quả
                </td>
              </tr>
            ) : (
              pagedResults.map((b, idx) => (
                <tr key={b.id}>
                  <td>{(page - 1) * rowsPerPage + idx + 1}</td>
                  <td>
                    <Image src={b.image} width={40} rounded />
                  </td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>
                    <span
                      className={
                        b.status === "Còn sách" ? "text-success" : "text-danger"
                      }
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <ButtonGroup size="sm">
                      <Button variant="info">Xem</Button>
                      <Button variant="primary">Sửa</Button>
                      <Button variant="danger">Xóa</Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      );
    } else if (type === "user") {
      return (
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên người dùng</th>
              <th>Mã người dùng</th>
              <th>Email</th>
              <th>Số sách đang mượn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pagedResults.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Không có kết quả
                </td>
              </tr>
            ) : (
              pagedResults.map((u, idx) => (
                <tr key={u.id}>
                  <td>{(page - 1) * rowsPerPage + idx + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.code}</td>
                  <td>{u.email}</td>
                  <td>{u.borrowed}</td>
                  <td>
                    <ButtonGroup size="sm">
                      <Button variant="info">Xem</Button>
                      <Button variant="primary">Sửa</Button>
                      <Button variant="danger">Xóa</Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      );
    } else if (type === "borrow") {
      return (
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã phiếu</th>
              <th>Tên người mượn</th>
              <th>Tên sách</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pagedResults.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Không có kết quả
                </td>
              </tr>
            ) : (
              pagedResults.map((br, idx) => (
                <tr key={br.id}>
                  <td>{(page - 1) * rowsPerPage + idx + 1}</td>
                  <td>{br.code}</td>
                  <td>{br.user}</td>
                  <td>{br.book}</td>
                  <td>{br.status}</td>
                  <td>
                    <ButtonGroup size="sm">
                      <Button variant="info">Xem</Button>
                      <Button variant="primary">Sửa</Button>
                      <Button variant="danger">Xóa</Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      );
    }
    return null;
  };

  // Advanced filter for books
  const renderAdvancedFilter = () => {
    if (type === "book" || type === "all") {
      return (
        <Form.Group
          as={Row}
          className="mb-2 align-items-center justify-content-end"
        >
          <Form.Label column sm={3} className="mb-0 text-end fw-semibold">
            Trạng thái
          </Form.Label>
          <Col sm={6}>
            <Form.Select
              value={bookStatus}
              onChange={(e) => setBookStatus(e.target.value)}
              size="sm"
            >
              <option value="">Tất cả</option>
              <option value="Còn sách">Còn sách</option>
              <option value="Đã mượn">Đã mượn</option>
            </Form.Select>
          </Col>
        </Form.Group>
      );
    }
    return null;
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom-0">
              <h4 className="mb-0">Tìm kiếm</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch} className="mb-3">
                <Row className="align-items-center g-2">
                  <Col md={5}>
                    <InputGroup>
                      <FormControl
                        placeholder="Nhập từ khóa..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        size="lg"
                      />
                      <Button variant="primary" type="submit">
                        <Search />
                      </Button>
                    </InputGroup>
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      size="lg"
                    >
                      <option value="all">Tất cả</option>
                      <option value="book">Sách</option>
                      <option value="user">Người dùng</option>
                      <option value="borrow">Lượt mượn/trả</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>{renderAdvancedFilter()}</Col>
                </Row>
              </Form>
              {renderTable()}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                    />
                    <Pagination.Prev
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    />
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === page}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LibraryAdminSearch;
