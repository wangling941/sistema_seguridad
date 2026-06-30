import { Response } from "express";

export class SSEManager {
  private clients: Response[] = [];

  addClient(res: Response): void {
    this.clients.push(res);
    console.log(`✅ Cliente SSE agregado. Total: ${this.clients.length}`);

    if (!res.writableEnded) {
      res.write(": connected\n\n");
    }

    const interval = setInterval(() => {
      if (!res.writableEnded) {
        res.write(": ping\n\n");
      } else {
        clearInterval(interval);
      }
    }, 10000);

    res.on("close", () => {
      clearInterval(interval);
      this.clients = this.clients.filter((client) => client !== res);
      console.log(`❌ Cliente SSE desconectado. Total: ${this.clients.length}`);
    });
  }

  sendEvent(data: any): void {
    const clientsCount = this.clients.length;
    console.log(`📤 Enviando evento a ${clientsCount} cliente(s):`, data.type);

    if (clientsCount === 0) {
      console.warn("⚠️ No hay clientes SSE conectados para enviar el evento");
      return;
    }

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
      } else {
        console.log(`⚠️ Cliente ${index + 1} ya cerrado`);
      }
    });
  }
}
