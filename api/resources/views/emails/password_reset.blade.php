<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        /* Bootstrap-like inline styles for email clients */
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .text-center {
            text-align: center;
        }
        .text-muted {
            color: #6c757d;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2 class="text-center">Reset Your Password</h2>
        <p class="text-center">Click the button below to reset your password:</p>

        <div class="text-center">
            <a href="{{ $resetLink }}" class="btn">Reset Password</a>
        </div>

        <p class="text-muted text-center" style="margin-top: 20px;">
            If you did not request this, please ignore this email.<br>
            This link will expire in 3 minutes.
        </p>

        <p class="text-center text-muted">Thank you!</p>
    </div>

</body>
</html>
