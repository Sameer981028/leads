<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getPayments($db);
        break;
    case 'POST':
        createPayment($db);
        break;
    case 'PUT':
        updatePayment($db);
        break;
    case 'DELETE':
        deletePayment($db);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getPayments($db) {
    try {
        $query = "SELECT p.*, l.name as lead_name, l.phone, l.email 
                  FROM payments p 
                  LEFT JOIN leads l ON p.lead_id = l.id 
                  ORDER BY p.created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendSuccess('Payments retrieved successfully', $payments);
    } catch(Exception $e) {
        sendError('Error retrieving payments: ' . $e->getMessage());
    }
}

function createPayment($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['lead_id']) || !isset($data['amount'])) {
        sendError('Lead ID and amount are required');
    }
    
    try {
        $query = "INSERT INTO payments (lead_id, amount, payment_date, status, method, invoice_id) 
                  VALUES (:lead_id, :amount, :payment_date, :status, :method, :invoice_id)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':lead_id', $data['lead_id']);
        $stmt->bindParam(':amount', $data['amount']);
        $stmt->bindParam(':payment_date', $data['payment_date']);
        $stmt->bindParam(':status', $data['status'] ?? 'Paid');
        $stmt->bindParam(':method', $data['method']);
        $stmt->bindParam(':invoice_id', $data['invoice_id']);
        
        if ($stmt->execute()) {
            // Update lead status to Paid if payment is successful
            if ($data['status'] === 'Paid') {
                $updateLeadQuery = "UPDATE leads SET status = 'Paid' WHERE id = :lead_id";
                $updateStmt = $db->prepare($updateLeadQuery);
                $updateStmt->bindParam(':lead_id', $data['lead_id']);
                $updateStmt->execute();
            }
            
            $paymentId = $db->lastInsertId();
            sendSuccess('Payment created successfully', ['id' => $paymentId]);
        } else {
            sendError('Failed to create payment');
        }
    } catch(Exception $e) {
        sendError('Error creating payment: ' . $e->getMessage());
    }
}

function updatePayment($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Payment ID is required');
    }
    
    try {
        $query = "UPDATE payments SET 
                  amount = :amount,
                  payment_date = :payment_date,
                  status = :status,
                  method = :method,
                  invoice_id = :invoice_id
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':amount', $data['amount']);
        $stmt->bindParam(':payment_date', $data['payment_date']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':method', $data['method']);
        $stmt->bindParam(':invoice_id', $data['invoice_id']);
        
        if ($stmt->execute()) {
            sendSuccess('Payment updated successfully');
        } else {
            sendError('Failed to update payment');
        }
    } catch(Exception $e) {
        sendError('Error updating payment: ' . $e->getMessage());
    }
}

function deletePayment($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Payment ID is required');
    }
    
    try {
        $query = "DELETE FROM payments WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        
        if ($stmt->execute()) {
            sendSuccess('Payment deleted successfully');
        } else {
            sendError('Failed to delete payment');
        }
    } catch(Exception $e) {
        sendError('Error deleting payment: ' . $e->getMessage());
    }
}
?>