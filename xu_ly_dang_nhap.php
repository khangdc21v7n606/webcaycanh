<?php
session_start();
require 'db.php'; // Kết nối Database

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['loginUsername']);
    $password = $_POST['loginPassword'];

    // 1. Tìm xem tên đăng nhập này có trong Database không
    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    // Nếu tìm thấy tài khoản (số dòng > 0)
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc(); // Lấy thông tin của người dùng đó ra
        
        // 2. So sánh mật khẩu khách nhập với mật khẩu đã mã hóa trong DB
        if (password_verify($password, $row['password'])) {
            // Đăng nhập thành công -> Cấp thẻ Session và về trang chủ
            $_SESSION['currentUser'] = $username;
            header("Location: index.php");
            exit();
        } else {
            // Sai mật khẩu
            $_SESSION['loginError'] = "Mật khẩu không đúng!";
            header("Location: index.php");
            exit();
        }
    } else {
        // Không tìm thấy tài khoản
        $_SESSION['loginError'] = "Tài khoản không tồn tại!";
        header("Location: index.php");
        exit();
    }
} else {
    // Nếu truy cập trái phép, đuổi về trang chủ
    header("Location: index.php");
    exit();
}
?>