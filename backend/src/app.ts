import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { router } from "./interfaces/http/routes";
import { errorHandler } from "./interfaces/http/middlewares/errorHandler";
import { SSEManager } from "./infrastructure/streaming/SSEManager";
import { setupNotificationSubscriber } from "./interfaces/subscribers/notificationSubscriber";
import { eventEmitter } from "./interfaces/http/dependencies";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Eventos y SSE
const sseManager = new SSEManager();
setupNotificationSubscriber(eventEmitter, sseManager);

// Ruta SSE para notificaciones en tiempo real
app.get("/api/events", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  sseManager.addClient(res);
});

// Rutas API
app.use("/api", router);

// Manejador de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
