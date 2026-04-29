<?php
session_start();
require 'db.php';

// 1. CÔNG TẮC QUAN TRỌNG: Ép PHP phải báo lỗi nếu SQL sai, không được giấu!
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

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
    $cart_items = $data['cartItems'];

    // Bật chế độ Transaction 
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
            // Chuyển đổi dữ liệu cho chắc chắn không bị sai kiểu (int)
            $prod_id = (int)$item['id'];
            $qty = (int)$item['quantity'];
            $price = (int)$item['price'];
            
            $stmt_detail->bind_param("iiii", $order_id, $prod_id, $qty, $price);
            $stmt_detail->execute();
        }

        // Chốt lưu vào DB
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Đặt hàng thành công!']);

    } catch (Exception $e) {
        // Hủy lưu nếu có lỗi và BÁO LỖI THẬT RA MÀN HÌNH
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'LỖI SQL: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Không nhận được dữ liệu!']);
}
?>