// AdminStatistics.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const BASE_URL = import.meta.env.VITE_API_URL;

const AdminStatistics = () => {
    // States để lưu trữ dữ liệu từ API
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);
    const [monthlyBorrowReturnData, setMonthlyBorrowReturnData] = useState({ labels: [], datasets: [] });
    const [categoryDistributionData, setCategoryDistributionData] = useState({ labels: [], datasets: [] });
    const [userRegistrationTrendData, setUserRegistrationTrendData] = useState({ labels: [], datasets: [] });
    const [topBorrowedBooksData, setTopBorrowedBooksData] = useState({ labels: [], datasets: [] });

    // States cho trạng thái tải và lỗi
    const [loadingStats, setLoadingStats] = useState(true);
    const [errorStats, setErrorStats] = useState(null);

    // Dữ liệu tĩnh cho biểu đồ top sách (nếu không có API riêng)
    const topBooksData = {
        labels: ['Sách A', 'Sách B', 'Sách C', 'Sách D', 'Sách E'],
        datasets: [
            {
                label: 'Số lượt mượn',
                data: [45, 40, 35, 30, 28],
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Tùy chọn chung cho các biểu đồ
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    useEffect(() => {
        const fetchStatisticsData = async () => {
            setLoadingStats(true);
            setErrorStats(null);
            const token = sessionStorage.getItem(ACCESS_TOKEN);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            try {
                // Fetch Tổng số sách
                const totalBooksRes = await api.get(`${BASE_URL}/books/api/statistics/books/total`, { headers });
                setTotalBooks(totalBooksRes.data.total_books);

                // Fetch Tổng số người dùng
                const totalUsersRes = await api.get(`${BASE_URL}/users/api/statistics/users/total`, { headers });
                setTotalUsers(totalUsersRes.data.total_users);

                // Fetch Số lượng sách đang được mượn
                const borrowedBooksRes = await api.get(`${BASE_URL}/borrows/api/statistics/borrows/current`, { headers });
                setBorrowedBooksCount(borrowedBooksRes.data.borrowed_count);

                // Fetch Biến động Lượt Mượn & Trả sách theo tháng
                const monthlyStatsRes = await api.get(`${BASE_URL}/borrows/api/statistics/borrows/monthly`, { headers });
                const monthlyDataRaw = monthlyStatsRes.data;
                const processedMonthlyData = processMonthlyChartData(monthlyDataRaw);

                setMonthlyBorrowReturnData({
                    labels: processedMonthlyData.labels,
                    datasets: [
                        {
                            label: 'Số lượt mượn',
                            data: processedMonthlyData.borrowCounts,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Số lượt trả',
                            data: processedMonthlyData.returnCounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });

                // Fetch Phân loại sách theo thể loại
                const categoryStatsRes = await api.get(`${BASE_URL}/books/api/statistics/books/categories`, { headers });
                const categoryData = categoryStatsRes.data;

                const categoryLabels = categoryData.map(item => item.category_name);
                const categoryCounts = categoryData.map(item => item.book_count);
                const colors = [
                    'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)', 'rgba(83, 102, 255, 0.6)'
                ];

                setCategoryDistributionData({
                    labels: categoryLabels,
                    datasets: [
                        {
                            label: 'Số lượng sách',
                            data: categoryCounts,
                            backgroundColor: categoryLabels.map((_, i) => colors[i % colors.length]),
                            borderColor: categoryLabels.map((_, i) => colors[i % colors.length].replace('0.6', '1')),
                            borderWidth: 1,
                        },
                    ],
                });

                // Fetch Số lượng người dùng mới theo tháng
                const newUsersStatsRes = await api.get(`${BASE_URL}/users/api/statistics/users/monthly`, { headers });
                const newUsersData = newUsersStatsRes.data;

                const newUserLabels = newUsersData.map(item => item.month);
                const newUserCounts = newUsersData.map(item => item.new_users_count);

                setUserRegistrationTrendData({
                    labels: newUserLabels,
                    datasets: [
                        {
                            label: 'Người dùng mới',
                            data: newUserCounts,
                            fill: false,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            tension: 0.4,
                        },
                    ],
                });

                // FETCH DỮ LIỆU TOP 5 SÁCH ĐƯỢC MƯỢN NHIỀU NHẤT
                const topBooksRes = await api.get(`${BASE_URL}/borrows/api/statistics/books/top_borrowed`, { headers });
                const topBooksData = topBooksRes.data;

                const topBookLabels = topBooksData.map(item => item.book_title);
                const topBookCounts = topBooksData.map(item => Number(item.borrow_count));

                setTopBorrowedBooksData({
                    labels: topBookLabels,
                    datasets: [
                        {
                            label: 'Số lượt mượn',
                            data: topBookCounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });


            } catch (err) {
                setErrorStats("Không thể tải dữ liệu thống kê. Vui lòng kiểm tra kết nối API và quyền truy cập.");
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStatisticsData();
    }, []);

    // Hàm xử lý dữ liệu để điền vào các tháng thiếu và định dạng
    const processMonthlyChartData = (monthlyDataRaw) => {
        const monthNamesVietnamese = [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ];
        const numMonths = 6; // Hoặc 12 nếu bạn muốn 1 năm

        let currentMonth = new Date();
        currentMonth.setDate(1); // Đặt về ngày 1 để dễ thao tác tháng

        let dataMap = new Map();
        for (let i = 0; i < numMonths; i++) {
            const year = currentMonth.getFullYear();
            const monthIndex = currentMonth.getMonth(); // 0-11
            const formattedMonth = `${monthNamesVietnamese[monthIndex]} ${year}`;
            dataMap.set(formattedMonth, { borrow_count: 0, return_count: 0 });

            // Di chuyển về tháng trước
            currentMonth.setMonth(currentMonth.getMonth() - 1);
        }

        // Đảo ngược map để có thứ tự từ cũ nhất đến mới nhất
        let sortedDataMap = new Map([...dataMap.entries()].reverse());

        // Cập nhật dữ liệu từ API
        monthlyDataRaw.forEach(item => {
            // Định dạng tháng từ API là MM/YYYY (ví dụ: "05/2025")
            const [monthNum, yearNum] = item.month.split('/').map(Number);
            const monthIndex = monthNum - 1; // 0-11
            const formattedMonthKey = `${monthNamesVietnamese[monthIndex]} ${yearNum}`;

            if (sortedDataMap.has(formattedMonthKey)) {
                sortedDataMap.get(formattedMonthKey).borrow_count = Number(item.borrow_count);
                sortedDataMap.get(formattedMonthKey).return_count = Number(item.return_count);
            }
        });

        const labels = Array.from(sortedDataMap.keys());
        const borrowCounts = Array.from(sortedDataMap.values()).map(data => data.borrow_count);
        const returnCounts = Array.from(sortedDataMap.values()).map(data => data.return_count);

        return { labels, borrowCounts, returnCounts };
    };


    // Hiển thị loading spinner hoặc thông báo lỗi
    if (loadingStats) {
        return (
            <Container fluid className="mt-4 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Đang tải dữ liệu thống kê...</p>
            </Container>
        );
    }

    if (errorStats) {
        return (
            <Container fluid className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Lỗi tải dữ liệu</Alert.Heading>
                    <p>{errorStats}</p>
                    <p>Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4">
            <h2 className="mb-4">Thống kê Thư viện Tổng quan</h2>

            {/* Row cho các số liệu tổng quan */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Tổng số sách</Card.Title>
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                                <h1 className="display-4">{totalBooks}</h1>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Tổng số người dùng</Card.Title>
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                                <h1 className="display-4">{totalUsers}</h1>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <Card.Title>Sách đang được mượn</Card.Title>
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                                <h1 className="display-4">{borrowedBooksCount}</h1>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ số lượng mượn và trả theo tháng */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Biến động Lượt Mượn & Trả sách theo tháng</Card.Title>
                            <div style={{ height: '400px' }}>
                                <Bar options={{ ...options, plugins: { ...options.plugins, title: { display: false }}}} data={monthlyBorrowReturnData} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ phân loại sách và số lượng người dùng mới */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Phân loại sách theo thể loại</Card.Title>
                            <div style={{ height: '300px' }}>
                                <Pie data={categoryDistributionData} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Số lượng người dùng mới theo tháng</Card.Title>
                            <div style={{ height: '300px' }}>
                                <Line options={{ ...options, plugins: { ...options.plugins, title: { display: false }}}} data={userRegistrationTrendData} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ sách mượn nhiều nhất */}
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Top 5 Sách được Mượn Nhiều Nhất</Card.Title>
                            <div style={{ height: '300px' }}>
                                <Bar options={{
                                    ...options,
                                    indexAxis: 'y', // Đặt biểu đồ là cột ngang
                                    plugins: { ...options.plugins, title: { display: false }},
                                    scales: {
                                        x: { // Trục X bây giờ là trục số
                                            beginAtZero: true,
                                            // min: 0, // Đảm bảo bắt đầu từ 0
                                        },
                                        y: { // Trục Y bây giờ là trục danh mục
                                            grid: {
                                                display: false // Ẩn lưới trên trục danh mục để làm sạch biểu đồ
                                            }
                                        }
                                    }
                                }} data={topBorrowedBooksData} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminStatistics;