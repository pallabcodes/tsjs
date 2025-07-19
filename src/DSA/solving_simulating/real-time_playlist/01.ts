// --- Recommendation Engine Stubs ---
/**
 * Automatically updates a playlist to include top recommended and trending tracks for a user.
 * DSA: Hash map lookup, set operations, array merge (O(N)).
 * Time complexity: O(N) for recommendations and trending tracks.
 * Space complexity: O(N) for new playlist state.
 * Rationale: Enables "smart playlists" that adapt to user taste and trends.
 */
function autoUpdateSmartPlaylist(userId: string, playlistId: string, editLog: PlaylistEditLog) {
  // Get current playlist state
  const playlist = new CollaborativePlaylist();
  playlist.replayLog(editLog.getLog());
  // Get recommendations for user
  const recs = getRecommendations(userId);
  // For demo, trending tracks are top 3 most added tracks
  const trackPopularity = editLog.getTrackPopularity();
  const trending = Object.entries(trackPopularity)
    .sort((a, b) => b[1].added - a[1].added)
    .map(([trackId]) => trackId)
    .filter(trackId => !unavailableTracks.has(trackId));
  const trendingTop3 = trending.slice(0, 3);
  // Merge recommendations and trending tracks, exclude already present
  const toAdd = [...new Set([...recs, ...trendingTop3])].filter(trackId => !playlist.find(trackId));
  // Add tracks to playlist
  for (const trackId of toAdd) {
    addTrack(userId, trackId, undefined, { playlistId }, playlistId);
  }
}
/**
 * Deletes a playlist and all associated data (edit logs, permissions, privacy).
 * DSA: Hash map delete (O(1)), array filter (O(N)).
 * Time complexity: O(N) for log filtering, O(1) for map deletes.
 * Space complexity: O(N) for filtered logs.
 * Rationale: Ensures complete removal for privacy and compliance.
 */
function deletePlaylist(playlistId: string, editLog: PlaylistEditLog) {
  // Remove permissions and privacy
  playlistPermissions.delete(playlistId);
  playlistPrivacy.delete(playlistId);
  editLog.removePlaylistEvents(playlistId);
}

/**
 * Deletes a user/account and all associated data (edit logs, permissions, preferences, recommendations).
 * DSA: Hash map delete (O(1)), array filter (O(N)).
 * Time complexity: O(N) for log filtering, O(1) for map deletes.
 * Space complexity: O(N) for filtered logs.
 * Rationale: GDPR compliance and privacy enforcement.
 */
function deleteUser(userId: string, editLog: PlaylistEditLog) {
  // Remove user from all playlist permissions
  for (const perms of playlistPermissions.values()) {
    perms.delete(userId);
  }
  // Remove user preferences and recommendations
  userPreferences.delete(userId);
  recommendations.delete(userId);
  editLog.removeUserEvents(userId);
}
/**
 * Removes a track globally from all playlists and recommendations (e.g., DMCA/copyright takedown).
 * DSA: Hash map + set update (O(N) for playlists, O(M) for recommendations).
 * Time complexity: O(N + M) where N = number of playlists, M = number of users.
 * Space complexity: O(1) for unavailableTracks set, O(N + M) for updates.
 * Rationale: Ensures instant compliance and user experience integrity.
 */
function removeTrackGlobally(trackId: string) {
  // Mark track as unavailable
  unavailableTracks.add(trackId);
  // Remove from all playlists (by replaying logs, future adds will be blocked)
  // Remove from all recommendations
  for (const [userId, recs] of recommendations.entries()) {
    recommendations.set(userId, recs.filter(tid => tid !== trackId));
  }
  // Optionally, remove from user preferences
  for (const [userId, prefs] of userPreferences.entries()) {
    prefs.delete(trackId);
  }
  // Optionally, log the removal event for audit
  // (Not added to editLog, as it's a global operation outside collaborative playlist scope)
}
// --- Edge Case Config ---
const MAX_PLAYLIST_SIZE = 1000;
const unavailableTracks = new Set<string>(["trackX", "trackY"]); // Example unavailable tracks
// These are minimal implementations to resolve TypeScript errors and enable event-driven integration.
// --- Access Control & Privacy Types ---
type PlaylistRole = "owner" | "collaborator" | "viewer";
type PrivacyLevel = "private" | "public" | "unlisted";


// playlistPermissions: Map<playlistId, Map<userId, PlaylistRole>>
const playlistPermissions: Map<string, Map<string, PlaylistRole>> = new Map();
// playlistPrivacy: Map<playlistId, PrivacyLevel>
const playlistPrivacy: Map<string, PrivacyLevel> = new Map();

/**
 * Adds a user as collaborator or viewer to a playlist.
 * DSA: Hash map update (O(1)).
 * Time complexity: O(1).
 * Space complexity: O(1).
 */
function addUserToPlaylist(playlistId: string, userId: string, role: PlaylistRole) {
  if (!playlistPermissions.has(playlistId)) playlistPermissions.set(playlistId, new Map());
  playlistPermissions.get(playlistId)!.set(userId, role);
}

/**
 * Removes a user from a playlist (any role).
 * DSA: Hash map delete (O(1)).
 * Time complexity: O(1).
 * Space complexity: O(1).
 */
function removeUserFromPlaylist(playlistId: string, userId: string) {
  const perms = playlistPermissions.get(playlistId);
  if (perms) perms.delete(userId);
}

/**
 * Changes the owner of a playlist.
 * DSA: Hash map update (O(1)).
 * Time complexity: O(1).
 * Space complexity: O(1).
 * Rationale: Only one owner per playlist.
 */
function changePlaylistOwner(playlistId: string, newOwnerId: string) {
  if (!playlistPermissions.has(playlistId)) playlistPermissions.set(playlistId, new Map());
  // Remove previous owner
  const perms = playlistPermissions.get(playlistId)!;
  for (const [uid, role] of perms.entries()) {
    if (role === "owner") perms.set(uid, "collaborator");
  }
  perms.set(newOwnerId, "owner");
}

/**
 * Changes the privacy level of a playlist.
 * DSA: Hash map update (O(1)).
 * Time complexity: O(1).
 * Space complexity: O(1).
 */
function changePlaylistPrivacy(playlistId: string, privacy: PrivacyLevel) {
  playlistPrivacy.set(playlistId, privacy);
}

/**
 * Checks if a user can edit a playlist (owner or collaborator).
 * DSA: Hash map lookup (O(1)).
 * Time complexity: O(1).
 * Space complexity: O(1).
 * Rationale: Fast permission checks for real-time collaborative editing.
 */
function canEdit(userId: string, playlistId: string): boolean {
  const perms = playlistPermissions.get(playlistId);
  if (!perms) return false;
  const role = perms.get(userId);
  return role === "owner" || role === "collaborator";
}

/**
 * Checks if a user can view a playlist (public or explicit permission).
 * DSA: Hash map lookup (O(1)).
 * Time complexity: O(1).
 * Space complexity: O(1).
 * Rationale: Efficient privacy enforcement for large-scale sharing.
 */
function canView(userId: string, playlistId: string): boolean {
  const privacy = playlistPrivacy.get(playlistId);
  if (privacy === "public") return true;
  const perms = playlistPermissions.get(playlistId);
  if (!perms) return false;
  return perms.has(userId);
}


/**
 * User preferences: Map<userId, Map<trackId, score>>
 * DSA: Hash map for fast per-user, per-track score lookup (O(1)).
 */
const userPreferences: Map<string, Map<string, number>> = new Map();

/**
// User context: Map<userId, context> (for context-aware recommendations)
const userContextDSAMap: Map<string, string> = new Map();
// User context: Map<userId, context> (for context-aware recommendations)
const userContextDSAMap: Map<string, string> = new Map();

// User context: Map<userId, context> (for context-aware recommendations)
const userContextMap: Map<string, string> = new Map();
 * Recommendations: Map<userId, string[]>
 * DSA: Hash map for per-user recommendations, array for ordered tracks.
 * Could use MinHeap for top-N selection in production.
 */
const recommendations: Map<string, string[]> = new Map();

/**
 * Region-based trending tracks: Map<region, MaxHeap<trackId, count>>
 * DSA: Hash map for region lookup, max heap for trending selection.
 */
const regionTrending: Map<string, Array<{ trackId: string; count: number }>> = new Map();

/**
 * User region: Map<userId, region>
 * DSA: Hash map for fast region lookup.
 */
const userRegion: Map<string, string> = new Map();


/**
 * Updates user preferences for a track based on action.
 * DSA: Hash map update (O(1)).
 * Rationale: Real-time feedback for recommendations.
 * @param userId - User performing the action
 * @param trackId - Track affected
 * @param action - "like", "dislike", "skip", "play"
 * @param context - Optional context (e.g., "workout")
 */
// User context: Map<userId, context> (for context-aware recommendations)
const userContextDSA: Map<string, string> = new Map();
function updateUserPreferences(userId: string, trackId: string, action: string, context?: string) {
  if (!userPreferences.has(userId)) userPreferences.set(userId, new Map());
  const prefs = userPreferences.get(userId)!;
  const currentScore = prefs.get(trackId) || 0;
  let delta = 0;
  switch (action) {
    case "like": delta = 10; break;
    case "dislike": delta = -20; break;
    case "skip": delta = -5; break;
    case "play": delta = 1; break;
    default: delta = 0;
  }
  // Context-aware boost
  if (context && userContextDSA.get(userId) === context) {
    delta += 3; // Small boost for matching context
  }
  prefs.set(trackId, currentScore + delta);
}

/**
 * Updates recommendations for a user using collaborative filtering, trending-in-region, and context-aware logic.
 * DSA: Hash map for user preferences, array for similarity, max heap for trending, hash map for context.
 * Algorithms: User-user similarity (cosine), trending selection, context boost.
 * Time complexity: O(N) for user similarity, O(M) for trending, O(1) for context.
 * Space complexity: O(N + M).
 * Rationale: Real-world recommendation engine, DSA mastery.
 * @param userId - User to update recommendations for
 */
