import { TranslatorDTO } from '..';
import { toString } from '../util';
import EventSelector from './EventSelector';
import OverrideFields from './OverrideFields';

type OverrideControlsProps = {
  selectedSource: NumberArrayWithStatus | undefined;
  setSelectedSource: (source: NumberArrayWithStatus | undefined) => void;
  plugin: Readonly<TranslatorDTO>;
  applyChanges: (dto: TranslatorDTO) => void;
};

export function OverrideControls(props: OverrideControlsProps) {
  const { selectedSource, setSelectedSource, plugin, applyChanges } = props;

  const updateOverride = (
    source: NumberArrayWithStatus,
    override: NumberArrayWithStatus
  ) => {
    const overrides = { ...plugin.overrides };
    overrides[toString(source)] = override;
    applyChanges({ ...plugin, overrides });
  };

  const deleteOverride = () => {
    const overrides = { ...plugin.overrides };
    delete overrides[toString(selectedSource!)];

    applyChanges({ ...plugin, overrides });
    setSelectedSource(undefined);
  };

  const maybeOverride =
    selectedSource && plugin.overrides[toString(selectedSource)];
  const o = maybeOverride || selectedSource;

  return (
    <div className="override-controls">
      <EventSelector
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        overrides={plugin.overrides}
      />

      {o && selectedSource && (
        <>
          <p className="fields-caption">
            The following values will be transmitted instead of defaults:
          </p>
          <OverrideFields
            source={selectedSource}
            updateOverride={updateOverride}
            override={[...o] as NumberArrayWithStatus}
          />
        </>
      )}
      {maybeOverride && (
        <button className="delete" type="button" onClick={deleteOverride}>
          Delete override
        </button>
      )}
    </div>
  );
}
