import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/shared/utils/testing/customRenders';
import type { Ufo } from '../../../../../types/ufo';
import { UfoMap } from '../../UfoMap';

const mockUfoStore = {
  ufoIds: [] as string[],
  ufos: new Map<string, Ufo>(),
};

vi.mock('../../../../../store/StoreContext', () => ({
  useUfoStore: () => mockUfoStore,
  StoreProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const createMockUfo = (id: string, rest?: Partial<Ufo>): Ufo => ({
  id,
  lat: 50.4501,
  lng: 30.5234,
  heading: 90,
  ts: Date.now(),
  lastSeenAt: Date.now(),
  status: 'active',
  ...rest,
});

describe('UfoMap', () => {
  beforeEach(() => {
    mockUfoStore.ufoIds = [];
    mockUfoStore.ufos.clear();
  });

  it('should render map container', () => {
    expect.hasAssertions();
    render(<UfoMap />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('should render tile layer', () => {
    expect.hasAssertions();
    render(<UfoMap />);
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  it('should set correct center coordinates', () => {
    expect.hasAssertions();
    render(<UfoMap />);
    const mapContainer = screen.getByTestId('map-container');
    const center = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
    expect(center).toEqual([49.0, 31.0]);
  });

  it('should set correct zoom level', () => {
    expect.hasAssertions();
    render(<UfoMap />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer.getAttribute('data-zoom')).toBe('6');
  });

  it('should render with empty UFO list', () => {
    expect.hasAssertions();
    mockUfoStore.ufoIds = [];
    render(<UfoMap />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.queryAllByTestId('leaflet-marker')).toHaveLength(0);
  });

  it('should render with single UFO', () => {
    expect.hasAssertions();
    const ufo = createMockUfo('ufo-1');
    mockUfoStore.ufos.set('ufo-1', ufo);
    mockUfoStore.ufoIds = ['ufo-1'];
    render(<UfoMap />);
    const markers = screen.getAllByTestId('leaflet-marker');
    expect(markers).toHaveLength(1);
    expect(JSON.parse(markers[0]!.getAttribute('data-position') ?? '[]')).toEqual([
      ufo.lat,
      ufo.lng,
    ]);
  });

  it('should render with multiple UFOs', () => {
    expect.hasAssertions();
    const ufoList = [
      createMockUfo('ufo-1'),
      createMockUfo('ufo-2'),
      createMockUfo('ufo-3'),
    ];
    ufoList.forEach((ufo) => mockUfoStore.ufos.set(ufo.id, ufo));
    mockUfoStore.ufoIds = ufoList.map((u) => u.id);
    render(<UfoMap />);
    const markers = screen.getAllByTestId('leaflet-marker');
    expect(markers).toHaveLength(3);
    ufoList.forEach((ufo, i) => {
      expect(JSON.parse(markers[i]!.getAttribute('data-position') ?? '[]')).toEqual([
        ufo.lat,
        ufo.lng,
      ]);
    });
  });

  it('should render with active and lost UFOs', () => {
    expect.hasAssertions();
    mockUfoStore.ufos.set('ufo-active', createMockUfo('ufo-active', { status: 'active' }));
    mockUfoStore.ufos.set('ufo-lost', createMockUfo('ufo-lost', { status: 'lost' }));
    mockUfoStore.ufoIds = ['ufo-active', 'ufo-lost'];
    render(<UfoMap />);
    expect(screen.getAllByTestId('leaflet-marker')).toHaveLength(2);
  });

  it('should handle large number of UFOs', () => {
    expect.hasAssertions();
    const ufos = Array.from({ length: 100 }, (_, i) => createMockUfo(`ufo-${i}`));
    ufos.forEach((ufo) => mockUfoStore.ufos.set(ufo.id, ufo));
    mockUfoStore.ufoIds = ufos.map((u) => u.id);
    render(<UfoMap />);
    expect(screen.getAllByTestId('leaflet-marker')).toHaveLength(100);
  });
});
