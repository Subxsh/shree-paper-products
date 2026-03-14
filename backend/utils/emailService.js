const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email to customer confirming their custom order
const sendCustomOrderConfirmation = async (orderData) => {
  try {
    const orderDate = new Date(orderData.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a365d; color: white; padding: 20px; border-radius: 5px; text-align: center; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; }
          .label { font-weight: bold; color: #1a365d; }
          .value { color: #666; }
          .order-id { font-size: 18px; font-weight: bold; color: #1a365d; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .detail-item { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Received Successfully</h1>
            <p>Thank you for your custom order request!</p>
          </div>

          <div class="section">
            <p>Dear <strong>${orderData.customerName}</strong>,</p>
            <p>We have received your custom paper cone order request. Our team will review your specifications and contact you within 24 hours with a detailed quote.</p>
            
            <div class="order-id">
              Order Reference: #${orderData._id.toString().slice(-8).toUpperCase()}
            </div>
          </div>

          <div class="section">
            <h3 style="color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px;">Customer Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Name:</span>
                <div class="value">${orderData.customerName}</div>
              </div>
              <div class="detail-item">
                <span class="label">Company:</span>
                <div class="value">${orderData.companyName}</div>
              </div>
              <div class="detail-item">
                <span class="label">Email:</span>
                <div class="value">${orderData.email}</div>
              </div>
              <div class="detail-item">
                <span class="label">Phone:</span>
                <div class="value">${orderData.phone}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 style="color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px;">Cone Specifications</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Cone Degree:</span>
                <div class="value">${orderData.coneDegree}</div>
              </div>
              <div class="detail-item">
                <span class="label">Material:</span>
                <div class="value">${orderData.material}</div>
              </div>
              <div class="detail-item">
                <span class="label">Length:</span>
                <div class="value">${orderData.length} mm</div>
              </div>
              <div class="detail-item">
                <span class="label">Top Diameter:</span>
                <div class="value">${orderData.topDiameter} mm</div>
              </div>
              <div class="detail-item">
                <span class="label">Bottom Diameter:</span>
                <div class="value">${orderData.bottomDiameter} mm</div>
              </div>
              <div class="detail-item">
                <span class="label">Thread Compatibility:</span>
                <div class="value">${orderData.threadCompatibility}</div>
              </div>
              <div class="detail-item">
                <span class="label">Weight:</span>
                <div class="value">${orderData.weight}g</div>
              </div>
              <div class="detail-item">
                <span class="label">Strength:</span>
                <div class="value">${orderData.strength}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 style="color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px;">Order Details</h3>
            <div class="detail-item">
              <span class="label">Quantity Required:</span>
              <div class="value">${orderData.quantity.toLocaleString()} NOS</div>
            </div>
            <div class="detail-item">
              <span class="label">Required Delivery Date:</span>
              <div class="value">${new Date(orderData.deliveryDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</div>
            </div>
            ${orderData.notes ? `
            <div class="detail-item">
              <span class="label">Special Instructions:</span>
              <div class="value">${orderData.notes}</div>
            </div>
            ` : ''}
          </div>

          <div class="section" style="background-color: #f0f8ff; border-color: #1a365d;">
            <h3 style="color: #1a365d;">What Happens Next?</h3>
            <ul style="line-height: 1.8; margin-left: 20px;">
              <li>Our technical team will review your specifications</li>
              <li>We'll prepare a detailed quote with manufacturing timeline</li>
              <li>We'll contact you at <strong>${orderData.phone}</strong> or <strong>${orderData.email}</strong></li>
              <li>Once approved, production typically takes 7-14 days</li>
            </ul>
          </div>

          <div class="section" style="background-color: #fff3cd; border-color: #ffc107;">
            <strong style="color: #856404;">⏱️ Need immediate assistance?</strong>
            <p style="margin: 10px 0 0 0; color: #856404;">
              Call us: <strong>+91 98765 43210</strong><br>
              Email: <strong>orders@shreepaper.com</strong>
            </p>
          </div>

          <div class="footer">
            <p>Shree Paper Products | Kangeyam, Tirupur, Tamilnadu, India</p>
            <p>Thank you for choosing us!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@shreepaper.com',
      to: orderData.email,
      subject: `Order Received - Reference #${orderData._id.toString().slice(-8).toUpperCase()}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${orderData.email}`);
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error.message);
  }
};

// Send email to admin about new custom order
const sendAdminNotification = async (orderData) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@shreepaper.com'];
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ff6b6b; color: white; padding: 20px; border-radius: 5px; text-align: center; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; }
          .order-id { font-size: 18px; font-weight: bold; color: #ff6b6b; margin: 20px 0; }
          .action-button { display: inline-block; background-color: #1a365d; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; margin: 10px 0; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .detail-item { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 NEW CUSTOM ORDER RECEIVED</h1>
          </div>

          <div class="order-id">
            Order ID: ${orderData._id.toString()}
          </div>

          <div class="section">
            <h3 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px;">Customer Information</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Name:</span>
                <div class="value">${orderData.customerName}</div>
              </div>
              <div class="detail-item">
                <span class="label">Company:</span>
                <div class="value">${orderData.companyName}</div>
              </div>
              <div class="detail-item">
                <span class="label">Email:</span>
                <div class="value">${orderData.email}</div>
              </div>
              <div class="detail-item">
                <span class="label">Phone:</span>
                <div class="value">${orderData.phone}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px;">Order Specifications</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Cone Degree:</span>
                <div class="value">${orderData.coneDegree}</div>
              </div>
              <div class="detail-item">
                <span class="label">Material:</span>
                <div class="value">${orderData.material}</div>
              </div>
              <div class="detail-item">
                <span class="label">Quantity:</span>
                <div class="value"><strong>${orderData.quantity.toLocaleString()} NOS</strong></div>
              </div>
              <div class="detail-item">
                <span class="label">Delivery Required:</span>
                <div class="value"><strong>${new Date(orderData.deliveryDate).toLocaleDateString('en-IN')}</strong></div>
              </div>
              <div class="detail-item">
                <span class="label">Length:</span>
                <div class="value">${orderData.length}mm</div>
              </div>
              <div class="detail-item">
                <span class="label">Top Dia:</span>
                <div class="value">${orderData.topDiameter}mm</div>
              </div>
              <div class="detail-item">
                <span class="label">Bottom Dia:</span>
                <div class="value">${orderData.bottomDiameter}mm</div>
              </div>
              <div class="detail-item">
                <span class="label">Weight:</span>
                <div class="value">${orderData.weight}g</div>
              </div>
            </div>
          </div>

          ${orderData.notes ? `
          <div class="section" style="background-color: #fff3cd;">
            <h3 style="color: #856404;">📝 Special Instructions</h3>
            <p style="margin: 0;">${orderData.notes}</p>
          </div>
          ` : ''}

          <div class="section" style="text-align: center;">
            <a href="http://localhost:3000/dashboard/custom-orders/${orderData._id}" class="action-button">Review Order in Dashboard</a>
          </div>

          <div class="section" style="background-color: #f0f8ff; border-color: #1a365d; padding-bottom: 20px;">
            <p style="margin: 0;"><strong>⏰ Received at:</strong> ${new Date(orderData.createdAt).toLocaleString('en-IN')}</p>
            <p style="margin: 10px 0 0 0;"><strong>📊 Status:</strong> Pending Review</p>
          </div>
        </div>
      </body>
      </html>
    `;

    for (const email of adminEmails) {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@shreepaper.com',
        to: email.trim(),
        subject: `🔔 New Custom Order - ${orderData.customerName}`,
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Admin notification sent to ${email}`);
    }
  } catch (error) {
    console.error('❌ Error sending admin notification:', error.message);
  }
};

module.exports = {
  sendCustomOrderConfirmation,
  sendAdminNotification
};
