<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "Your message is received. Thank you!";
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
?>