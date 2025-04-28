export const signupTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Itip Convenience Store</title>
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
        .subtitle {
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: bold;
            color: #555;
        }
        .message {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
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
        <p class="title">Welcome, ${name}</p>
        <p class="subtitle">Thank you for joining Itip Convenience Store</p>
        <p class="message">
            Hello ${name},<br><br>
            We're excited to have you as part of our community.<br>
            At Itip Convenience Store, we offer a range of lifestyle products for your needs.<br><br>
            Feel free to explore our latest collections and updates by visiting our website.<br><br>
            If you have any questions or need assistance, our support team is here to help.<br><br>
            Thank you for choosing us.
        </p>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Itip Convenience Store. All rights reserved.
        </div>
    </div>
</body>
</html>
`;
