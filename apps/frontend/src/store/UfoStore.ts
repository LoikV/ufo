import { makeAutoObservable, observable } from 'mobx';
import type { Ufo, UfoUpdate } from '../types/ufo';
import { LOST_THRESHOLD_MS, REMOVE_THRESHOLD_MS } from '../utils/constants';

export class UfoStore {
  ufos = observable.map<string, Ufo>();
  lastUpdateTime: Date | null = null;

  constructor() {
    makeAutoObservable(this, {
      ufos: observable,
    });
  }

  get ufoIds(): string[] {
    return Array.from(this.ufos.keys());
  }

  get ufoList(): Ufo[] {
    return Array.from(this.ufos.values());
  }

  get activeCount(): number {
    return this.ufoList.filter((ufo) => ufo.status === 'active').length;
  }

  get lostCount(): number {
    return this.ufoList.filter((ufo) => ufo.status === 'lost').length;
  }

  get totalCount(): number {
    return this.ufos.size;
  }

  updateUfo(data: UfoUpdate): void {
    const now = Date.now();

    const ufo: Ufo = {
      ...data,
      lastSeenAt: now,
      status: 'active',
    };

    this.ufos.set(data.id, ufo);
    this.lastUpdateTime = new Date(now);
  }

  markAsLost(id: string): void {
    const ufo = this.ufos.get(id);
    if (ufo && ufo.status !== 'lost') {
      ufo.status = 'lost';
    }
  }

  removeUfo(id: string): void {
    this.ufos.delete(id);
  }

  cleanupStaleUfos(): void {
    const now = Date.now();

    this.ufos.forEach((ufo, id) => {
      const elapsed = now - ufo.lastSeenAt;

      if (elapsed > REMOVE_THRESHOLD_MS) {
        this.removeUfo(id);
      } else if (elapsed > LOST_THRESHOLD_MS && ufo.status === 'active') {
        this.markAsLost(id);
      }
    });
  }

  clear(): void {
    this.ufos.clear();
    this.lastUpdateTime = null;
  }
}
