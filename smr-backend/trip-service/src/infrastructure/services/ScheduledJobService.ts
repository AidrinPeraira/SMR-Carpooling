import { AppConfig } from "#/application.config";
import { ISchedulerService } from "#/application/interfaces/services/ISchedulerService";
import { ScheduledJOB } from "@sharemyride/shared";
import { Client } from "@upstash/qstash";

/**
 * Infrastructure implementation of ISchedulerService using Upstash QStash.
 * Publishes delayed job callbacks to target webhooks.
 */
export class ScheduledJobService implements ISchedulerService {
  private readonly _client: Client;

  constructor(
    baseUrl: string = AppConfig.QSTASH_URL,
    token: string = AppConfig.QSTASH_TOKEN,
  ) {
    this._client = new Client({
      baseUrl,
      token,
    });
  }

  /**
   * Publishes a delayed JSON job payload to QStash.
   *
   * @param job Scheduled job details (webhookUrl, body, delaySeconds, retries)
   */
  async scheduleJob<BodyType>(job: ScheduledJOB<BodyType>): Promise<void> {
    await this._client.publishJSON({
      url: job.webhookUrl,
      body: job.body,
      delay: job.delaySeconds,
      retries: job.retries,
    });
  }
}