function updateRecommendations(userId: string) {
  const prefs = userPreferences.get(userId);
  if (!prefs) return;
  // --- 1. Collaborative Filtering (User-User Similarity) ---
  let similarUsers: string[] = [];
  let maxSim = -Infinity;
  for (const [otherId, otherPrefs] of userPreferences.entries()) {
    if (otherId === userId) continue;
    // Cosine similarity
    let dot = 0, normA = 0, normB = 0;
    for (const [trackId, scoreA] of prefs.entries()) {
      const scoreB = otherPrefs.get(trackId) || 0;
      dot += scoreA * scoreB;
      normA += scoreA * scoreA;
      normB += scoreB * scoreB;
    }
    const sim = normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
    if (sim > maxSim) {
      maxSim = sim;
      similarUsers = [otherId];
    } else if (sim === maxSim) {
      similarUsers.push(otherId);
    }
  }
  // Gather tracks liked by similar users
  const collaborativeTracks = new Set<string>();
  for (const uid of similarUsers) {
    const otherPrefs = userPreferences.get(uid);
    if (!otherPrefs) continue;
    for (const [trackId, score] of otherPrefs.entries()) {
      if (score > 5 && !prefs.has(trackId)) collaborativeTracks.add(trackId);
    }
  }

  // --- 2. Trending-in-Region ---
  const region = userRegion.get(userId) || "global";
  const trendingArr = regionTrending.get(region) || [];
  const trendingTracks = trendingArr
    .sort((a, b) => b.count - a.count)
    .map(t => t.trackId)
    .filter(trackId => !prefs.has(trackId) && !unavailableTracks.has(trackId))
    .slice(0, 3);

  // --- 3. Context-Aware Recommendations ---
  const context = userContextDSA.get(userId);
  const contextTracks: string[] = [];
  if (context) {
    // For demo: boost tracks with context in metadata
    for (const [trackId, score] of prefs.entries()) {
      if (score > 0) contextTracks.push(trackId);
    }
  }

  // --- 4. Personal Top Tracks ---
  const personalTop = Array.from(prefs.entries())
    .filter(([trackId]) => !unavailableTracks.has(trackId))
    .sort((a, b) => b[1] - a[1])
    .map(([trackId]) => trackId)
    .slice(0, 5);

  // --- 5. Merge and Deduplicate ---
  const allRecs = [
    ...personalTop,
    ...Array.from(collaborativeTracks),
    ...trendingTracks,
    ...contextTracks
  ];
  const deduped = Array.from(new Set(allRecs));
  recommendations.set(userId, deduped.slice(0, 10));
}

/**
 * Returns recommendations for a user (top 10 tracks).
 * DSA: Hash map lookup (O(1)), array for ordered tracks.
 * Rationale: Fast access for playback and smart playlist automation.
 * @param userId - User to get recommendations for
 */
function getRecommendations(userId: string): string[] {
  return recommendations.get(userId) || [];
}

/**
 * Updates region trending data when a track is played/liked.
 * DSA: Hash map for region, array for counts (could use MaxHeap in prod).
 * @param region - Region name
 * @param trackId - Track played/liked
 */
function updateRegionTrending(region: string, trackId: string) {
  if (!regionTrending.has(region)) regionTrending.set(region, []);
  const arr = regionTrending.get(region)!;
  const found = arr.find(t => t.trackId === trackId);
  if (found) {
    found.count++;
  } else {
    arr.push({ trackId, count: 1 });
  }
}

/**
 * Sets user region for recommendation purposes.
 * DSA: Hash map update (O(1)).
 * @param userId - User
 * @param region - Region name
 */
function setUserRegion(userId: string, region: string) {
  userRegion.set(userId, region);
}

/**
 * Sets user context (e.g., "workout", "chill") for context-aware recommendations.
 * DSA: Hash map update (O(1)).
 * @param userId - User
 * @param context - Context string
 */
function setUserContext(userId: string, context: string) {
  userContextDSA.set(userId, context);
}
// 🎵 Scenario: Real-Time Playlist & Recommendation Engine
// Story/Scenario
// You’re a backend engineer at a music streaming company (like Spotify).
// Your team is tasked with building a real-time playlist and recommendation engine that:

// Lets users create, update, and share playlists.
// Supports “smart playlists” that auto-update based on user listening habits, trending tracks, or collaborative filtering.
// Needs to efficiently handle millions of users, each with hundreds of playlists and thousands of tracks.
// Must recommend the next song instantly, even as users skip, like, or dislike tracks in real time.

// Breakdown / Observations

// Breakdown / Observations (Deep-Dive, All Scenarios & Edge Cases)

// --- Playlist Management ---
// - Playlists can be personal, collaborative, or public.
// - Track order matters (users expect O(1) skip/rewind).
// - Can a playlist have duplicate tracks? (If yes, how are they identified?)
// - Per-track metadata: addedBy, addedAt, custom notes.
// - Concurrent edits: Two users may add/remove/reorder at the same time (race conditions, merge conflicts).
// - Undo/Redo: Users may want to undo/redo playlist changes.
// - Large playlists: Playlists may have thousands of tracks (performance, memory).
// - Track not available in region: Some tracks may be region-locked.
// - Playlist deleted while user is listening.
// - Playlist sharing: Who can view/edit? (access control)
// - Playlist privacy: Private, public, unlisted options.

// --- Track Management ---
// - Track removal globally: If a track is removed (copyright, DMCA), it must disappear from all playlists and recommendations instantly.
// - Track popularity: Tracks can trend up/down rapidly (viral moments).
// - Track metadata changes: Track info (title, artist) may update.
// - Track added, then removed globally before user plays it.
// - Track not available in user’s region/device.
// - Track versioning: Remixes, explicit/clean versions.

// --- User Actions ---
// - Skip, like, dislike, repeat: Each action should update recommendations in real time.
// - Listening history: Used for recommendations, “recently played”, and “smart playlists”.
// - Offline mode: Users may edit playlists offline, then sync later (conflict resolution).
// - Multiple devices: Same user may edit/listen from multiple devices at once.
// - User tries to add a track that’s already in the playlist (allowed? rejected?).
// - Simultaneous add/remove of the same track by different users.
// - Track order conflicts in collaborative playlists.
// - User loses connection mid-edit, then reconnects.
// - Track metadata changes while playing.
// - User deletes account (GDPR): All playlists/history must be deleted.

// --- Recommendation Engine ---
// - Personalization: Recommendations must adapt to user’s taste, time of day, context (workout, chill, etc.).
// - Real-time updates: As user skips/likes/dislikes, recommendations must update instantly.
// - Trending/trending-in-region: Recommendations may include trending tracks globally or locally.
// - Collaborative filtering: “People like you also listen to...”
// - Cold start: New users with no history.
// - Exclude tracks already played/disliked by user.

