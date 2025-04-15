export const resetPasswordTemplate = (name: string, resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            color: #222;
            margin: 20px 0;
        }
        .message {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            background-color: #222;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="title">Password Reset Request</h2>
        <p class="message">
            Hi <strong>${name}</strong>,<br><br>
            We received a request to reset your password. Click the button below to reset it. If you did not request this, you can ignore this email.<br><br>
            <a href="${resetLink}" class="button">Reset Password</a><br><br>
            This link will expire in 1 hour.
        </p>
        <p class="footer">
            If you have any issues, contact our support team.<br>
            <strong>Itip Convenience Store Team 🚀</strong>
        </p>
    </div>
</body>
</html>
`;
