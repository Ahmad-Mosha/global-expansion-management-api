import { MatchCreatedNotificationDto } from '../dto/email-notification.dto';

export function generateMatchCreatedEmail(data: MatchCreatedNotificationDto): {
  html: string;
  text: string;
} {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Vendor Match Found</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .match-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .score { font-size: 24px; font-weight: bold; color: #28a745; }
            .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 New Vendor Match Found!</h1>
            </div>
            <div class="content">
                <p>Hello <strong>${data.clientName}</strong>,</p>
                
                <p>Great news! We've found a new vendor match for your expansion project.</p>
                
                <div class="match-details">
                    <h3>Match Details</h3>
                    <p><strong>Project:</strong> ${data.projectTitle}</p>
                    <p><strong>Country:</strong> ${data.projectCountry}</p>
                    <p><strong>Matched Vendor:</strong> ${data.vendorName}</p>
                    <p><strong>Match Score:</strong> <span class="score">${data.matchScore}/20</span></p>
                </div>
                
                <p>This vendor has been carefully matched based on your project requirements, including location coverage and service offerings.</p>
                
                <a href="http://localhost:3000/projects/${data.projectId}" class="button">View Project Details</a>
                
                <p>Best regards,<br>
                <strong>Expanders360 Team</strong></p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
New Vendor Match Found!

Hello ${data.clientName},

Great news! We've found a new vendor match for your expansion project.

Match Details:
- Project: ${data.projectTitle}
- Country: ${data.projectCountry}
- Matched Vendor: ${data.vendorName}
- Match Score: ${data.matchScore}/20

This vendor has been carefully matched based on your project requirements.

View your project: http://localhost:3000/projects/${data.projectId}

Best regards,
Expanders360 Team
  `;

  return { html, text };
}