// --- Performance & Scale ---
// - Millions of users, thousands of playlists per user, tens of thousands of tracks.
// - Low latency: Next track must be recommended in <100ms.
// - Efficient memory/storage: Can’t keep everything in RAM.
// - Sharding/partitioning for distributed systems.

// --- Security & Privacy ---
// - Access control: Only playlist owners/collaborators can edit.
// - Private playlists: Not visible to others.
// - GDPR/Right to be forgotten: User data may need to be deleted on request.
// - Audit logs for playlist edits (who did what, when).

// --- Edge Cases ---
// - Track added, then removed globally before user plays it.
// - Playlist deleted while user is listening.
// - User tries to add a track that’s already in the playlist (allowed? rejected?).
// - Simultaneous add/remove of the same track by different users.
// - Track order conflicts in collaborative playlists.
// - User loses connection mid-edit, then reconnects.
// - Track metadata changes while playing.
// - User edits playlist offline, then syncs with conflicting changes.
// - Track becomes region-locked after being added to playlist.
// - User tries to play a track that is no longer available.
// - Playlist reaches maximum allowed size.
// - Recommendations include tracks that are no longer available.


// Data Structures:
// - playlists: Map<playlistId, DoublyLinkedList<trackId>>
// - userToPlaylists: Map<userId, Set<playlistId>>
// - trackPopularity: MaxHeap<trackId, playCount>
// - recommendations: Map<userId, MinHeap<trackId, score>>

// Operations:
// function addTrackToPlaylist(playlistId, trackId)
// function removeTrackFromPlaylist(playlistId, trackId)
// function getNextRecommendedTrack(userId)
// function updateRecommendations(userId, feedback)
// function removeTrackGlobally(trackId)


// Step-by-Step Plan
// Implement a Doubly Linked List for playlist tracks (efficient add/remove, O(1) skip/prev).
// Implement a MaxHeap for trending tracks.
// Implement a MinHeap for per-user recommendations.
// Implement playlist and recommendation update logic.
// Handle global track removal efficiently.

// Reflection
// Patterns used: Doubly linked list, heap, hash map, event-driven updates, real-time rebalancing.
// Real-world: Mirrors Spotify’s playlist, queue, and recommendation systems.

/**
 * Why Doubly Linked List (DLL) for Playlists?
 * 
 * Add (append): O(1) -> You always know the tail, so you can add a new track at the end in constant time.
 * 
 * Remove: O(1)
 * If you already have a reference to the node (track), you can unlink it in O(1) by updating its prev and next pointers 
 * Caveat: If you only know the value (trackId), you must search for it (O(N)). But if you store or pass the node reference (as in collaborative edits or undo/redo), removal is O(1).
 * 
 * Skip/Next: O(1)
 * Move to the next track by following the next pointer.
 * Rewind/Prev: O(1)
 * Move to the previous track by following the prev pointer.
 * 
 * Summary:
 * DLL gives O(1) add/remove/skip/rewind if you have the node reference.
 * If you only have the value, you need to search (O(N)), but most playlist operations (like playing, skipping, collaborative edits) can keep track of the node.
 * This is why DLL is the backbone for efficient playlist management in real-world systems!
 * 
*/

// --- Doubly Linked List Node ---
class DLLNode<T> {
  value: T;
  prev: DLLNode<T> | null = null;
  next: DLLNode<T> | null = null;
  metadata?: any;
  constructor(value: T, metadata?: any) {
    this.value = value;
    this.metadata = metadata;
  }
}

// --- Doubly Linked List with Fast Search Index ---
class DoublyLinkedList<T> {
  head: DLLNode<T> | null = null;
  tail: DLLNode<T> | null = null;
  size: number = 0;

  // Change from private to protected
  protected index: Map<T, Set<DLLNode<T>>> = new Map();

  append(value: T, metadata?: any): DLLNode<T> {
    const node = new DLLNode(value, metadata);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      if (this.tail) this.tail.next = node;
      this.tail = node;
    }
    this.size++;

    // Add to index
    if (!this.index.has(value)) this.index.set(value, new Set());
    this.index.get(value)!.add(node);

    return node;
  }

  remove(node: DLLNode<T>): void {
    // Remove from index
    const nodes = this.index.get(node.value);
    if (nodes) {
      nodes.delete(node);
      if (nodes.size === 0) this.index.delete(node.value);
    }

    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;
    node.prev = node.next = null;
    this.size--;
  }

  // O(1) find all nodes for a trackId (supports duplicates)
  findAll(value: T): Set<DLLNode<T>> | undefined {
    return this.index.get(value);
  }

  // O(1) find first node for a trackId (if any)
  find(value: T): DLLNode<T> | null {
    const nodes = this.index.get(value);
    // Fix: Return null if nodes is undefined or empty
    if (!nodes || nodes.size === 0) return null;
    const iterator = nodes.values();
    const result = iterator.next();
    return result.done ? null : result.value;
  }

  // O(1) skip/rewind
  next(node: DLLNode<T>): DLLNode<T> | null {
    return node.next;
  }
  prev(node: DLLNode<T>): DLLNode<T> | null {
    return node.prev;
  }

  toArray(): T[] {
    const arr: T[] = [];
    let curr = this.head;
    while (curr) {
      arr.push(curr.value);
      curr = curr.next;
    }
    return arr;
  }
}

// --- 1. Edit Event Type ---
type EditEvent = {
  opId: string;
  userId: string;
  timestamp: number;
  operation: "add" | "remove" | "move" | "update";
  trackId: string;
  position?: number;
  metadata?: any;
};

// --- 2. Edit Log with Undo/Redo ---
class PlaylistEditLog {
  /**
   * Returns the full edit history for a given track.
   * DSA: Hash map lookup (O(N) scan, but can be indexed for O(1) if needed).
   * Rationale: Enables audit, debugging, and per-track analytics.
   */
  getTrackEditHistory(trackId: string): EditEvent[] {
    return this.log.filter(e => e.trackId === trackId);
  }

