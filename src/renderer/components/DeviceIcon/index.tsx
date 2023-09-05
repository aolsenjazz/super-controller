/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DeviceDriver } from '@shared/driver-types';

import { UsbIcon } from '../UsbIcon';
import KeyboardIcon from './KeyboardIcon';
import InputGridIcon from './InputGridIcon';

type PropTypes = {
  driver: DeviceDriver;
  active: boolean;
};

export default function DeviceIcon(props: PropTypes) {
  const { driver, active } = props;

  let Element: JSX.Element;

  if (driver.type === 'adapter') {
    Element = <UsbIcon active={active} />;
  } else {
    Element = (
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

  return <>{Element}</>;
}
