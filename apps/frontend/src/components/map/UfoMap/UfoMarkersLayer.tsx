import { observer } from 'mobx-react-lite';
import { useUfoStore } from '../../../store/StoreContext';
import { UfoMarker } from '../UfoMarker/UfoMarker';

export const UfoMarkersLayer = observer(function UfoMarkersLayer() {
  const ufoStore = useUfoStore();
  const ufoIds = ufoStore.ufoIds;

  return (
    <>
      {ufoIds.map((id) => (
        <UfoMarker key={id} id={id} />
      ))}
    </>
  );
});