  /**
   * Detects potential conflicts: simultaneous edits (same timestamp) on the same track by different users.
   * DSA: Hash map + scan (O(N)).
   * Rationale: Identifies race conditions and merge conflicts in collaborative editing.
   */
  getConflicts(): { trackId: string; timestamp: number; users: string[]; events: EditEvent[] }[] {
    const conflictMap = new Map<string, EditEvent[]>();
    for (const e of this.log) {
      const key = `${e.trackId}-${e.timestamp}`;
      if (!conflictMap.has(key)) conflictMap.set(key, []);
      conflictMap.get(key)!.push(e);
    }
    const conflicts = [];
    for (const [key, events] of conflictMap.entries()) {
      const userSet = new Set(events.map(e => e.userId));
      if (userSet.size > 1) {
        const [trackId, timestampStr] = key.split("-");
        conflicts.push({
          trackId,
          timestamp: Number(timestampStr),
          users: Array.from(userSet),
          events
        });
      }
    }
    return conflicts;
  }

  /**
   * Returns undo/redo statistics: number of undos/redos per user.
   * DSA: Hash map + scan (O(N)).
   * Rationale: Tracks user behavior and reliability of collaborative editing.
   */
  getUndoRedoStats(): Record<string, { undos: number; redos: number }> {
    const stats: Record<string, { undos: number; redos: number }> = {};
    for (const e of this.undoStack) {
      stats[e.userId] = stats[e.userId] || { undos: 0, redos: 0 };
      stats[e.userId].undos++;
    }
    for (const e of this.redoStack) {
      stats[e.userId] = stats[e.userId] || { undos: 0, redos: 0 };
      stats[e.userId].redos++;
    }
    return stats;
  }

  /**
   * Returns collaborative session summaries: edits per session (grouped by inactivity gap).
   * DSA: Sequential scan + grouping (O(N)).
   * Rationale: Analyzes user engagement and session-based activity.
   * Session gap threshold: 10 minutes.
   */
  getSessionSummaries(gapMs: number = 10 * 60 * 1000): { userId: string; sessions: { start: number; end: number; count: number }[] }[] {
    const userEvents: Record<string, EditEvent[]> = {};
    for (const e of this.log) {
      if (!userEvents[e.userId]) userEvents[e.userId] = [];
      userEvents[e.userId].push(e);
    }
    const summaries: { userId: string; sessions: { start: number; end: number; count: number }[] }[] = [];
    for (const [userId, events] of Object.entries(userEvents)) {
      const sessions: { start: number; end: number; count: number }[] = [];
      let sessionStart: number | null = null;
      let sessionEnd: number | null = null;
      let sessionCount = 0;
      for (let i = 0; i < events.length; i++) {
        const e = events[i];
        if (sessionStart === null || sessionEnd === null) {
          sessionStart = e.timestamp;
          sessionEnd = e.timestamp;
          sessionCount = 1;
        } else if (e.timestamp - sessionEnd <= gapMs) {
          sessionEnd = e.timestamp;
          sessionCount++;
        } else {
          sessions.push({ start: sessionStart as number, end: sessionEnd as number, count: sessionCount });
          sessionStart = e.timestamp;
          sessionEnd = e.timestamp;
          sessionCount = 1;
        }
      }
      if (sessionStart !== null && sessionEnd !== null) {
        sessions.push({ start: sessionStart as number, end: sessionEnd as number, count: sessionCount });
      }
      summaries.push({ userId, sessions });
    }
    return summaries;
  }
  /**
   * Returns the most active users (top editors) in the log.
   */
  getMostActiveUsers(topN: number = 3): { userId: string; count: number }[] {
    const userCounts: Record<string, number> = {};
    for (const e of this.log) {
      userCounts[e.userId] = (userCounts[e.userId] || 0) + 1;
    }
    return Object.entries(userCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, topN);
  }

  /**
   * Returns track popularity (add/remove counts) within the playlist.
   */
  getTrackPopularity(): Record<string, { added: number; removed: number }> {
    const stats: Record<string, { added: number; removed: number }> = {};
    for (const e of this.log) {
      if (!stats[e.trackId]) stats[e.trackId] = { added: 0, removed: 0 };
      if (e.operation === "add") stats[e.trackId].added++;
      if (e.operation === "remove") stats[e.trackId].removed++;
    }
    return stats;
  }

  /**
   * Returns a timeline histogram of edit activity (bucketed by minute).
   */
  getEditTimeline(): Record<string, number> {
    const timeline: Record<string, number> = {};
    for (const e of this.log) {
      // Bucket by minute
      const bucket = new Date(e.timestamp).toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
      timeline[bucket] = (timeline[bucket] || 0) + 1;
    }
    return timeline;
  }

  /**
   * Returns per-user edit streaks (max consecutive edits without interruption by other users).
   */
  getUserEditStreaks(): Record<string, number> {
    const streaks: Record<string, number> = {};
    let lastUser = null;
    let currentStreak = 0;
    for (const e of this.log) {
      if (e.userId === lastUser) {
        currentStreak++;
      } else {
        if (lastUser) {
          streaks[lastUser] = Math.max(streaks[lastUser] || 0, currentStreak);
        }
        lastUser = e.userId;
        currentStreak = 1;
      }
    }
    if (lastUser) {
      streaks[lastUser] = Math.max(streaks[lastUser] || 0, currentStreak);
    }
    return streaks;
  }
  /**
   * Returns all events in the log, optionally filtered by user, operation, or time range.
   */
  getAuditLog(options?: {
    userId?: string;
    operation?: EditEvent["operation"];
    from?: number;
    to?: number;
  }): EditEvent[] {
    let events = [...this.log];
    if (options) {
      if (options.userId) events = events.filter(e => e.userId === options.userId);
      if (options.operation) events = events.filter(e => e.operation === options.operation);
      if (typeof options.from === "number") events = events.filter(e => e.timestamp >= options.from!);
      if (typeof options.to === "number") events = events.filter(e => e.timestamp <= options.to!);
    }
    return events;
  }

