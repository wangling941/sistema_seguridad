export interface IEventEmitter {
  emit(event: string, data: any): void;
  on(event: string, listener: (data: any) => void): void;
}
