<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getIntegrations($db);
        break;
    case 'POST':
        createIntegration($db);
        break;
    case 'PUT':
        updateIntegration($db);
        break;
    case 'DELETE':
        deleteIntegration($db);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getIntegrations($db) {
    try {
        $query = "SELECT i.*, l.name as lead_name, l.phone, l.email 
                  FROM integrations i 
                  LEFT JOIN leads l ON i.lead_id = l.id 
                  ORDER BY i.created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $integrations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendSuccess('Integrations retrieved successfully', $integrations);
    } catch(Exception $e) {
        sendError('Error retrieving integrations: ' . $e->getMessage());
    }
}

function createIntegration($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['lead_id'])) {
        sendError('Lead ID is required');
    }
    
    try {
        $query = "INSERT INTO integrations (lead_id, integration_status, start_date, end_date, feedback) 
                  VALUES (:lead_id, :integration_status, :start_date, :end_date, :feedback)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':lead_id', $data['lead_id']);
        $stmt->bindParam(':integration_status', $data['integration_status'] ?? 'Started');
        $stmt->bindParam(':start_date', $data['start_date']);
        $stmt->bindParam(':end_date', $data['end_date']);
        $stmt->bindParam(':feedback', $data['feedback']);
        
        if ($stmt->execute()) {
            // Update lead status to Integrated
            $updateLeadQuery = "UPDATE leads SET status = 'Integrated' WHERE id = :lead_id";
            $updateStmt = $db->prepare($updateLeadQuery);
            $updateStmt->bindParam(':lead_id', $data['lead_id']);
            $updateStmt->execute();
            
            $integrationId = $db->lastInsertId();
            sendSuccess('Integration created successfully', ['id' => $integrationId]);
        } else {
            sendError('Failed to create integration');
        }
    } catch(Exception $e) {
        sendError('Error creating integration: ' . $e->getMessage());
    }
}

function updateIntegration($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Integration ID is required');
    }
    
    try {
        $query = "UPDATE integrations SET 
                  integration_status = :integration_status,
                  start_date = :start_date,
                  end_date = :end_date,
                  feedback = :feedback
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':integration_status', $data['integration_status']);
        $stmt->bindParam(':start_date', $data['start_date']);
        $stmt->bindParam(':end_date', $data['end_date']);
        $stmt->bindParam(':feedback', $data['feedback']);
        
        if ($stmt->execute()) {
            sendSuccess('Integration updated successfully');
        } else {
            sendError('Failed to update integration');
        }
    } catch(Exception $e) {
        sendError('Error updating integration: ' . $e->getMessage());
    }
}

function deleteIntegration($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Integration ID is required');
    }
    
    try {
        $query = "DELETE FROM integrations WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        
        if ($stmt->execute()) {
            sendSuccess('Integration deleted successfully');
        } else {
            sendError('Failed to delete integration');
        }
    } catch(Exception $e) {
        sendError('Error deleting integration: ' . $e->getMessage());
    }
}
?>