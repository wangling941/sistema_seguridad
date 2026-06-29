import { Response } from "express";

export class SSEManager {
  private clients: Response[] = [];

  addClient(res: Response): void {
    this.clients.push(res);
    console.log(
      `✅ Cliente SSE agregado. Total clientes: ${this.clients.length}`,
    );

    // Enviar un ping cada 15 segundos para mantener la conexión viva
    const interval = setInterval(() => {
      if (!res.writableEnded) {
        res.write(": ping\n\n");
        console.log("📡 Ping enviado a un cliente");
      } else {
        clearInterval(interval);
        console.log("⚠️ Cliente cerrado, eliminando ping");
      }
    }, 15000);

    res.on("close", () => {
      clearInterval(interval);
      this.clients = this.clients.filter((client) => client !== res);
      console.log(
        `❌ Cliente SSE desconectado. Total clientes: ${this.clients.length}`,
      );
    });

    // Enviar un evento inicial para probar la conexión
    setTimeout(() => {
      if (!res.writableEnded) {
        res.write(
          `data: ${JSON.stringify({ type: "CONNECTED", payload: { message: "SSE conectado" } })}\n\n`,
        );
        console.log("📤 Evento CONNECTED enviado al cliente");
      }
    }, 1000);
  }

  sendEvent(data: any): void {
    console.log(
      `📤 Enviando evento a ${this.clients.length} cliente(s):`,
      data,
    );
    this.clients.forEach((res, index) => {
      if (!res.writableEnded) {
        try {
          res.write(`data: ${JSON.stringify(data)}\n\n`);
          console.log(`✅ Evento enviado al cliente ${index + 1}`);
        } catch (error) {
          console.error(
            `❌ Error enviando evento al cliente ${index + 1}:`,
            error,
          );
        }
      } else {
        console.log(`⚠️ Cliente ${index + 1} ya está cerrado`);
      }
    });
  }
}
