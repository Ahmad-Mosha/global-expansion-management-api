export interface EmailNotificationDto {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MatchCreatedNotificationDto {
  clientEmail: string;
  clientName: string;
  projectTitle: string;
  projectCountry: string;
  vendorName: string;
  matchScore: number;
  projectId: string;
  matchId: string;
}

export interface SlaViolationNotificationDto {
  adminEmails: string[];
  vendorName: string;
  vendorId: string;
  slaHours: number;
  violationDetails: string;
}
