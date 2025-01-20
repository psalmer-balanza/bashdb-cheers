<?php
include("includes/db.php");


$days = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
$tab_menu = '';
$tab_content = '';

$defaultDay = date('l'); // Get the current day of the week

// get the schedule for the day
foreach ($days as $day) {
    $isActive = ($day === $defaultDay) ? 'class="active"' : '';

    $tab_menu .= '
        <li '.$isActive.'><a href="#'.$day.'" data-toggle="tab">'.$day.'</a></li>
    ';
    $tab_content .= '
        <div id="'.$day.'" class="tab-pane fade">
    ';

    $schedule_query = "SELECT * FROM schedule WHERE DAYNAME(airing_date) = '".$day."' ORDER BY airing_start";
    $schedule_result = mysqli_query($db, $schedule_query);

    while($sub_row = mysqli_fetch_array($schedule_result)) {
        $tab_content .= '
            <div class="col-md-3" style="margin-bottom:36px;">
                <h4>'.$sub_row["content_key"].'</h4>
                <p>Airing Time: '.$sub_row["airing_start"].' - '.$sub_row["airing_end"].'</p>
                <p>Uploader: '.$sub_row["set_by"].'</p>
            </div>
        ';
    }

    $tab_content .= '<div style="clear:both"></div></div>';
}
?>

<!DOCTYPE html>
<html>
    <head>
        <link rel="icon" href="../public/images/logo.png" type="image/png">
        <title>Schedule Viewer</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script src="../headerFooterManager.js" defer></script>
        <link rel="stylesheet" href="../public/css/schedule.css">
    </head>
    <body>
    <special-header></special-header>
        <div class = "topside">
            <div class = "back-btn">
                <a href="http://localhost:8001" id="home-button">Back</a>
            </div>
            <div class= "logo">
                <h2>BashDB Broadcast</h2>
            </div>
        </div>
        <div class="container">
            <h2>Schedule Viewer</h2>
            <br/>
            <ul class="nav nav-tabs">
                <?php
                echo $tab_menu;
                ?>
            </ul>
            <div class="tab-content">
                <br/>
                <?php
                echo $tab_content;
                ?>
            </div>
        </div>
    <special-footer></special-footer>
    </body>
</html>
