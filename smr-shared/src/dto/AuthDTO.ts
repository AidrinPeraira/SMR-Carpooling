export interface SignUpRequest {
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface SignUpResult {
  user_id: string;
  first_name: string;
  last_name: string;
  email_id: string;
}
