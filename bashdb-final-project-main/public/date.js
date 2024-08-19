document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('datetimepicker-container').addEventListener('click', function () {
        document.getElementById('datetimepicker-popup').style.display = 'block';
    });

    document.getElementById('saveBtn').addEventListener('click', function () {
        var selectedDate = document.getElementById('date-input').value;
        alert('Date saved: ' + selectedDate);
        document.getElementById('datetimepicker-popup').style.display = 'none';
    });

    document.getElementById('cancelBtn').addEventListener('click', function () {
        // Redirect to the timeline page
        window.location.href = 'timeline';
    });
});