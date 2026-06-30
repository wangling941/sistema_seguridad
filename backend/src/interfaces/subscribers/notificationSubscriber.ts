import { IEventEmitter } from "../../application/ports/services/IEventEmitter";
import { SSEManager } from "../../infrastructure/streaming/SSEManager";

export const setupNotificationSubscriber = (
  eventEmitter: IEventEmitter,
  sseManager: SSEManager,
) => {
  // 🔹 Evento para accesos
  eventEmitter.on("access.created", (data) => {
    console.log("📥 Evento 'access.created' recibido en subscriber:", data);
    sseManager.sendEvent({
      type: "ACCESS_CREATED",
      payload: data,
    });
  });

  // 🔹 Evento para vehículos
  eventEmitter.on("vehicle.created", (data) => {
    console.log("🚗 Evento 'vehicle.created' recibido en subscriber:", data);
    sseManager.sendEvent({
      type: "VEHICLE_CREATED",
      payload: data,
    });
  });

  // 🔹 Evento para residentes
  eventEmitter.on("resident.created", (data) => {
    console.log("🏠 Evento 'resident.created' recibido en subscriber:", data);
    sseManager.sendEvent({
      type: "RESIDENT_CREATED",
      payload: data,
    });
  });

  console.log("✅ Subscriber configurado: ACCESS, VEHICLE, RESIDENT");
};
