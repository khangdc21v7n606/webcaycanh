<?php
session_start();
require 'db.php';

// Kiểm tra xem có dữ liệu POST gửi đến không
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['regUsername']);
    $email = trim($_POST['regEmail']);
    $password = $_POST['regPassword'];
    $confirmPassword = $_POST['regConfirmPassword'];

    // 1. Kiểm tra mật khẩu khớp không
    if ($password !== $confirmPassword) {
        $_SESSION['thongBao'] = "Mật khẩu không trùng khớp!";
        header("Location: DangKy.php"); // Bị lỗi -> Đá về lại trang đăng ký
        exit();
    } 
    
    // 2. Mã hóa mật khẩu
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // 3. Kiểm tra xem user hoặc email đã tồn tại chưa
    $check_sql = "SELECT * FROM users WHERE username = '$username' OR email = '$email'";
    $result = $conn->query($check_sql);

    if ($result->num_rows > 0) {
        $_SESSION['thongBao'] = "Tên đăng nhập hoặc Email đã được sử dụng!";
        header("Location: DangKy.php"); // Bị lỗi -> Đá về lại trang đăng ký
        exit();
    } 
    
    // 4. Lưu vào Database
    $insert_sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed_password')";
    if ($conn->query($insert_sql) === TRUE) {
        // Đăng ký thành công -> Đăng nhập luôn và chuyển về trang chủ
        $_SESSION['currentUser'] = $username;
        header("Location: index.php");
        exit();
    } else {
        $_SESSION['thongBao'] = "Lỗi hệ thống: " . $conn->error;
        header("Location: DangKy.php");
        exit();
    }
} else {
    // Nếu ai đó cố tình gõ link xu_ly_dang_ky.php lên trình duyệt, đuổi họ về trang chủ
    header("Location: index.php");
    exit();
}
?>