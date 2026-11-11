import { AppConfig } from "#/application.config";
import { metrics } from "@opentelemetry/api";
import { NextFunction, Request, Response } from "express";

//initialise metrics

const meter = metrics.getMeter(
  AppConfig.SERVICE_NAME,
  AppConfig.SERVICE_VERSION,
);

//initialise variables for everything we want to track
const requestCounter = meter.createCounter(
  `http.${AppConfig.SERVICE_NAME}.requests.total`,
  {
    description: "Total number of http requests recieved",
  },
);

const requestDuration = meter.createHistogram(
  `http.${AppConfig.SERVICE_NAME}.requests.duration`,
  {
    description: "Http request duration in milliseconds",
  },
);

const activeRequests = meter.createUpDownCounter(
  `http.${AppConfig.SERVICE_NAME}.requests.active`,
  { description: "Number of in-flight HTTP requests" },
);

/**
 * This middleware tracks all http requests and
 * sends data via opentelemetry
 */
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();

  //collelct all needed info from request
  const attributes = {
    "http.method": req.method,
    "http.route": req.path,
  };

  activeRequests.add(1, attributes);

  //set up event lisitiner to update details when a requst completes
  res.on("finish", () => {
    const finalAttribute = {
      ...attributes,
      "http.status_code": String(res.statusCode),
    };

    requestCounter.add(1, finalAttribute);
    requestDuration.record(Date.now() - startTime, finalAttribute);
    activeRequests.add(-1, attributes);
  });

  next();
}
