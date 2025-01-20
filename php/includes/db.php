<?php
$host = "localhost";
$username = "root";
$password = "";
$database = "bashdb_final";

// Create a new mysqli object
$db = new mysqli($host, $username, $password, $database);

// Check the connection
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}
?>
