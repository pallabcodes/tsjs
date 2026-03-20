export interface OutputBuffer {
  append(chunk: Buffer): void;
  snapshot(): string;
  clear(): void;
  dispose(): void;
}
