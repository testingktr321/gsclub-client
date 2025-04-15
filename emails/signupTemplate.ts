export const signupTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome!</title>
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
        .logo {
            font-size: 32px;
            color: #222;
            margin: 20px 0;
        }
        .subtitle {
            font-size: 18px;
            text-transform: uppercase;
            margin-bottom: 20px;
            font-weight: bold;
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
        <p class="subtitle"><strong>Best deals for your vaping experience</strong></p>
        <p class="message">
            Hi <strong>${name}</strong>,<br><br>
            We're thrilled to have you on board at <strong>Itip Convenience Store</strong>! Explore our latest vaping products, exclusive deals, and premium flavors curated just for you.<br><br>
            Enjoy your experience with us!<br>
            <strong>Happy Vaping! 🚀</strong>
        </p>
    </div>
</body>
</html>
`;
