import { ScheduledJOB } from "@sharemyride/shared";

/**
 * This service allows adding and removing scheduled jobs to a
 * scheduler or event bus that trigers the action after an interval
 * or at a scheduled time.
 */
export interface ISchedulerService {
  scheduleJob<BodyType>(job: ScheduledJOB<BodyType>): Promise<void>;
}
