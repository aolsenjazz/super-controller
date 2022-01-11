/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DeviceDriver } from '@shared/driver-types';

import KeyboardIcon from './KeyboardIcon';
import InputGridIcon from './InputGridIcon';

type PropTypes = {
  driver: DeviceDriver;
  active: boolean;
};

/**
 * Simplified graphical representation of a hardware device
 *
 * @param props Component props
 * @param props.driver Driver for the given device
 * @param props.active Is the current device selected?
 */
export default function DeviceLayout(props: PropTypes) {
  const { driver, active } = props;

  return (
    <div
      style={{ aspectRatio: `${driver.width}/${driver.height}` }}
      className={`device-icon ${active ? 'active' : ''}`}
    >
      <div id={driver.name}>
        {driver.keyboard ? (
          <KeyboardIcon
            width={driver.keyboard.width}
            height={driver.keyboard.height}
            left={driver.keyboard.left}
            bottom={driver.keyboard.bottom}
            deviceWidth={driver.width}
            deviceHeight={driver.height}
          />
        ) : null}

        {driver.inputGrids.map((inputGrid) => (
          <InputGridIcon
            key={inputGrid.id}
            inputGrid={inputGrid}
            deviceWidth={driver.width}
            deviceHeight={driver.height}
          />
        ))}
      </div>
    </div>
  );
}
