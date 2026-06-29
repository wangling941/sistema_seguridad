import { Response } from "express";

export class SSEManager {
  private clients: Response[] = [];

  addClient(res: Response): void {
    this.clients.push(res);
    console.log(`✅ Cliente SSE agregado. Total: ${this.clients.length}`);

    // Enviar un ping inmediato para mantener la conexión
    if (!res.writableEnded) {
      res.write(": connected\n\n");
      console.log("📡 Ping inicial enviado");
    }

    // Enviar ping cada 10 segundos
    const interval = setInterval(() => {
      if (!res.writableEnded) {
        res.write(": ping\n\n");
        console.log("📡 Ping enviado a un cliente");
      } else {
        clearInterval(interval);
        console.log("⚠️ Cliente cerrado, eliminando ping");
      }
    }, 10000);

    res.on("close", () => {
      clearInterval(interval);
      this.clients = this.clients.filter((client) => client !== res);
      console.log(`❌ Cliente SSE desconectado. Total: ${this.clients.length}`);
    });
  }

  sendEvent(data: any): void {
    console.log(
      `📤 Enviando evento a ${this.clients.length} cliente(s):`,
      data.type,
    );
    this.clients.forEach((res, index) => {
      if (!res.writableEnded) {
        try {
          res.write(`data: ${JSON.stringify(data)}\n\n`);
          console.log(`✅ Evento ${data.type} enviado al cliente ${index + 1}`);
        } catch (error) {
          console.error(
            `❌ Error enviando evento al cliente ${index + 1}:`,
            error,
          );
        }
      }
    });
  }
}
