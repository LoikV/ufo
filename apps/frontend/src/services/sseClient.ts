import type { UfoUpdate } from '../types/ufo';

type UfoUpdateHandler = (ufo: UfoUpdate) => void;
type ErrorHandler = (error: Error) => void;
type OpenHandler = () => void;

export class SSEClient {
  private eventSource: EventSource | null = null;
  private updateHandlers: Set<UfoUpdateHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private openHandlers: Set<OpenHandler> = new Set();

  constructor(
    private readonly url: string,
    private readonly apiKey: string
  ) {}

  connect(): void {
    if (this.eventSource) {
      return;
    }

    const urlWithKey = `${this.url}?key=${encodeURIComponent(this.apiKey)}`;
    this.eventSource = new EventSource(urlWithKey);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as UfoUpdate;
        this.notifyUpdateHandlers(data);
      } catch (error) {
        console.error('SSE parse error:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      this.notifyErrorHandlers(new Error('SSE connection error'));
    };

    this.eventSource.onopen = () => {
      this.notifyOpenHandlers();
    };
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  get isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  get readyState(): number {
    return this.eventSource?.readyState ?? EventSource.CLOSED;
  }

  onUpdate(handler: UfoUpdateHandler): () => void {
    this.updateHandlers.add(handler);
    return () => this.updateHandlers.delete(handler);
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  onOpen(handler: OpenHandler): () => void {
    this.openHandlers.add(handler);
    return () => this.openHandlers.delete(handler);
  }

  private notifyUpdateHandlers(data: UfoUpdate): void {
    this.updateHandlers.forEach((handler) => handler(data));
  }

  private notifyErrorHandlers(error: Error): void {
    this.errorHandlers.forEach((handler) => handler(error));
  }

  private notifyOpenHandlers(): void {
    this.openHandlers.forEach((handler) => handler());
  }
}
