<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two-Factor Authentication Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .code {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 3px;
            color: #333;
            background-color: #f3f4f6;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
        }
        .text-muted {
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>Two-Factor Authentication</h2>
        <p>You requested to sign in. Please use the following code to complete your login:</p>
        
        <div class="code">
            {{ $code }}
        </div>

        <p class="text-muted">This code will expire in 3 minutes.</p>
        <p class="text-muted">If you did not request this, please ignore this email.</p>

        <p class="text-muted">Thank you!</p>
    </div>

</body>
</html>
