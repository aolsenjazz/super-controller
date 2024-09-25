import { toString } from '../util';
import EventSelector from './EventSelector';
import OverrideFields from './OverrideFields';

const { TranslatorService } = window;

type OverrideControlsProps = {
  selectedSource: NumberArrayWithStatus | undefined;
  setSelectedSource: (source: NumberArrayWithStatus | undefined) => void;
  overrides: Record<string, NumberArrayWithStatus | undefined>;
  pluginId: string;
};

export function OverrideControls(props: OverrideControlsProps) {
  const { selectedSource, setSelectedSource, overrides, pluginId } = props;

  const updateOverride = (
    source: NumberArrayWithStatus,
    override: NumberArrayWithStatus
  ) => {
    TranslatorService.updateOverride(pluginId, toString(source), override);
  };

  const deleteOverride = () => {
    TranslatorService.deleteOverride(pluginId, toString(selectedSource!));
    setSelectedSource(undefined);
  };

  const maybeOverride = selectedSource && overrides[toString(selectedSource)];
  const o = maybeOverride || selectedSource;

  return (
    <div className="override-controls">
      <EventSelector
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        overrides={overrides}
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
