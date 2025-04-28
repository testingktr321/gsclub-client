export const shipmentUpdateTemplate = (
  customerName: string,
  orderId: string,
  trackingNumber: string,
  currentStatus: string,
  trackingUrl: string
) => `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Shipment Update</title>
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
        margin-bottom: 20px;
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
      <div class="title">Shipment Update</div>
      <div class="message">
        <p>Hello <strong>${customerName}</strong>,</p> 
        <p>We’re excited to update you on your order's progress!</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p><strong>Current Status:</strong> <span style="text-transform: capitalize;">${currentStatus.replace(
          "_",
          " "
        )}</span></p>
        <p>You can view your shipment details by clicking the button below:</p>
        <a href="${trackingUrl}" class="button">Track Your Shipment</a>
      </div>
      <div class="footer">
        If you have any questions, please contact our support team.<br><br>
        &copy; ${new Date().getFullYear()} Itip Convenience Store. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
