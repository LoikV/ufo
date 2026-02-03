import L from 'leaflet';

const ICON_SIZE_MIN = 24;
const ICON_SIZE_MAX = 68;
const ZOOM_SIZE_MIN = 4;
const ZOOM_SIZE_MAX = 12;

function getIconSizeByZoom(zoom: number): number {
  if (zoom <= ZOOM_SIZE_MIN) return ICON_SIZE_MIN;
  if (zoom >= ZOOM_SIZE_MAX) return ICON_SIZE_MAX;
  const t = (zoom - ZOOM_SIZE_MIN) / (ZOOM_SIZE_MAX - ZOOM_SIZE_MIN);
  return Math.round(ICON_SIZE_MIN + t * (ICON_SIZE_MAX - ICON_SIZE_MIN));
}

export function createUfoIconFromImage(_heading: number, isLost: boolean): L.Icon {
  const iconUrl = isLost 
    ? '/icons/ufo-lost.png'
    : '/icons/ufo-active.png';
  
  return L.icon({
    iconUrl: iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

export function createRotatedUfoIcon(
  heading: number,
  isLost: boolean,
  zoom: number
): L.DivIcon {
  const iconUrl = '/icons/ufo.png';
  const size = getIconSizeByZoom(zoom);
  const half = Math.round(size / 2);

  const filter = isLost
    ? 'grayscale(40%) sepia(0.7) hue-rotate(-20deg) brightness(0.8)'
    : 'brightness(0)';

  const html = `
    <img 
      src="${iconUrl}" 
      style="
        width: ${size}px; 
        height: ${size}px; 
        transform: rotate(${heading}deg);
        transform-origin: center;
        filter: ${filter};
      " 
    />
  `;

  return L.divIcon({
    html: html,
    className: 'ufo-marker-icon',
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half],
  });
}
