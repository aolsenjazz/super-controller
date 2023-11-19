import { DeviceDriver } from '@shared/driver-types';

import Keyboard from './KeyboardLayout';
import InputGridLayout from './InputGridLayout';

type PropTypes = {
  driver: DeviceDriver;
  onClick: (e: React.MouseEvent, ids: string[]) => void;
};

export default function DeviceLayout(props: PropTypes) {
  const { driver, onClick } = props;
  // TODO: Pretty sure we removed need for the --r variable. research
  return (
    <div
      style={{
        '--r': `${driver.width}/${driver.height}`, // TODO: really should document this
        ...driver.style,
      }}
      className="device-layout"
    >
      <div id={driver.name} className="device-root">
        {driver.keyboard ? (
          <Keyboard
            nOctaves={driver.keyboard.nOctaves}
            width={driver.keyboard.width}
            height={driver.keyboard.height}
            left={driver.keyboard.left}
            bottom={driver.keyboard.bottom}
            deviceWidth={driver.width}
            deviceHeight={driver.height}
            enabled={driver.keyboard.enabled}
          />
        ) : null}

        {driver.inputGrids.map((inputGrid) => {
          return (
            <InputGridLayout
              key={inputGrid.id}
              grid={inputGrid}
              deviceWidth={driver.width}
              deviceHeight={driver.height}
              onClick={onClick}
            />
          );
        })}
      </div>
    </div>
  );
}
