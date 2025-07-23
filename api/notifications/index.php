<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getNotifications($db);
        break;
    case 'POST':
        createNotification($db);
        break;
    case 'PUT':
        updateNotification($db);
        break;
    case 'DELETE':
        deleteNotification($db);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getNotifications($db) {
    try {
        $query = "SELECT n.*, l.name as lead_name 
                  FROM notifications n 
                  LEFT JOIN leads l ON n.lead_id = l.id 
                  ORDER BY n.created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendSuccess('Notifications retrieved successfully', $notifications);
    } catch(Exception $e) {
        sendError('Error retrieving notifications: ' . $e->getMessage());
    }
}

function createNotification($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['title']) || !isset($data['message'])) {
        sendError('Title and message are required');
    }
    
    try {
        $query = "INSERT INTO notifications (lead_id, user_id, type, title, message, `read`) 
                  VALUES (:lead_id, :user_id, :type, :title, :message, :read)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':lead_id', $data['lead_id']);
        $stmt->bindParam(':user_id', $data['user_id']);
        $stmt->bindParam(':type', $data['type']);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':message', $data['message']);
        $stmt->bindParam(':read', $data['read'] ?? false, PDO::PARAM_BOOL);
        
        if ($stmt->execute()) {
            $notificationId = $db->lastInsertId();
            sendSuccess('Notification created successfully', ['id' => $notificationId]);
        } else {
            sendError('Failed to create notification');
        }
    } catch(Exception $e) {
        sendError('Error creating notification: ' . $e->getMessage());
    }
}

function updateNotification($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Notification ID is required');
    }
    
    try {
        $query = "UPDATE notifications SET 
                  title = :title,
                  message = :message,
                  `read` = :read
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(':id', $data['id']);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':message', $data['message']);
        $stmt->bindParam(':read', $data['read'], PDO::PARAM_BOOL);
        
        if ($stmt->execute()) {
            sendSuccess('Notification updated successfully');
        } else {
            sendError('Failed to update notification');
        }
    } catch(Exception $e) {
        sendError('Error updating notification: ' . $e->getMessage());
    }
}

function deleteNotification($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('Notification ID is required');
    }
    
    try {
        $query = "DELETE FROM notifications WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        
        if ($stmt->execute()) {
            sendSuccess('Notification deleted successfully');
        } else {
            sendError('Failed to delete notification');
        }
    } catch(Exception $e) {
        sendError('Error deleting notification: ' . $e->getMessage());
    }
}
?>