<?php
session_start();
include('includes/db.php');

if (!isset($_SESSION['username'])) {
    header('Location: login_admin.php');
    exit();
}

$minUsernameLength = 7;
$maxUsernameLength = 20;
$minPasswordLength = 7; 
$maxPasswordLength = 30;
$minNameLength = 2; 
$maxNameLength = 30;

/* Validates the form based on the set lengths of the db (coded above), handles error messages,
  Creates new account
  Psalmer
*/
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'], $_POST['password'], $_POST['first_name'], $_POST['last_name'])) {
    // Sanitize and validate the input (you might want to add more validation)
    $username = mysqli_real_escape_string($db, $_POST['username']);
    $password = mysqli_real_escape_string($db, $_POST['password']);
    $first_name = mysqli_real_escape_string($db, $_POST['first_name']);
    $last_name = mysqli_real_escape_string($db, $_POST['last_name']);

    // Validate username length
    if (strlen($username) < $minUsernameLength || strlen($username) > $maxUsernameLength) {
        $errorMessage = "Username must be between $minUsernameLength and $maxUsernameLength characters.";
    }
    // Validate password length
    elseif (strlen($password) < $minPasswordLength || strlen($password) > $maxPasswordLength) {
        $errorMessage = "Password must be between $minPasswordLength and $maxPasswordLength characters.";
    }
    // Validate first name length
    elseif (strlen($first_name) < $minNameLength || strlen($first_name) > $maxNameLength) {
        $errorMessage = "First name must be between $minNameLength and $maxNameLength characters.";
    }
    // Validate last name length
    elseif (strlen($last_name) < $minNameLength || strlen($last_name) > $maxNameLength) {
        $errorMessage = "Last name must be between $minNameLength and $maxNameLength characters.";
    } else {
        // Insert the user into the database
        $query = "INSERT INTO users (username, password, first_name, last_name, role) VALUES (?, ?, ?, ?, 'Content Manager')";
        $stmt = $db->prepare($query);

        if ($stmt) {
            $stmt->bind_param("ssss", $username, $password, $first_name, $last_name);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                $successMessage = "User added successfully!";
            } else {
                $errorMessage = "Error adding user: " . $stmt->error;
            }

            $stmt->close();
        } else {
            $errorMessage = "Error preparing statement: " . $db->error;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="css/logo.png" type="image/png">
  <title>Add User</title>
  <link rel="stylesheet" href="css/add-user.css">
</head>
<body>

<div class="popup">
  <h2>Add User</h2>

  <?php
  // Display success or error message if set
  if (isset($successMessage)) {
      echo '<div class="message">' . $successMessage . '</div>';
  } elseif (isset($errorMessage)) {
      echo '<div class="message"><span class="error">' . $errorMessage . '</span></div>';
  }
  ?>

  <form action="" method="post" id="add-user-form">
    <div class="form-group">
      <input type="text" id="first_name" name="first_name" placeholder="First Name" required>
    </div>

    <div class="form-group">
      <input type="text" id="last_name" name="last_name" placeholder="Last Name" required>
    </div>

    <div class="form-group">
      <input type="text" id="username" name="username" placeholder="Username" required>
    </div>

    <div class="form-group">
      <input type="password" id="password" name="password" placeholder="Password" required>
    </div>

    <button type="submit">Submit</button>
    <button type="button" onclick="window.location.href='admin.php'">Cancel</button>
  </form>
</div>

</body>
</html>
