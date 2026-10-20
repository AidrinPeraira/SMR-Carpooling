import { ApplicationType, ApplicationStatus } from "../../enums";
import { TrendRange } from "../../enums/messages/AdminDashEnums";

export interface GetUsersCountResult {
  total_users: number;
  active_users: number;
  inactive_users: number;
}

export interface GetApplicationCountResult {
  total_applications: number;
  vehicle_applications: number;
  onboarding_applications: number;
  renewal_applications: number;
}

export interface LatestApplicationItem {
  application_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  application_type: ApplicationType;
  application_status: ApplicationStatus;
  created_at: Date;
}

export interface GetLatestApplicationsResult {
  applications: LatestApplicationItem[];
}

export interface GetTripsCountResult {
  total_trips: number;
  completed_trips: number;
  upcoming_trips: number;
  cancelled_trips: number;
}

export interface TrendDataPoint {
  label: string;
  value: number;
}

export interface GetTripTrendResult {
  trend_range: TrendRange;
  data: TrendDataPoint[];
}

export interface GetTransactionsSummaryResult {
  total_revenue: number;
  booking_revenue: number;
  payouts_issued: number;
  refunds_issued: number;
}

export interface GetRevenueTrendResult {
  trend_range: TrendRange;
  data: TrendDataPoint[];
}
