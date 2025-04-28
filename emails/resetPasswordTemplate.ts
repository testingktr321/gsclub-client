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
        <h2 class="title">Reset Your Password</h2>
        <p class="message">
            Hello ${name},<br><br>
            We received a request to reset your account password. To proceed, please click the button below:<br><br>
            <a href="${resetLink}" class="button">Reset Password</a><br><br>
            This link is valid for 1 hour. If you did not request a password reset, you can safely ignore this email.
        </p>
        <div class="footer">
            If you need further assistance, please contact our support team.<br><br>
            &copy; ${new Date().getFullYear()} Itip Convenience Store. All rights reserved.
        </div>
    </div>
</body>
</html>
`;
