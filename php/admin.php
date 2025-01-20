<?php
session_start();

// Check if the user is not authenticated, redirect to the login page
if (!isset($_SESSION['username'])) {
    header('Location: login_admin.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin</title>
  <link rel="icon" href="images/logo.png" type="image/png">
  <link rel="stylesheet" href="css/admin.css">
  <title>Admin</title>
  <script src="scripts/admin.js" defer></script>
</head>

<body>
    <!-- Created by Bruce Balderas -->
    <!-- Log-out button and add user button -->
  <div id="content">
    <special-header><?php include('includes/header.php');?></special-header>
    <h2>Welcome, <?php echo $_SESSION['username']; ?></h2>
    <p>Manage user accounts</p>
    <table class="placeholder-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Password</th>
          <th>Forgotten</th>
        </tr>
      </thead>
      <tbody>
        <?php include('functions/fetch_users.php');?>
      </tbody>
    </table>
    <div class = "logadd">
      <div class = "signout">
      <form action="functions/logout.php" method="post" class="logout-form">
          <button type="submit" class="logout-btn"><i class='bx bx-log-out'></i> Log-out</button>
        </form>
      </div>
      <div class = "add">
        <a href="add_user.php" class="add-user-button">Add User</a>
      </div>
    </div>
    <special-footer><?php include('includes/footer.php');?></special-footer>
  </div>
</div>

<!-- Password Reset Modal Start -->
<div id="passwordResetModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>*USERNAME* has sent a request to reset their password</h2>
    <form id="passwordResetForm">
      <div class="form-group">
        <label for="newPassword">New password:</label>
        <input type="password" id="newPassword" name="newPassword" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required>
      </div>
      <div class="form-group">
        <button type="submit" class="apply-button">Apply</button>
        <button type="button" class="cancel-button">Cancel</button>
      </div>
    </form>
  </div>
</div>
<!-- Password Reset Modal End -->


<!-- Delete Confirmation Modal Start -->
<div id="deleteConfirmationModal" class="modal">
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Are you sure you want to delete <span id="deleteUsername">*USERNAME*</span> as a content manager?</h2>
      <div class="modal-footer">
        <button id="confirmDelete" class="confirm-delete-button">Yes</button>
        <button id="cancelDelete" class="cancel-delete-button">No</button>
      </div>
    </div>
  </div>
  <!-- Delete Confirmation Modal End -->
</body>
</html>
