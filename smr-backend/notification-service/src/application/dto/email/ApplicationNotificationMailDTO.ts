export interface ApplicationReturnedMailDTO {
  userName: string;
  emailId: string;
  applicationType: string;
  comment?: string;
}

export interface ApplicationRejectedMailDTO {
  userName: string;
  emailId: string;
  applicationType: string;
  comment?: string;
}

export interface ApplicationApprovedMailDTO {
  userName: string;
  emailId: string;
  applicationType: string;
  comment?: string;
}
