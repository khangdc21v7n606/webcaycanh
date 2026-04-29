<?php
session_start();
require 'db.php';

// Khai báo trả về dữ liệu dạng JSON cho file JS đọc được
header('Content-Type: application/json');

// Kiểm tra xem khách đã đăng nhập chưa
if (!isset($_SESSION['currentUser'])) {
    echo json_encode(['success' => false, 'message' => 'Bạn cần đăng nhập để thanh toán!']);
    exit;
}

// Lấy gói dữ liệu JSON do JavaScript gửi lên
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $username = $_SESSION['currentUser'];
    $fullname = $data['fullname'];
    $phone = $data['phone'];
    $address = $data['address'];
    $note = $data['note'];
    $payment = $data['payment'];
    $total_amount = $data['totalAmount'];
    $cart_items = $data['cartItems']; // Đây là một mảng chứa các chậu nho

    // Bật chế độ Transaction (Bảo vệ dữ liệu: Lỗi 1 bước là hủy toàn bộ, không lưu chắp vá)
    $conn->begin_transaction();

    try {
        // 1. Lưu vào bảng orders trước
        $sql_order = "INSERT INTO orders (username, fullname, phone, address, note, payment_method, total_amount) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql_order);
        $stmt->bind_param("ssssssi", $username, $fullname, $phone, $address, $note, $payment, $total_amount);
        $stmt->execute();

        // 2. Lấy cái id (mã đơn hàng) vừa mới được tự động tạo ra
        $order_id = $conn->insert_id;

        // 3. Vòng lặp: Lưu từng món hàng vào bảng order_details
        $sql_detail = "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
        $stmt_detail = $conn->prepare($sql_detail);

        foreach ($cart_items as $item) {
            // JS gửi lên có thể id nằm ở $item['id'], số lượng ở $item['quantity'], giá ở $item['price']
            $stmt_detail->bind_param("iiii", $order_id, $item['id'], $item['quantity'], $item['price']);
            $stmt_detail->execute();
        }

        // Nếu mọi thứ trót lọt, chốt lưu vào DB
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Đặt hàng thành công!']);

    } catch (Exception $e) {
        // Nếu có lỗi ở đâu đó, quay xe không lưu gì cả
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Lỗi hệ thống: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Không nhận được dữ liệu!']);
}
?>