  /**
   * Reconstructs playlist state at a given timestamp.
   * Returns a CollaborativePlaylist instance.
   */
  getPlaylistStateAt(timestamp: number): CollaborativePlaylist {
    const events = this.log.filter(e => e.timestamp <= timestamp);
    const playlist = new CollaborativePlaylist();
    playlist.replayLog(events);
    return playlist;
  }

  /**
   * Returns a summary of actions performed by a user.
   */
  getUserActionSummary(userId: string): { operation: string; count: number }[] {
    const userEvents = this.log.filter(e => e.userId === userId);
    const summary: Record<string, number> = {};
    for (const e of userEvents) {
      summary[e.operation] = (summary[e.operation] || 0) + 1;
    }
    return Object.entries(summary).map(([operation, count]) => ({ operation, count }));
  }
  private log: EditEvent[] = [];
  private undoStack: EditEvent[] = [];
  private redoStack: EditEvent[] = [];

  addEvent(event: EditEvent) {
    this.log.push(event);
    // Clear redoStack on new action
    this.redoStack = [];
  }

  mergeLogs(otherLog: EditEvent[]) {
    const merged = [...this.log, ...otherLog];
    const seen = new Set<string>();
    const deduped = merged.filter(e => {
      if (seen.has(e.opId)) return false;
      seen.add(e.opId);
      return true;
    });
    deduped.sort((a, b) => a.timestamp - b.timestamp || a.opId.localeCompare(b.opId));
    this.log = this.resolveConflicts(deduped);
  }

  getLog() {
    return this.log;
  }

  /**
   * Removes all events for a given playlist (by playlistId in metadata).
   */
  removePlaylistEvents(playlistId: string) {
    this.log = this.log.filter(e => !e.metadata || e.metadata.playlistId !== playlistId);
  }

  /**
   * Removes all events for a given user.
   */
  removeUserEvents(userId: string) {
    this.log = this.log.filter(e => e.userId !== userId);
  }

  // --- Conflict Resolution ---
  resolveConflicts(events: EditEvent[]): EditEvent[] {
    const eventMap = new Map<string, EditEvent>();
    for (const event of events) {
      const key = `${event.trackId}-${event.timestamp}`;
      if (!eventMap.has(key) || event.operation === "remove") {
        eventMap.set(key, event);
      }
    }
    return Array.from(eventMap.values()).sort((a, b) => a.timestamp - b.timestamp);
  }

  // --- Undo/Redo ---
  undoLast(userId: string) {
    // Find last event by userId, remove from log, push to undoStack
    let found = false;
    for (let i = this.log.length - 1; i >= 0; i--) {
      if (this.log[i].userId === userId) {
        const event = this.log.splice(i, 1)[0];
        this.undoStack.push(event);
        found = true;
        break;
      }
    }
    if (!found) {
      console.warn(`No actions to undo for user ${userId}.`);
    }
  }

  redoLast(userId: string) {
    // Reapply last undone event by userId
    let found = false;
    for (let i = this.undoStack.length - 1; i >= 0; i--) {
      if (this.undoStack[i].userId === userId) {
        const event = this.undoStack.splice(i, 1)[0];
        this.log.push(event);
        this.redoStack.push(event);
        found = true;
        break;
      }
    }
    if (!found) {
      console.warn(`No actions to redo for user ${userId}.`);
    }
  }
}

// --- 3. Collaborative Doubly Linked List ---
/**
 * Collaborative doubly linked list for playlist tracks.
 * DSA: Doubly linked list (O(1) add/remove/skip/rewind if node reference), hash map index for fast search (O(1)).
 * Time complexity: O(1) for most operations, O(N) for search by value.
 * Space complexity: O(N) for tracks and index.
 * Rationale: Efficient, real-time playlist management for collaborative editing and conflict resolution.
 */
class CollaborativePlaylist extends DoublyLinkedList<string> {
  /**
   * Replay the edit log to reconstruct playlist state.
   * DSA: Sequential log replay (O(N)), uses DLL for efficient state updates.
   * Time complexity: O(N) for log replay.
   * Space complexity: O(N) for playlist state.
   * Rationale: Supports undo/redo, offline sync, and conflict resolution.
   */
  replayLog(editLog: EditEvent[]) {
    // Clear current state
    this.head = this.tail = null;
    this.size = 0;
    this.index.clear();

    for (const event of editLog) {
      // Filter unavailable tracks
      if (unavailableTracks.has(event.trackId)) continue;
      if (event.operation === "add") {
        // Insert at position if provided, else append
        if (typeof event.position === "number") {
          this.insertAt(event.trackId, event.position, event.metadata);
        } else {
          this.append(event.trackId, event.metadata);
        }
      } else if (event.operation === "remove") {
        const nodes = this.findAll(event.trackId);
        if (nodes) for (const node of nodes) this.remove(node);
      } else if (event.operation === "move") {
        this.moveTrack(event.trackId, event.position!);
      } else if (event.operation === "update") {
        const node = this.find(event.trackId);
        if (node) node.metadata = { ...node.metadata, ...event.metadata };
      }
    }
  }

