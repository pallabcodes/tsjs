export function getExponentialBackoffDelay(attempt: number): number {
  return Math.min(2 ** attempt * 1000, 60_000); // cap at 60s
}
