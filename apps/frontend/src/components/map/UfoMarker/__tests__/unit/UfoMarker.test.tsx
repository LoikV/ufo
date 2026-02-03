import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/shared/utils/testing/customRenders';
import type { Ufo } from '../../../../../types/ufo';
import { UfoMarker } from '../../UfoMarker';

const DEFAULT_ZOOM = 10;
const UFO_ID = 'ufo-test-123';

const mockCreateRotatedUfoIcon = vi.fn((heading: number, isLost: boolean, zoom?: number) => ({
  heading,
  isLost,
  zoom: zoom ?? DEFAULT_ZOOM,
  type: 'icon',
}));

vi.mock('../../utils/createUfoIconFromImage', () => ({
  createRotatedUfoIcon: (heading: number, isLost: boolean, zoom: number) =>
    mockCreateRotatedUfoIcon(heading, isLost, zoom),
}));

const mockUfos = new Map<string, Ufo>();

vi.mock('../../../../../store/StoreContext', () => ({
  useUfoStore: () => ({ ufos: mockUfos }),
  StoreProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const createMockUfo = (overrides?: Partial<Ufo>): Ufo => ({
  id: UFO_ID,
  lat: 50.4501,
  lng: 30.5234,
  heading: 90,
  ts: Date.now(),
  lastSeenAt: Date.now(),
  status: 'active',
  ...overrides,
});

describe('UfoMarker', () => {
  beforeEach(() => {
    mockCreateRotatedUfoIcon.mockClear();
    mockUfos.clear();
  });

  it('should render marker without errors', () => {
    expect.hasAssertions();
    mockUfos.set(UFO_ID, createMockUfo());
    render(<UfoMarker id={UFO_ID} />);
    expect(screen.getByTestId('leaflet-marker')).toBeInTheDocument();
  });

  it('should render nothing when UFO is missing', () => {
    expect.hasAssertions();
    render(<UfoMarker id="missing-id" />);
    expect(screen.queryByTestId('leaflet-marker')).not.toBeInTheDocument();
  });

  it('should set correct position coordinates', () => {
    expect.hasAssertions();
    mockUfos.set(UFO_ID, createMockUfo({ lat: 50.4501, lng: 30.5234 }));
    render(<UfoMarker id={UFO_ID} />);
    const marker = screen.getByTestId('leaflet-marker');
    const position = JSON.parse(marker.getAttribute('data-position') || '[]');
    expect(position).toEqual([50.4501, 30.5234]);
  });

  it('should handle different coordinates', () => {
    expect.hasAssertions();
    mockUfos.set(UFO_ID, createMockUfo({ lat: 49.0, lng: 31.0 }));
    render(<UfoMarker id={UFO_ID} />);
    const marker = screen.getByTestId('leaflet-marker');
    const position = JSON.parse(marker.getAttribute('data-position') || '[]');
    expect(position).toEqual([49.0, 31.0]);
  });

  it('should create icon for active UFO', () => {
    expect.hasAssertions();
    mockUfos.set(UFO_ID, createMockUfo({ status: 'active', heading: 90 }));
    render(<UfoMarker id={UFO_ID} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledWith(90, false, DEFAULT_ZOOM);
  });

  it('should create icon for lost UFO', () => {
    expect.hasAssertions();
    mockUfos.set(UFO_ID, createMockUfo({ status: 'lost', heading: 90 }));
    render(<UfoMarker id={UFO_ID} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledWith(90, true, DEFAULT_ZOOM);
  });

  it('should use correct heading for icon rotation', () => {
    expect.hasAssertions();
    mockUfos.set(UFO_ID, createMockUfo({ heading: 270 }));
    render(<UfoMarker id={UFO_ID} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledWith(270, false, DEFAULT_ZOOM);
  });

  it('should handle zero heading', () => {
    expect.hasAssertions();
    mockUfos.set(UFO_ID, createMockUfo({ heading: 0 }));
    render(<UfoMarker id={UFO_ID} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledWith(0, false, DEFAULT_ZOOM);
  });

  it('should call icon creator once per render', () => {
    expect.hasAssertions();
    mockUfos.set(UFO_ID, createMockUfo());
    render(<UfoMarker id={UFO_ID} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledTimes(1);
  });

  it('should pass icon to marker', () => {
    expect.hasAssertions();
    mockUfos.set(UFO_ID, createMockUfo({ heading: 180 }));
    render(<UfoMarker id={UFO_ID} />);
    const marker = screen.getByTestId('leaflet-marker');
    const icon = JSON.parse(marker.getAttribute('data-icon') || '{}');
    expect(icon).toEqual({ heading: 180, isLost: false, zoom: DEFAULT_ZOOM, type: 'icon' });
  });
});
