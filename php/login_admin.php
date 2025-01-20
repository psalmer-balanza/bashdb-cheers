<?php
session_start();
include('includes/db.php');

/* Logs in and redirects
    Psalmer
*/
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the submitted username and password
    $submittedUsername = $_POST['username'];
    $submittedPassword = $_POST['password'];

    // Prepare and execute the query
    $stmt = $db->prepare("SELECT username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $submittedUsername);
    $stmt->execute();
    $stmt->bind_result($dbUsername, $dbPassword);
    $stmt->fetch();
    $stmt->close();

    // Check if the submitted credentials match the valid credentials
    if ($submittedUsername === $dbUsername && $submittedPassword === $dbPassword) {
        // Authentication successful
        $_SESSION['username'] = $submittedUsername;
        header('Location: /bashdb-final-project/php/admin.php'); // Redirect to the dashboard or any desired page
        exit();
    } else {
        // Authentication failed
        $error = 'Invalid username or password';
        echo '<script>alert("Invalid credentials! Please try again")</script>';
    }
}
?>

<!-- Created by Bruce Balderas -->
<!-- Log-in page for admins -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log in</title>
    <link rel="icon" href="css/logo.png" type="image/png">
    <link rel="stylesheet" href="css/login.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <script src="server_script.js" defer></script>
</head>
<body>
    <div class = "whole">
        <div class = "brand">
            <img class="logo-image" src="css/logo.png" alt="logo">
            <h1>CHEERS</h1>
            <h2>Communicating Holistic Education Engagements on Radio Spaces</h2>
        </div>

        <div class = "login-form">
            <form action = "/login" method="POST" id="login-form">
                <h1>Admin Login</h1>
                <div class = "input-box">
                    <input type="text" name="username" placeholder="Username" required>
                    <i class='bx bxs-user-check'></i>
                </div>
                <div class = "input-box">
                    <input type="password" name="password" placeholder="Password" required>
                    <i class='bx bx-lock-alt' ></i>
                </div>

                <div class = "forgot">
                    <a href="#">Forgot Password?</a>
                </div>
            <button type="submit" class="login-button">Sign-in</button>
            </form>
        </div>
    </div>
</body>
</html>