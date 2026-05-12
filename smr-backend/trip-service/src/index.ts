import "dotenv/config";
import { createApp } from "@/app";
import { AppConfig } from "@/application.config";

async function startServer(): Promise<void> {
  const app = createApp();
  const PORT = Number(AppConfig.PORT);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The trip-service is running at port: ${PORT}.`);
  });
}

startServer().catch((error: unknown) => {
  console.log("Error: Failed to start the trip-service server: ", error);
});