  /**
   * Insert a track at a specific position (0-based).
   * DSA: DLL node insertion (O(1)), hash map index update (O(1)).
   * Time complexity: O(1) for head/tail, O(N) for arbitrary position.
   * Space complexity: O(1) per node.
   * Rationale: Enables precise collaborative edits and conflict resolution.
   */
  insertAt(value: string, position: number, metadata?: any): DLLNode<string> {
    const node = new DLLNode(value, metadata);
    if (position <= 0 || !this.head) {
      // Insert at head
      node.next = this.head;
      if (this.head) this.head.prev = node;
      this.head = node;
      if (!this.tail) this.tail = node;
    } else {
      let curr = this.head;
      let idx = 0;
      while (curr.next && idx < position - 1) {
        curr = curr.next;
        idx++;
      }
      node.next = curr.next;
      node.prev = curr;
      if (curr.next) curr.next.prev = node;
      curr.next = node;
      if (!node.next) this.tail = node;
    }
    this.size++;
    if (!this.index.has(value)) this.index.set(value, new Set());
    this.index.get(value)!.add(node);
    return node;
  }

  /**
   * Move a track to a new position.
   * DSA: DLL node removal and insertion (O(1)), hash map index update (O(1)).
   * Time complexity: O(1) if node reference, O(N) if searching by value.
   * Space complexity: O(1) per move.
   * Rationale: Supports collaborative reordering and conflict resolution.
   */
  moveTrack(trackId: string, newPosition: number) {
    const node = this.find(trackId);
    if (!node) return;
    this.remove(node);
    this.insertAt(trackId, newPosition, node.metadata);
  }
}

// --- 4. Example Usage ---

const editLog = new PlaylistEditLog();

// --- Permission Management Usage Examples ---
// Create a playlist and set initial owner and privacy
addUserToPlaylist("pl1", "user1", "owner");
changePlaylistPrivacy("pl1", "private");

// Add collaborators and viewers
addUserToPlaylist("pl1", "user2", "collaborator");
addUserToPlaylist("pl1", "user3", "viewer");

// Remove a user
removeUserFromPlaylist("pl1", "user3");

// Change owner
changePlaylistOwner("pl1", "user2");

// Change privacy
changePlaylistPrivacy("pl1", "public");

// --- Event Bus Integration for Permission Changes ---
// (Moved below, after eventBus declaration)

/**
 * Adds a track to a playlist if the user has edit permissions.
 * DSA: Hash map lookup for permissions (O(1)), edit log append (O(1)).
 * Time complexity: O(1) for permission check and log append.
 * Space complexity: O(N) for edit log.
 * Rationale: Enforces collaborative access control, supports undo/redo and audit.
 */
function addTrack(userId: string, trackId: string, position?: number, metadata?: any, playlistId: string = "default") {
  if (!canEdit(userId, playlistId)) {
    console.warn(`User ${userId} cannot add track to playlist ${playlistId}: insufficient permissions.`);
    return;
  }
  if (unavailableTracks.has(trackId)) {
    console.warn(`Track ${trackId} is unavailable and cannot be added.`);
    return;
  }
  // Prevent duplicate track addition
  const playlist = new CollaborativePlaylist();
  playlist.replayLog(editLog.getLog());
  if (playlist.find(trackId)) {
    console.warn(`Track ${trackId} already exists in playlist ${playlistId}. Duplicate addition prevented.`);
    return;
  }
  // Enforce playlist size limit
  if (playlist.size >= MAX_PLAYLIST_SIZE) {
    console.warn(`Playlist ${playlistId} has reached its maximum size (${MAX_PLAYLIST_SIZE}).`);
    return;
  }
  const event: EditEvent = {
    opId: crypto.randomUUID(),
    userId,
    timestamp: Date.now(),
    operation: "add",
    trackId,
    position,
    metadata
  };
  editLog.addEvent(event);
}

/**
 * Removes a track from a playlist if the user has edit permissions.
 * DSA: Hash map lookup for permissions (O(1)), edit log append (O(1)).
 * Time complexity: O(1) for permission check and log append.
 * Space complexity: O(N) for edit log.
 * Rationale: Enforces collaborative access control, supports undo/redo and audit.
 */
function removeTrack(userId: string, trackId: string, playlistId: string = "default") {
  if (!canEdit(userId, playlistId)) {
    console.warn(`User ${userId} cannot remove track from playlist ${playlistId}: insufficient permissions.`);
    return;
  }
  const playlist = new CollaborativePlaylist();
  playlist.replayLog(editLog.getLog());
  if (!playlist.find(trackId)) {
    console.warn(`Track ${trackId} does not exist in playlist ${playlistId}. Remove operation ignored.`);
    return;
  }
  const event: EditEvent = {
    opId: crypto.randomUUID(),
    userId,
    timestamp: Date.now(),
    operation: "remove",
    trackId
  };
  editLog.addEvent(event);
}

/**
 * Moves a track within a playlist if the user has edit permissions.
 * DSA: Hash map lookup for permissions (O(1)), edit log append (O(1)).
 * Time complexity: O(1) for permission check and log append.
 * Space complexity: O(N) for edit log.
 * Rationale: Enforces collaborative access control, supports undo/redo and audit.
 */
function moveTrack(userId: string, trackId: string, newPosition: number, playlistId: string = "default") {
  if (!canEdit(userId, playlistId)) {
    console.warn(`User ${userId} cannot move track in playlist ${playlistId}: insufficient permissions.`);
    return;
  }
  const playlist = new CollaborativePlaylist();
  playlist.replayLog(editLog.getLog());
  const trackNode = playlist.find(trackId);
  if (!trackNode) {
    console.warn(`Track ${trackId} does not exist in playlist ${playlistId}. Move operation ignored.`);
    return;
  }
  // Validate move position
  if (typeof newPosition !== "number" || newPosition < 0 || newPosition >= playlist.size) {
    console.warn(`Invalid move position ${newPosition} for playlist ${playlistId}.`);
    return;
  }
  const event: EditEvent = {
    opId: crypto.randomUUID(),
    userId,
    timestamp: Date.now(),
    operation: "move",
    trackId,
    position: newPosition
  };
  editLog.addEvent(event);
}

