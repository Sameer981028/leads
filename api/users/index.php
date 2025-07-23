<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getUsers($db);
        break;
    case 'POST':
        createUser($db);
        break;
    case 'PUT':
        updateUser($db);
        break;
    case 'DELETE':
        deleteUser($db);
        break;
    default:
        sendError('Method not allowed', 405);
}

function getUsers($db) {
    try {
        $query = "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendSuccess('Users retrieved successfully', $users);
    } catch(Exception $e) {
        sendError('Error retrieving users: ' . $e->getMessage());
    }
}

function createUser($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
        sendError('Name, email, and password are required');
    }
    
    try {
        // Check if email already exists
        $checkQuery = "SELECT id FROM users WHERE email = :email";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':email', $data['email']);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            sendError('Email already exists');
        }
        
        $query = "INSERT INTO users (name, email, password_hash, role) 
                  VALUES (:name, :email, :password_hash, :role)";
        
        $stmt = $db->prepare($query);
        
        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':password_hash', $passwordHash);
        $stmt->bindParam(':role', $data['role'] ?? 'Telecaller');
        
        if ($stmt->execute()) {
            $userId = $db->lastInsertId();
            sendSuccess('User created successfully', ['id' => $userId]);
        } else {
            sendError('Failed to create user');
        }
    } catch(Exception $e) {
        sendError('Error creating user: ' . $e->getMessage());
    }
}

function updateUser($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('User ID is required');
    }
    
    try {
        $query = "UPDATE users SET 
                  name = :name,
                  email = :email,
                  role = :role";
        
        $params = [
            ':id' => $data['id'],
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':role' => $data['role']
        ];
        
        // Only update password if provided
        if (isset($data['password']) && !empty($data['password'])) {
            $query .= ", password_hash = :password_hash";
            $params[':password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        $query .= " WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        if ($stmt->execute()) {
            sendSuccess('User updated successfully');
        } else {
            sendError('Failed to update user');
        }
    } catch(Exception $e) {
        sendError('Error updating user: ' . $e->getMessage());
    }
}

function deleteUser($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        sendError('User ID is required');
    }
    
    try {
        $query = "DELETE FROM users WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $data['id']);
        
        if ($stmt->execute()) {
            sendSuccess('User deleted successfully');
        } else {
            sendError('Failed to delete user');
        }
    } catch(Exception $e) {
        sendError('Error deleting user: ' . $e->getMessage());
    }
}
?>