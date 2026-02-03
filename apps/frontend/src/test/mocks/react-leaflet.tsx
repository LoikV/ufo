export const useMap = () => ({
  getZoom: () => 10,
  on: () => ({}),
  off: () => ({}),
});

export const MapContainer = ({ children, ...props }: any) => (
  <div 
    data-testid="map-container" 
    data-center={JSON.stringify(props.center)} 
    data-zoom={props.zoom}
  >
    {children}
  </div>
);

export const TileLayer = (props: any) => (
  <div 
    data-testid="tile-layer" 
    data-url={props.url} 
    data-attribution={props.attribution} 
  />
);

export const Marker = ({ position, ...props }: any) => (
  <div 
    data-testid="leaflet-marker" 
    data-position={JSON.stringify(position)}
    data-icon={JSON.stringify(props.icon)}
  />
);
