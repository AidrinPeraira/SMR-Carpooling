import { NodeSDK } from "@opentelemetry/sdk-node";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { AppConfig } from "#/application.config";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const otlpHeaders = {
  Authorization: `Basic ${AppConfig.OTEL_EXPORTER_OTLP_HEADERS}`,
};
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: AppConfig.SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: AppConfig.SERVICE_VERSION,
  }),

  traceExporter: new OTLPTraceExporter({
    url: `${AppConfig.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    headers: otlpHeaders,
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${AppConfig.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
      headers: otlpHeaders,
    }),
    exportIntervalMillis: AppConfig.NODE_ENV == "production" ? 10000 : 20000,
  }),

  logRecordProcessors: [
    new SimpleLogRecordProcessor({
      exporter: new OTLPLogExporter({
        url: `${AppConfig.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`,
        headers: otlpHeaders,
      }),
    }),
  ],

  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-host-metrics": { enabled: true },
      "@opentelemetry/instrumentation-winston": {
        enabled: true,
        disableLogSending: false,
      },
    }),
  ],
});

sdk.start();
