import { Response } from "express";

export class SSEManager {
  private clients: Response[] = [];

  addClient(res: Response): void {
    this.clients.push(res);
    res.on("close", () => {
      this.clients = this.clients.filter((client) => client !== res);
    });
  }

  sendEvent(data: any): void {
    this.clients.forEach((res) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
}
