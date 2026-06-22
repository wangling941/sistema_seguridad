import { EventEmitter as NodeEventEmitter } from "events";
import { IEventEmitter } from "../../application/ports/services/IEventEmitter";

export class EventEmitter implements IEventEmitter {
  private emitter = new NodeEventEmitter();

  emit(event: string, data: any): void {
    this.emitter.emit(event, data);
  }

  on(event: string, listener: (data: any) => void): void {
    this.emitter.on(event, listener);
  }
}
