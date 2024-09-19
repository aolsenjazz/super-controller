import { MidiEventOverride } from '../midi-event-override';
import EventSelector from './EventSelector';
import OverrideFields from './OverrideFields';

const { TranslatorService } = window;

type OverrideControlsProps = {
  selectedSource: NumberArrayWithStatus | undefined;
  setSelectedSource: (source: NumberArrayWithStatus | undefined) => void;
  overrides: MidiEventOverride[];
  pluginId: string;
};

export function OverrideControls(props: OverrideControlsProps) {
  const { selectedSource, setSelectedSource, overrides, pluginId } = props;

  const updateOverride = (
    source: NumberArrayWithStatus,
    override: NumberArrayWithStatus
  ) => {
    TranslatorService.updateOverride(pluginId, source, override);
  };

  const deleteOverride = () => {
    TranslatorService.deleteOverride(pluginId, selectedSource!);
    setSelectedSource(undefined);
  };

  const maybeOverride = overrides.find(
    (o) => JSON.stringify(o.source) === JSON.stringify(selectedSource)
  );
  const o = maybeOverride?.override || selectedSource;

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
