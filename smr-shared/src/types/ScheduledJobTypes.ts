export interface ScheduledJOB<BodyType> {
  webhookUrl: string;
  body: BodyType;
  delaySeconds: number;
  retries: number;
}
