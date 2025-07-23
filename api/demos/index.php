<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getDemos($db);
        break;
    case 'POST':
        createDemo($db);
        break;
    case 'PUT':
        updateDemo($db);
        break;
    case 'DELETE':
        deleteDemo($db);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getDemos($db) {
    try {
        $query = "SELECT d.*, l.name as lead_name, l.phone, l.email 
                  FROM demos d 
                  LEFT JOIN leads l ON d.lead_id = l.id 
                  ORDER BY d.created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $demos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendSuccess('Demos retrieved successfully', $demos);
    } catch(Exception $e) {
        sendError('Error retrieving demos: ' . $e->getMessage());
    }
}

function createDemo($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['lead_id']) || !isset($data['demo_type'])) {
        sendError('Lead ID and demo type are required');
    }
    
    try {
        $query = "INSERT INTO demos (lead_id, demo_type, start_date, end_date, status, remarks) 
                  VALUES (:lead_id, :demo_type, :start_date, :end_date, :status, :remarks)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':lead_id', $data['lead_id']);
        $stmt->bindParam(':demo_type', $data['demo_type']);
        $stmt->bindParam(':start_date', $data['start_date']);
        $stmt->bindParam(':end_date', $data['end_date']);
        $stmt->bindParam(':status', $data['status'] ?? 'Scheduled');
        $stmt->bindParam(':remarks', $data['remarks']);
        
        if ($stmt->execute()) {
            // Update lead status to Demo
            $updateLeadQuery = "UPDATE leads SET status = 'Demo' WHERE id = :lead_id";
            $updateStmt = $db->prepare($updateLeadQuery);
            $updateStmt->bindParam(':lead_id', $data['lead_id']);
            $updateStmt->execute();
            
            $demoId = $db->lastInsertId();
            sendSuccess('Demo created successfully', ['id' => $demoId]);
        } else {
            sendError('Failed to create demo');
        }
    } catch(Exception $e) {
        sendError('Error creating demo: ' . $e->getMessage());
    }
}

function updateDemo($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Demo ID is required');
    }
    
    try {
        $query = "UPDATE demos SET 
                  demo_type = :demo_type,
                  start_date = :start_date,
                  end_date = :end_date,
                  status = :status,
                  remarks = :remarks,
                  feedback = :feedback
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':demo_type', $data['demo_type']);
        $stmt->bindParam(':start_date', $data['start_date']);
        $stmt->bindParam(':end_date', $data['end_date']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':remarks', $data['remarks']);
        $stmt->bindParam(':feedback', $data['feedback']);
        
        if ($stmt->execute()) {
            sendSuccess('Demo updated successfully');
        } else {
            sendError('Failed to update demo');
        }
    } catch(Exception $e) {
        sendError('Error updating demo: ' . $e->getMessage());
    }
}

function deleteDemo($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Demo ID is required');
    }
    
    try {
        $query = "DELETE FROM demos WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        
        if ($stmt->execute()) {
            sendSuccess('Demo deleted successfully');
        } else {
            sendError('Failed to delete demo');
        }
    } catch(Exception $e) {
        sendError('Error deleting demo: ' . $e->getMessage());
    }
}
?>