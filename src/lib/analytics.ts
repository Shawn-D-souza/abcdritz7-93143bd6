/**
 * analytics.ts
 *
 * A thin, fire-and-forget wrapper around PostHog.
 *
 * Key design decisions:
 *  - posthog-js is NEVER imported at module level here, so this file adds
 *    zero weight to the critical-path bundle.
 *  - Events fired before PostHog.init() completes (e.g. within the first
 *    3-second defer window) are held in a tiny in-memory queue and flushed
 *    automatically once the SDK is ready.
 *  - Every code path is wrapped in try/catch — analytics can NEVER throw
 *    and NEVER break application logic.
 */

type Properties = Record<string, unknown>;

interface QueuedEvent {
  event: string;
  properties?: Properties;
}

const _queue: QueuedEvent[] = [];
let _isReady = false;

/**
 * Called by main.tsx immediately after posthog.init() returns.
 * Marks the SDK as ready and flushes any queued events.
 */
export function flushAnalyticsQueue(): void {
  _isReady = true;

  if (_queue.length === 0) return;

  // Posthog is already loaded in memory at this point (main.tsx just called
  // posthog.init), so this dynamic import resolves synchronously from cache.
  import('posthog-js')
    .then(({ default: posthog }) => {
      const pending = _queue.splice(0);
      for (const { event, properties } of pending) {
        try {
          posthog.capture(event, properties);
        } catch (_e) {
          // Silent — analytics must never crash the app
        }
      }
    })
    .catch((_e) => {
      // Clear queue even if flush fails so we don't accumulate stale entries
      _queue.length = 0;
    });
}

/**
 * Capture a PostHog event safely.
 *
 * - Synchronous and non-blocking from the caller's perspective.
 * - If PostHog isn't ready yet the event is queued and sent once it is.
 * - Never throws under any circumstances.
 *
 * @example
 * capture('workshop_button_click', { variant });
 */
export function capture(event: string, properties?: Properties): void {
  try {
    if (!_isReady) {
      _queue.push({ event, properties });
      return;
    }

    import('posthog-js')
      .then(({ default: posthog }) => {
        try {
          posthog.capture(event, properties);
        } catch (_e) {
          // Silent
        }
      })
      .catch((_e) => {
        // Silent — network / load failure is non-critical
      });
  } catch (_e) {
    // Silent — outer guard for any unexpected synchronous error
  }
}
