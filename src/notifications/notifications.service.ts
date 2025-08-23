import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  EmailNotificationDto,
  MatchCreatedNotificationDto,
  SlaViolationNotificationDto,
} from './dto/email-notification.dto';
import { generateMatchCreatedEmail } from './templates/match-created.template';
import { generateSlaViolationEmail } from './templates/sla-violation.template';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;
  private emailEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.emailEnabled = this.configService.get<boolean>('EMAIL_ENABLED', false);
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (this.emailEnabled) {
      // Real SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT', 587),
        secure: false,
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      });
    } else {
      // Mock transporter for development
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    }
  }

  async sendEmail(emailData: EmailNotificationDto): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get<string>(
          'EMAIL_FROM',
          'noreply@expanders360.com',
        ),
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      };

      if (this.emailEnabled) {
        // Send real email
        const result = await this.transporter.sendMail(mailOptions);
        this.logger.log(
          `Email sent successfully to ${emailData.to}: ${result.messageId}`,
        );
      } else {
        // Mock email - log to console
        this.logger.log('📧 MOCK EMAIL SENT:');
        this.logger.log(`To: ${emailData.to}`);
        this.logger.log(`Subject: ${emailData.subject}`);
        this.logger.log(`Content: ${emailData.text?.substring(0, 200)}...`);
        this.logger.log('---');
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${emailData.to}:`, error);
      throw error;
    }
  }

  async sendMatchCreatedNotification(
    data: MatchCreatedNotificationDto,
  ): Promise<void> {
    const { html, text } = generateMatchCreatedEmail(data);

    await this.sendEmail({
      to: data.clientEmail,
      subject: `🎯 New Vendor Match Found for ${data.projectCountry} Project`,
      html,
      text,
    });
  }

  async sendSlaViolationNotification(
    data: SlaViolationNotificationDto,
  ): Promise<void> {
    const { html, text } = generateSlaViolationEmail(data);

    // Send to all admin emails
    for (const adminEmail of data.adminEmails) {
      await this.sendEmail({
        to: adminEmail,
        subject: `⚠️ SLA Violation Alert: ${data.vendorName}`,
        html,
        text,
      });
    }
  }

  async sendDailyMatchRefreshNotification(
    projectCount: number,
    matchCount: number,
  ): Promise<void> {
    const adminEmails = await this.getAdminEmails();

    const subject = '📊 Daily Match Refresh Complete';
    const text = `Daily match refresh completed successfully.\n\nProjects processed: ${projectCount}\nNew matches created: ${matchCount}`;
    const html = `
      <h2>📊 Daily Match Refresh Complete</h2>
      <p>Daily match refresh completed successfully.</p>
      <ul>
        <li><strong>Projects processed:</strong> ${projectCount}</li>
        <li><strong>New matches created:</strong> ${matchCount}</li>
      </ul>
    `;

    for (const adminEmail of adminEmails) {
      await this.sendEmail({
        to: adminEmail,
        subject,
        html,
        text,
      });
    }
  }

  private async getAdminEmails(): Promise<string[]> {
    // Return the real admin emails for notifications
    return [
      'effinbzz1@gmail.com',
      'effinbzz3@gmail.com',
      'ahmedgeuy159@gmail.com',
    ];
  }
}