// Simulate collaborative edits
addTrack("user1", "trackA", undefined, undefined, "pl1");
addTrack("user2", "trackB", undefined, undefined, "pl1");
addTrack("user1", "trackC", 1, undefined, "pl1"); // Insert at position 1
moveTrack("user2", "trackA", 2, "pl1");
removeTrack("user1", "trackB", "pl1");

// Example: Update track metadata
const updateEvent: EditEvent = {
  opId: crypto.randomUUID(),
  userId: "user1",
  timestamp: Date.now(),
  operation: "update",
  trackId: "trackA",
  metadata: { notes: "Favorite track!" }
};
editLog.addEvent(updateEvent);

// Reconstruct playlist from log
const collaborativePlaylist = new CollaborativePlaylist();
collaborativePlaylist.replayLog(editLog.getLog());
console.log(collaborativePlaylist.toArray()); // Final playlist state after

// Undo last action by user1
editLog.undoLast("user1");
collaborativePlaylist.replayLog(editLog.getLog());
console.log("After undo:", collaborativePlaylist.toArray());

// Redo last undone action by user1
editLog.redoLast("user1");
collaborativePlaylist.replayLog(editLog.getLog());
console.log("After redo:", collaborativePlaylist.toArray());

// --- 5. Offline Sync ---
function syncOfflineEdits(localLog: EditEvent[], remoteLog: EditEvent[]): CollaborativePlaylist {
  const mergedLog = new PlaylistEditLog();
  mergedLog.mergeLogs(localLog);
  mergedLog.mergeLogs(remoteLog);
  const playlist = new CollaborativePlaylist();
  playlist.replayLog(mergedLog.getLog());
  return playlist;
}

// --- Example Usage ---
// Simulate offline edits
const offlineLog: EditEvent[] = [];
offlineLog.push({
  opId: crypto.randomUUID(),
  userId: "user3",
  timestamp: Date.now(),
  operation: "add",
  trackId: "trackD"
});
offlineLog.push({
  opId: crypto.randomUUID(),
  userId: "user3",
  timestamp: Date.now() + 1,
  operation: "move",
  trackId: "trackD",
  position: 0
});

// Sync offline edits with server log
const syncedPlaylist = syncOfflineEdits(offlineLog, editLog.getLog());
console.log("After offline sync:", syncedPlaylist.toArray());

// --- 6. Audit/Log History Example Usages ---
// 1. Get full audit log
console.log("Full audit log:", editLog.getAuditLog());

// 2. Get audit log filtered by user and operation
console.log("Audit log for user1 (add operations):", editLog.getAuditLog({ userId: "user1", operation: "add" }));

// 3. Get audit log for a time range
const now = Date.now();
console.log("Audit log for recent events:", editLog.getAuditLog({ from: now - 10000, to: now }));

// 4. Reconstruct playlist state at a previous timestamp
const timestamp = now - 5000;
const historicalPlaylist = editLog.getPlaylistStateAt(timestamp);
console.log(`Playlist state at timestamp ${timestamp}:`, historicalPlaylist.toArray());

// 5. Get user action summary
console.log("User action summary for user1:", editLog.getUserActionSummary("user1"));

// --- 7. Advanced Analytics Example Usages ---
// 1. Most active users (top editors)
console.log("Most active users:", editLog.getMostActiveUsers());

// 2. Track popularity (add/remove counts)
console.log("Track popularity:", editLog.getTrackPopularity());

// 3. Edit activity timeline (bucketed by minute)
console.log("Edit timeline:", editLog.getEditTimeline());

// 4. Per-user edit streaks
console.log("User edit streaks:", editLog.getUserEditStreaks());

// --- 9. Global Track Removal Example Usage ---
// Remove trackC globally (simulate DMCA takedown)
removeTrackGlobally("trackC");
// Reconstruct playlist after global removal
collaborativePlaylist.replayLog(editLog.getLog());
console.log("After global track removal (trackC):", collaborativePlaylist.toArray());
// Check recommendations after global removal
console.log("Recommendations after global removal:", getRecommendations("user1"));

// --- 10. Playlist/User Deletion Example Usage ---
// Delete playlist pl1 (GDPR/privacy compliance)
deletePlaylist("pl1", editLog);
console.log("After playlist deletion (pl1):", editLog.getAuditLog());

// Delete user2 (GDPR/account deletion)
deleteUser("user2", editLog);
console.log("After user deletion (user2):", editLog.getAuditLog());

// --- 11. Smart Playlist Automation Example Usage ---
// Auto-update smart playlist for user1 and playlist pl1
autoUpdateSmartPlaylist("user1", "pl1", editLog);
collaborativePlaylist.replayLog(editLog.getLog());
console.log("After smart playlist auto-update:", collaborativePlaylist.toArray());

// --- 8. Further Analytics Example Usages ---
// 1. Per-track edit history
console.log("Edit history for trackA:", editLog.getTrackEditHistory("trackA"));

// 2. Conflict detection (simultaneous edits)
console.log("Conflicts detected:", editLog.getConflicts());

// 3. Undo/redo statistics
console.log("Undo/redo stats:", editLog.getUndoRedoStats());

// 4. Collaborative session summaries
console.log("Session summaries:", editLog.getSessionSummaries());