<?php
// Cấu hình thông tin kết nối Database
$host = "localhost";      // Máy chủ cục bộ của XAMPP
$username = "root";       // Tên đăng nhập mặc định của XAMPP
$password = "";           // Mật khẩu mặc định của XAMPP là rỗng
$database = "vuonnhost_db"; // Tên database bạn vừa tạo ở Bước 2

// Tạo kết nối bằng MySQLi
$conn = new mysqli($host, $username, $password, $database);

// Đặt charset utf8 để không bị lỗi font tiếng Việt
$conn->set_charset("utf8mb4");

// Kiểm tra xem kết nối có thành công không
if ($conn->connect_error) {
    die("Kết nối Database thất bại: " . $conn->connect_error);
}
?>