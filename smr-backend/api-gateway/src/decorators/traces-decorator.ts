import { Span, SpanStatusCode, trace } from "@opentelemetry/api";

/**
 * This decorator wraps the underlying method to execute it
 * inside the opentelemetry trace span.
 *
 * (This is for being used in controllers to decorate the methods calling the use cases)
 *
 * @param moduleName : The controller module name
 * @param actionName : The action being done (use case name)
 */
export function Trace(moduleName: string) {
  //we use factory pattern to return the actual decorator method
  return function (
    originalMethod: Function,
    context: ClassMethodDecoratorContext,
  ) {
    //first we get ourselves the otel instance to trace requests
    const tracer = trace.getTracer(moduleName);

    //we replace the original fucntion logic to add our own
    function replacementMethod(this: unknown, ...args: unknown[]) {
      //extract the method name to keep things simple
      const methodName = String(context.name);

      return tracer.startActiveSpan(methodName, (span: Span) => {
        try {
          const result = originalMethod.call(this, ...args);
          span.setStatus({ code: SpanStatusCode.OK });
          return result;
        } catch (error) {
          span.setStatus({ code: SpanStatusCode.ERROR });
          span.recordException(error as Error);
          throw error;
        } finally {
          span.end();
        }
      });
    }

    return replacementMethod;
  };
}
