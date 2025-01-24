// login ajax using jquery

$(document).ready(function () {
    const loginForm = $("#login-form"); // jQuery selector for the form
    const errorMessage = $("#error-message"); // jQuery selector for the error message

    loginForm.on("submit", function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Get form data
        const data = loginForm.serialize(); // Serialize form data into a URL-encoded string

        // Send AJAX request to the server
        $.ajax({
            url: loginForm.attr("action"), // Get the 'action' attribute value from the form
            method: loginForm.attr("method"), // Get the 'method' attribute value from the form
            data: data, // Send serialized form data
            success: function (response) {
                if (response.success) {
                    // Redirect to the dashboard
                    window.location.href = "/home"; // Adjust the redirect URL as needed
                } else {
                    // Show the error message
                    errorMessage.text(response.error || "Login failed.");
                    errorMessage.show(); // Display the error message
                }
            },
            error: function () {
                // Handle network or unexpected errors
                errorMessage.text("An unexpected error occurred. Please try again.");
                errorMessage.show(); // Display the error message
            },
        });
    });
});
