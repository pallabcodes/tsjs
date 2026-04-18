import { BinaryHeap } from './heap-lab/core/BinaryHeap';

type MatchEvent = {
  source: string;
  timestamp: number;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
};

// Min-heap by timestamp
const eventHeap = new BinaryHeap<MatchEvent>((a, b) => a.timestamp - b.timestamp);

function generateMockFeed(source: string, count: number): MatchEvent[] {
  const matches: MatchEvent[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    matches.push({
      source,
      timestamp: now + Math.floor(Math.random() * 10000),
      teamA: `Team${Math.floor(Math.random() * 10)}`,
      teamB: `Team${Math.floor(Math.random() * 10)}`,
      scoreA: Math.floor(Math.random() * 5),
      scoreB: Math.floor(Math.random() * 5),
    });
  }
  return matches.sort((a, b) => a.timestamp - b.timestamp);
}

const feeds = [
  generateMockFeed('ESPN', 10),
  generateMockFeed('SofaScore', 10),
  generateMockFeed('FotMob', 10),
];

const iterators = feeds.map((feed) => feed[Symbol.iterator]());
const currentHeads = iterators.map((it) => it.next());

for (let i = 0; i < currentHeads.length; i++) {
  const head = currentHeads[i];
  if (!head.done && head.value) {
    eventHeap.insert({
      source: feeds[i][0].source,
      timestamp: head.value.timestamp,
      teamA: head.value.teamA,
      teamB: head.value.teamB,
      scoreA: head.value.scoreA,
      scoreB: head.value.scoreB,
    });
  }
}

while (!eventHeap.isEmpty()) {
  const nextEvent = eventHeap.extract();
  if (!nextEvent) break;
  console.log(
    `[${nextEvent.source}] ${nextEvent.teamA} vs ${nextEvent.teamB} (${nextEvent.scoreA}:${
      nextEvent.scoreB
    }) at ${new Date(nextEvent.timestamp).toISOString()}`,
  );

  const sourceIndex = feeds.findIndex((feed) => feed[0].source === nextEvent.source);
  if (sourceIndex !== -1) {
    const nextFromSame = iterators[sourceIndex].next();
    if (!nextFromSame.done) {
      eventHeap.insert({ ...nextFromSame.value, source: nextEvent.source });
    }
  }
}

console.log(
  'All events processed.',
  eventHeap.size(),
  'remaining in heap.',
  eventHeap.toArray().length,
  'events in heap array.',
  eventHeap.toArray(),
  'heap string representation.',
);
