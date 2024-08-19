document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains("delete-button")) {
          // Open the delete confirmation modal and pass the username
          openDeleteModal(event.target.dataset.username);
        } else if (event.target.classList.contains("edit-button")) {
          // Open the password reset modal and pass the username
          openPasswordResetModal(event.target.dataset.username);
        }
      });
});
// Function to open the password reset modal and simulate updating the password -AYAP, Balanza
function openPasswordResetModal(username) {
    // Replace USERNAME with the actual username
    const modal = document.getElementById("passwordResetModal");
    modal.querySelector("h2").textContent = `Reset password of user "${username}"`;

    // Set up the form submission event
    const passwordResetForm = modal.querySelector("#passwordResetForm");
    passwordResetForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Extract new password and confirm password from the form
      const newPassword = passwordResetForm.querySelector("#newPassword").value;
      const confirmPassword = passwordResetForm.querySelector("#confirmPassword").value;

      // Check if newPassword and confirmPassword match
      if (newPassword !== confirmPassword) {
        console.error('New password and confirm password do not match');
        return;
      }

      const xhr = new XMLHttpRequest();
        xhr.open('POST', 'reset_password.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            console.log('Raw response:', xhr.responseText);
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            console.log(`Password reset for user ${username} successful`);
                        } else {
                            console.error('Error resetting password:', response.message);
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                    modal.style.display = 'none';
                } else {
                    console.error('Error in request:', xhr.statusText);
                }
            }
        };
            // Send username and new password to the PHP script
        const data = 'username=' + encodeURIComponent(username) + '&newPassword=' + encodeURIComponent(newPassword);
        xhr.send(data);

      // Update the password in the UI immediately
      const passwordCell = document.querySelector(`.edit-button[data-username="${username}"]`).closest('tr').querySelectorAll('td')[3];

      passwordCell.textContent = newPassword;

      // Close the modal after submitting the form
      modal.style.display = 'none';

      // Remove event listener to prevent memory leaks
      passwordResetForm.removeEventListener("submit", arguments.callee);

      // Reset the form
      passwordResetForm.reset();
    });

    const cancelButton = modal.querySelector(".cancel-button");
    cancelButton.addEventListener("click", function () {
        modal.style.display = 'none';
        passwordResetForm.removeEventListener("submit", arguments.callee);
        cancelButton.removeEventListener("click", arguments.callee);
        // Reset the form
        passwordResetForm.reset();
    });

    modal.style.display = "block";
}

// Function to open the delete confirmation modal and populate username - Balanza
function openDeleteModal(username) {
    const modal = document.getElementById("deleteConfirmationModal");
    const deleteUsernameSpan = document.getElementById("deleteUsername");
    deleteUsernameSpan.textContent = username;
    modal.style.display = "block";

    // Function to close the delete confirmation modal
    const deleteSpan = document.getElementsByClassName("close")[1];
    deleteSpan.onclick = function () {
      modal.style.display = "none";
    };

    // Function to close the delete confirmation modal when clicking "No"
    const cancelDeleteBtn = document.getElementById("cancelDelete");
    cancelDeleteBtn.onclick = function () {
      modal.style.display = "none";
    };

    // Function to confirm deletion when clicking "Yes"
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    confirmDeleteBtn.onclick = function () {
        // Send an AJAX request to delete-user.php
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'delete_user.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            console.log('Raw response:', xhr.responseText);
            if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                try {
                  const response = JSON.parse(xhr.responseText);
                  if (response.success) {
                    console.log(`User ${username} deleted successfully`);
                    const usernameToDelete = username;
                    console.log("Username to delete:", usernameToDelete);
            
                    // Find the table body
                    const tableBody = document.querySelector("table tbody");
            
                    // Iterate through the rows and find the row with the specified username
                    const rows = tableBody.getElementsByTagName('tr');
                    let rowToDelete = null;
            
                    for (let i = 0; i < rows.length; i++) {
                        const usernameCell = rows[i].querySelector('td:nth-child(3)'); // Assuming the username is in the third column
                        if (usernameCell && usernameCell.textContent.trim() === usernameToDelete) {
                            rowToDelete = rows[i];
                            break;
                        }
                    }
            
                    // Delete the row if found
                    if (rowToDelete) {
                        rowToDelete.remove();
                        console.log("Row deleted successfully");
                    } else {
                        console.log("Row not found");
                    }
            
                  } else {
                    console.error('Error deleting user:', response.message);
                  }
                } catch (error) {
                  console.error('Error parsing JSON:', error);
                }
                modal.style.display = 'none';
              } else {
                console.error('Error in request:', xhr.statusText);
              }
            }
          };

        const data = 'username=' + encodeURIComponent(username);
        xhr.send(data);
    };
}