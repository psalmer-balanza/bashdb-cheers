<?php
include('includes/db.php');
/*
    Validates password input and updates the DB
    Psalmer
*/
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assuming you are passing the username and new password via POST
    $username = $_POST['username'];
    $newPassword = $_POST['newPassword'];

    // Validate input and perform password reset
    if (!empty($username) && !empty($newPassword)) {

        // Update the user's password in the database
        $query = "UPDATE users SET password = ? WHERE username = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $newPassword, $username);

        if ($stmt->execute()) {
            // Password reset successful
            $response = ['success' => true];
        } else {
            // Password reset failed
            $response = ['success' => false, 'message' => 'Error resetting password'];
        }

        $stmt->close();
    } else {
        // Invalid input
        $response = ['success' => false, 'message' => 'Invalid input'];
    }

    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
