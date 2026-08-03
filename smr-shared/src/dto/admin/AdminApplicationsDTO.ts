import { ApplicationStatus, ApplicationType } from "../../enums";

export interface ProcessApplicationRequest {
  application_id: string;
  application_status: ApplicationStatus;
  admin_comment: {
    comment: string;
  };
}

export interface AdminApplicationListResult {
  application_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email_id: string;
  application_type: ApplicationType;
  application_status: ApplicationStatus;
  created_at: Date;
  updated_at: Date;
}
