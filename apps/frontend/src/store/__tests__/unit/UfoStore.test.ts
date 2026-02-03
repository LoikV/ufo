import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UfoStore } from '../../UfoStore';
import type { UfoUpdate } from '../../../types/ufo';
import { LOST_THRESHOLD_MS, REMOVE_THRESHOLD_MS } from '../../../utils/constants';

describe('UfoStore', () => {
  let store: UfoStore;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    store = new UfoStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const nowMs = () => Date.now();

  const createUpdate = (id: string, overrides: Partial<UfoUpdate> = {}): UfoUpdate => ({
    id,
    lat: 50.4501,
    lng: 30.5234,
    heading: 90,
    ts: nowMs(),
    ...overrides,
  });

  it('starts empty', () => {
    expect(store.ufoList).toEqual([]);
    expect(store.totalCount).toBe(0);
    expect(store.activeCount).toBe(0);
    expect(store.lostCount).toBe(0);
    expect(store.lastUpdateTime).toBeNull();
  });

  it('updateUfo normalizes fields and updates timestamps deterministically', () => {
    const t0 = nowMs();
    const update = createUpdate('ufo-1', { lat: 50.0, lng: 30.0, heading: 180, ts: 123 });

    store.updateUfo(update);

    expect(store.totalCount).toBe(1);
    expect(store.activeCount).toBe(1);
    expect(store.lostCount).toBe(0);

    expect(store.ufoList[0]).toMatchObject({
      id: 'ufo-1',
      lat: 50.0,
      lng: 30.0,
      heading: 180,
      status: 'active',
      ts: 123,
      lastSeenAt: t0,
    });
    expect(store.lastUpdateTime).toEqual(new Date(t0));
  });

  it('updateUfo overwrites existing UFO (same id) and refreshes lastSeenAt', () => {
    const t0 = nowMs();
    store.updateUfo(createUpdate('ufo-1', { lat: 50.0, lng: 30.0 }));

    const t1 = t0 + 1000;
    vi.setSystemTime(t1);
    store.updateUfo(createUpdate('ufo-1', { lat: 51.0, lng: 31.0 }));

    expect(store.ufoList).toHaveLength(1);
    expect(store.ufoList[0]).toMatchObject({
      id: 'ufo-1',
      lat: 51.0,
      lng: 31.0,
      lastSeenAt: t1,
      status: 'active',
    });
    expect(store.lastUpdateTime).toEqual(new Date(t1));
  });

  it('markAsLost marks an existing UFO as lost and is idempotent', () => {
    store.updateUfo(createUpdate('ufo-1'));
    store.markAsLost('ufo-1');
    store.markAsLost('ufo-1');

    expect(store.lostCount).toBe(1);
    expect(store.activeCount).toBe(0);
    expect(store.ufoList[0]!.status).toBe('lost');
  });

  it('updateUfo resets status to active (even if UFO was lost)', () => {
    store.updateUfo(createUpdate('ufo-1'));
    store.markAsLost('ufo-1');
    expect(store.ufoList[0]!.status).toBe('lost');

    vi.setSystemTime(nowMs() + 1000);
    store.updateUfo(createUpdate('ufo-1'));

    expect(store.ufoList[0]!.status).toBe('active');
    expect(store.activeCount).toBe(1);
    expect(store.lostCount).toBe(0);
  });

  it('removeUfo deletes UFO by id (no-op when missing)', () => {
    store.updateUfo(createUpdate('ufo-1'));
    store.removeUfo('ufo-1');
    store.removeUfo('ufo-1');

    expect(store.ufoList).toEqual([]);
    expect(store.totalCount).toBe(0);
  });

  it('cleanupStaleUfos: marks lost then removes (LOST_THRESHOLD_MS < REMOVE_THRESHOLD_MS)', () => {
    const base = nowMs();
    store.updateUfo(createUpdate('ufo-1'));

    vi.setSystemTime(base + LOST_THRESHOLD_MS + 1);
    store.cleanupStaleUfos();
    expect(store.totalCount).toBe(1);
    expect(store.ufoList[0]!.status).toBe('lost');

    vi.setSystemTime(base + REMOVE_THRESHOLD_MS + 1);
    store.cleanupStaleUfos();
    expect(store.totalCount).toBe(0);
  });

  it('cleanupStaleUfos handles multiple UFOs based on lastSeenAt', () => {
    const base = nowMs();
    store.updateUfo(createUpdate('ufo-1'));

    vi.setSystemTime(base + 800000);
    store.updateUfo(createUpdate('ufo-2'));

    vi.setSystemTime(base + REMOVE_THRESHOLD_MS + 1);
    store.cleanupStaleUfos();

    const ufo1 = store.ufoList.find((u) => u.id === 'ufo-1');
    const ufo2 = store.ufoList.find((u) => u.id === 'ufo-2');

    expect(ufo1).toBeUndefined();
    expect(ufo2?.status).toBe('active');
  });

  it('clear empties store and resets lastUpdateTime', () => {
    store.updateUfo(createUpdate('ufo-1'));
    store.updateUfo(createUpdate('ufo-2'));
    expect(store.totalCount).toBe(2);
    expect(store.lastUpdateTime).not.toBeNull();

    store.clear();

    expect(store.ufoList).toEqual([]);
    expect(store.totalCount).toBe(0);
    expect(store.lastUpdateTime).toBeNull();
  });
});
