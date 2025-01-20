<?php
// Created by Bruce Balderas
// MySQL Database Connection
$connection = new mysqli('localhost', 'root', '', 'bashdb_live_with_schedule');
if ($connection->connect_error) {
    die('Connection failed: ' . $connection->connect_error);
}
// Created by Bruce Balderas
// Function to load media from the database
function load_media($content_title, $video_length, $location_vid) {
    $video_source_path = "C:/wamp64/www/bashdb-final-project/uploads/{$content_title}.mp4";
    echo json_encode(['videoSourceUrl' => $video_source_path]);
}
// Created by Bruce Balderas
// Function to check and load scheduled media
function check_and_load_media() {
    global $connection;

    $now = date('Y-m-d H:i:s');
    $query = "SELECT schedule.*, second_table.* FROM `schedule`
              JOIN `second_table` ON schedule.content_key = second_table.content_key
              WHERE `airing_date` <= '$now' AND '$now' <= ADDTIME(`airing_date`, `video_length`)";

    $result = $connection->query($query);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $content_title = $row['content_title'];
        $video_length = $row['video_length'];
        $location_vid = $row['location_vid'];

        load_media($content_title, $video_length, $location_vid);

        // Delete the row from the database after loading media
        $delete_query = "DELETE FROM `schedule` WHERE `id` = {$row['id']}";
        $connection->query($delete_query);
    }
}
// Created by Bruce Balderas
// Function to continuously check and load media
function continuous_check() {
    while (true) {
        $current_time = date('H:i:s');

        if ('08:00:00' <= $current_time && $current_time <= '17:00:00') {
            check_and_load_media();
            sleep(10);  // Check every 10 seconds
        } else {
            sleep(300);  // Check every 5 minutes outside the specified time range
        }
    }
}
