import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/shared/utils/testing/customRenders';
import type { Ufo } from '../../../../../types/ufo';
import { UfoMarker } from '../../UfoMarker';

const DEFAULT_ZOOM = 10;

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

const createMockUfo = (overrides?: Partial<Ufo>): Ufo => ({
  id: 'ufo-test-123',
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
  });

  it('should render marker without errors', () => {
    expect.hasAssertions();
    const ufo = createMockUfo();
    render(<UfoMarker ufo={ufo} />);
    expect(screen.getByTestId('leaflet-marker')).toBeInTheDocument();
  });

  it('should set correct position coordinates', () => {
    expect.hasAssertions();
    const ufo = createMockUfo({ lat: 50.4501, lng: 30.5234 });
    render(<UfoMarker ufo={ufo} />);
    const marker = screen.getByTestId('leaflet-marker');
    const position = JSON.parse(marker.getAttribute('data-position') || '[]');
    expect(position).toEqual([50.4501, 30.5234]);
  });

  it('should handle different coordinates', () => {
    expect.hasAssertions();
    const ufo = createMockUfo({ lat: 49.0, lng: 31.0 });
    render(<UfoMarker ufo={ufo} />);
    const marker = screen.getByTestId('leaflet-marker');
    const position = JSON.parse(marker.getAttribute('data-position') || '[]');
    expect(position).toEqual([49.0, 31.0]);
  });

  it('should create icon for active UFO', () => {
    expect.hasAssertions();
    const ufo = createMockUfo({ status: 'active', heading: 90 });
    render(<UfoMarker ufo={ufo} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledWith(90, false, DEFAULT_ZOOM);
  });

  it('should create icon for lost UFO', () => {
    expect.hasAssertions();
    const ufo = createMockUfo({ status: 'lost', heading: 90 });
    render(<UfoMarker ufo={ufo} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledWith(90, true, DEFAULT_ZOOM);
  });

  it('should use correct heading for icon rotation', () => {
    expect.hasAssertions();
    const ufo = createMockUfo({ heading: 270 });
    render(<UfoMarker ufo={ufo} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledWith(270, false, DEFAULT_ZOOM);
  });

  it('should handle zero heading', () => {
    expect.hasAssertions();
    const ufo = createMockUfo({ heading: 0 });
    render(<UfoMarker ufo={ufo} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledWith(0, false, DEFAULT_ZOOM);
  });

  it('should call icon creator once per render', () => {
    expect.hasAssertions();
    const ufo = createMockUfo();
    render(<UfoMarker ufo={ufo} />);
    expect(mockCreateRotatedUfoIcon).toHaveBeenCalledTimes(1);
  });

  it('should pass icon to marker', () => {
    expect.hasAssertions();
    const ufo = createMockUfo({ heading: 180 });
    render(<UfoMarker ufo={ufo} />);
    const marker = screen.getByTestId('leaflet-marker');
    const icon = JSON.parse(marker.getAttribute('data-icon') || '{}');
    expect(icon).toEqual({ heading: 180, isLost: false, zoom: DEFAULT_ZOOM, type: 'icon' });
  });
});
