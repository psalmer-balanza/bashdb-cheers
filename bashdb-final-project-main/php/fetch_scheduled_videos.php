<?php
include("includes/db.php");

//for handling CORS error
header('Access-Control-Allow-Origin: *');

// Get the current date
$currentDate = date("Y-m-d");

// Query to fetch scheduled videos for the current day
$query = "
  SELECT c.location_vid, s.airing_start, s.airing_end
  FROM schedule s
  JOIN content c ON s.content_key = c.content_key
  WHERE s.airing_date = '$currentDate';
";

// Array to store scheduled videos
$scheduledVideos = array();

// Execute the query
$result = $db->query($query);

if ($result->num_rows > 0) {
    // Fetch and store results in the array
    while ($row = $result->fetch_assoc()) {
        $scheduledVideos[] = array(
            "location" => $row["location_vid"],
            "airingStart" => $row["airing_start"],
            "airingEnd" => $row["airing_end"]
        );
    }

    // Set the content type to JSON
    header('Content-Type: application/json');

    // Output the JSON data
    echo json_encode($scheduledVideos);
} else {
    // Set the content type to JSON
    header('Content-Type: application/json');

    // Output JSON indicating no scheduled videos
    echo json_encode(array("message" => "No scheduled videos for " . $currentDate));
}

// Close the database connection
$db->close();
?>

