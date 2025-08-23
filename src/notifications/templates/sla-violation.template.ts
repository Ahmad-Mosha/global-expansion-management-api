import { SlaViolationNotificationDto } from '../dto/email-notification.dto';

export function generateSlaViolationEmail(data: SlaViolationNotificationDto): {
  html: string;
  text: string;
} {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>SLA Violation Alert</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .alert-details { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
            .sla-hours { font-size: 20px; font-weight: bold; color: #dc3545; }
            .button { display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⚠️ SLA Violation Alert</h1>
            </div>
            <div class="content">
                <p>Hello Admin,</p>
                
                <p>A vendor has exceeded their response SLA and requires immediate attention.</p>
                
                <div class="alert-details">
                    <h3>Violation Details</h3>
                    <p><strong>Vendor:</strong> ${data.vendorName}</p>
                    <p><strong>SLA Commitment:</strong> <span class="sla-hours">${data.slaHours} hours</span></p>
                    <p><strong>Issue:</strong> ${data.violationDetails}</p>
                </div>
                
                <p>Please review this vendor's performance and take appropriate action to ensure service quality standards are maintained.</p>
                
                <a href="http://localhost:3000/vendors/${data.vendorId}" class="button">Review Vendor</a>
                
                <p>Best regards,<br>
                <strong>Expanders360 System</strong></p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
SLA Violation Alert

Hello Admin,

A vendor has exceeded their response SLA and requires immediate attention.

Violation Details:
- Vendor: ${data.vendorName}
- SLA Commitment: ${data.slaHours} hours
- Issue: ${data.violationDetails}

Please review this vendor's performance and take appropriate action.

Review vendor: http://localhost:3000/vendors/${data.vendorId}

Best regards,
Expanders360 System
  `;

  return { html, text };
}
