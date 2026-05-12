import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });

  //global error handler
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log("err");

    res.status(500).json({ success: false });

    next();
  });

  return app;
}
