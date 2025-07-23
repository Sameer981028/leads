<?php
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    // Get total leads
    $totalLeadsQuery = "SELECT COUNT(*) as total FROM leads";
    $totalLeadsStmt = $db->prepare($totalLeadsQuery);
    $totalLeadsStmt->execute();
    $totalLeads = $totalLeadsStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get integration stats
    $integrationStartedQuery = "SELECT COUNT(*) as total FROM integrations WHERE integration_status = 'Started'";
    $integrationStartedStmt = $db->prepare($integrationStartedQuery);
    $integrationStartedStmt->execute();
    $integrationStarted = $integrationStartedStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $integrationCompletedQuery = "SELECT COUNT(*) as total FROM integrations WHERE integration_status = 'Completed'";
    $integrationCompletedStmt = $db->prepare($integrationCompletedQuery);
    $integrationCompletedStmt->execute();
    $integrationCompleted = $integrationCompletedStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get payment stats
    $paymentsReceivedQuery = "SELECT COUNT(*) as total FROM payments WHERE status = 'Paid'";
    $paymentsReceivedStmt = $db->prepare($paymentsReceivedQuery);
    $paymentsReceivedStmt->execute();
    $paymentsReceived = $paymentsReceivedStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $paymentsPendingQuery = "SELECT COUNT(*) as total FROM payments WHERE status = 'Not Paid'";
    $paymentsPendingStmt = $db->prepare($paymentsPendingQuery);
    $paymentsPendingStmt->execute();
    $paymentsPending = $paymentsPendingStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get active demos
    $activeDemosQuery = "SELECT COUNT(*) as total FROM demos WHERE end_date > NOW() AND status != 'Expired'";
    $activeDemosStmt = $db->prepare($activeDemosQuery);
    $activeDemosStmt->execute();
    $activeDemos = $activeDemosStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get funnel data
    $demosQuery = "SELECT COUNT(*) as total FROM demos";
    $demosStmt = $db->prepare($demosQuery);
    $demosStmt->execute();
    $totalDemos = $demosStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $integrationsQuery = "SELECT COUNT(*) as total FROM integrations";
    $integrationsStmt = $db->prepare($integrationsQuery);
    $integrationsStmt->execute();
    $totalIntegrations = $integrationsStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $dashboardData = [
        'totalLeads' => (int)$totalLeads,
        'integrationStarted' => (int)$integrationStarted,
        'integrationCompleted' => (int)$integrationCompleted,
        'paymentsReceived' => (int)$paymentsReceived,
        'paymentsPending' => (int)$paymentsPending,
        'activeDemos' => (int)$activeDemos,
        'funnelData' => [
            'leads' => (int)$totalLeads,
            'demos' => (int)$totalDemos,
            'integrations' => (int)$totalIntegrations,
            'payments' => (int)$paymentsReceived
        ]
    ];
    
    sendSuccess('Dashboard data retrieved successfully', $dashboardData);
    
} catch(Exception $e) {
    sendError('Error retrieving dashboard data: ' . $e->getMessage());
}
?>