<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['email']) || !isset($data['password'])) {
    sendError('Email and password are required');
}

try {
    $query = "SELECT id, name, email, password_hash, role FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data['email']);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        sendError('Invalid credentials');
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!password_verify($data['password'], $user['password_hash'])) {
        sendError('Invalid credentials');
    }
    
    // Remove password hash from response
    unset($user['password_hash']);
    
    // In a real application, you would generate a JWT token here
    // For simplicity, we're just returning user data
    sendSuccess('Login successful', [
        'user' => $user,
        'token' => 'simple_token_' . $user['id'] // Replace with proper JWT
    ]);
    
} catch(Exception $e) {
    sendError('Login error: ' . $e->getMessage());
}
?>