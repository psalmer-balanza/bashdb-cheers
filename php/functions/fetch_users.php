<?php
include('includes/db.php');

// Fetch users from the "users" table
$query = "SELECT * FROM users";
$result = $db->query($query);

if ($result) {
    

    while ($row = $result->fetch_assoc()) {
        echo '<tr>';
        echo '<td>' . htmlspecialchars($row['first_name']) . '</td>';
        echo '<td>' . htmlspecialchars($row['last_name']) . '</td>';
        echo '<td>' . htmlspecialchars($row['username']) . '</td>';
        // Note: Avoid echoing passwords in a real-world scenario
        echo '<td>' . htmlspecialchars($row['password']) . '</td>';
        echo '<td>';
        echo '<button class="edit-button" data-username="' . $row['username'] . '">Edit</button>';
        echo '<button class="delete-button" data-username="' . $row['username'] . '">Delete</button>';
        echo '</td>';
        echo '</tr>';
    }

    echo '</tbody></table>';

    // Free the result set
    $result->free();
} else {
    echo 'Error fetching users: ' . $db->error;
}

?>