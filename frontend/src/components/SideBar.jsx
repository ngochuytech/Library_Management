import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faBook,
  faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div
      className={`sidebar expanded`}
      style={{ position: "fixed", marginTop: "15px" }}
    >
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link href="#" className="nav-item-custom">
            <FontAwesomeIcon icon={faHome} className="icon" />
            <span className="nav-text">Trang chủ</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="nav-item-custom">
            <FontAwesomeIcon icon={faSearch} className="icon" />
            <span className="nav-text">Tìm kiếm</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="nav-item-custom">
            <FontAwesomeIcon icon={faBook} className="icon" />
            <span className="nav-text">Giá sách của tôi</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="nav-item-custom">
            <FontAwesomeIcon icon={faHandHoldingHeart} className="icon" />
            <span className="nav-text">Đóng góp</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
