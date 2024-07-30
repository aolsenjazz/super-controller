import { Color, ColorDescriptor, FxDriver } from '@shared/driver-types';
import { colorDisplayName } from '@shared/util';

import BasicSelect from '../../../BasicSelect';
import FXConfig from './FXConfig';

type PropTypes = {
  color: Color | undefined;
  fx: FxDriver | undefined;
  fxVal: MidiNumber[] | undefined | '<multiple values>';
  state: number;
  availableColors: ColorDescriptor[];
  availableFx: FxDriver[];
  onChange: (
    state: number,
    color: ColorDescriptor,
    fx?: FxDriver,
    fxVal?: MidiNumber[]
  ) => void;
};

export default function ColorConfigRow(props: PropTypes) {
  const { color, state, availableColors, availableFx, fx, fxVal, onChange } =
    props;

  const availableColorNames = availableColors.map((c) => colorDisplayName(c));
  const stateStr = state === 0 ? 'off' : 'on';

  return (
    <div key={state} id="backlight-config">
      <div className="settings-line color-setting">
        <h5>State: {stateStr}</h5>
      </div>
      <div className="settings-line color-setting">
        <p>Color:</p>
        <div
          className="color-sample"
          style={{ backgroundColor: `${color ? color.string : ''}` }}
        />
        <BasicSelect
          value={color ? colorDisplayName(color) : ''}
          valueList={availableColorNames}
          labelList={availableColorNames}
          onChange={(cName) => {
            const c = availableColors.filter(
              (availC) => colorDisplayName(availC) === cName
            );
            onChange(state, c[0], fx);
          }}
        />
      </div>
      {color?.effectable && fxVal ? (
        <FXConfig
          eligibleFx={availableFx}
          activeFx={fx}
          fxVal={fxVal}
          onChange={(newFx, newFxVal) => {
            onChange(state, color, newFx, newFxVal);
          }}
        />
      ) : null}

      <div className="separator" />
    </div>
  );
}
