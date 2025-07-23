<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getLeads($db);
        break;
    case 'POST':
        createLead($db);
        break;
    case 'PUT':
        updateLead($db);
        break;
    case 'DELETE':
        deleteLead($db);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getLeads($db) {
    try {
        $query = "SELECT * FROM leads ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendSuccess('Leads retrieved successfully', $leads);
    } catch(Exception $e) {
        sendError('Error retrieving leads: ' . $e->getMessage());
    }
}

function createLead($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['name']) || !isset($data['phone'])) {
        sendError('Name and phone are required');
    }
    
    try {
        $query = "INSERT INTO leads (name, email, phone, source, campaign, status, remarks) 
                  VALUES (:name, :email, :phone, :source, :campaign, :status, :remarks)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':source', $data['source']);
        $stmt->bindParam(':campaign', $data['campaign']);
        $stmt->bindParam(':status', $data['status'] ?? 'New');
        $stmt->bindParam(':remarks', $data['remarks']);
        
        if ($stmt->execute()) {
            $leadId = $db->lastInsertId();
            sendSuccess('Lead created successfully', ['id' => $leadId]);
        } else {
            sendError('Failed to create lead');
        }
    } catch(Exception $e) {
        sendError('Error creating lead: ' . $e->getMessage());
    }
}

function updateLead($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Lead ID is required');
    }
    
    try {
        $query = "UPDATE leads SET 
                  name = :name,
                  email = :email,
                  phone = :phone,
                  source = :source,
                  campaign = :campaign,
                  status = :status,
                  remarks = :remarks,
                  last_response = :last_response,
                  feedback = :feedback
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':source', $data['source']);
        $stmt->bindParam(':campaign', $data['campaign']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':remarks', $data['remarks']);
        $stmt->bindParam(':last_response', $data['last_response']);
        $stmt->bindParam(':feedback', $data['feedback']);
        
        if ($stmt->execute()) {
            sendSuccess('Lead updated successfully');
        } else {
            sendError('Failed to update lead');
        }
    } catch(Exception $e) {
        sendError('Error updating lead: ' . $e->getMessage());
    }
}

function deleteLead($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Lead ID is required');
    }
    
    try {
        $query = "DELETE FROM leads WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        
        if ($stmt->execute()) {
            sendSuccess('Lead deleted successfully');
        } else {
            sendError('Failed to delete lead');
        }
    } catch(Exception $e) {
        sendError('Error deleting lead: ' . $e->getMessage());
    }
}
?>