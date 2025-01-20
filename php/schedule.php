<?php
/*
    Fetches the scheduled videos and prints them onto a table
    Psalmer
*/
$connect = mysqli_connect("localhost", "root", "", "bashdb_live");
$days = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
$tab_menu = '';
$tab_content = '';

foreach ($days as $day) {
    $tab_menu .= '
        <li><a href="#'.$day.'" data-toggle="tab">'.$day.'</a></li>
    ';
    $tab_content .= '
        <div id="'.$day.'" class="tab-pane fade">
    ';

    $schedule_query = "SELECT * FROM schedule WHERE DAYNAME(airing_date) = '".$day."' ORDER BY airing_start";
    $schedule_result = mysqli_query($connect, $schedule_query);

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
