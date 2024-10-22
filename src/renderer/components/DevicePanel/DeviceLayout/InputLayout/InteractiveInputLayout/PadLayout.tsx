import { useEffect, useState } from 'react';

import { PadDriver } from '@shared/driver-types/input-drivers/pad-driver';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { selectRecentLoopbackMessages } from '@features/recent-loopback-messages/recent-loopback-messages-slice';
import { msgEquals, sumMidiArrays } from '@shared/util';
import { Color } from '@shared/driver-types/color';
import { FxDriver } from '@shared/driver-types/fx-driver';

type PropTypes = {
  driver: PadDriver;
  id: string;
};

export default function Pad(props: PropTypes) {
  const { driver, id } = props;
  if (driver.number === 32) {
    console.log(id);
  }

  const recentMessages = useAppSelector((state) =>
    selectRecentLoopbackMessages(state, id)
  );

  const [color, setColor] = useState<Color>();
  const [fx, setFx] = useState<FxDriver>();

  useEffect(() => {
    if (!recentMessages || recentMessages.length === 0) {
      setColor(undefined);
      return;
    }
    const lastMsg = recentMessages.at(-1)!;

    driver.availableColors.forEach((c) => {
      // try to apply fx if they exist
      driver.availableFx.forEach((fxDriver) => {
        fxDriver.validVals.forEach((fxArr) => {
          const affectedColor = sumMidiArrays(c.array, fxArr);
          if (msgEquals(affectedColor, lastMsg.msg)) {
            setColor(c);
            setFx(fxDriver);
          }
        });
      });

      // set color independent of fx, if necessary
      if (msgEquals(c.array, lastMsg.msg)) {
        setColor(c);
      }
    });
  }, [recentMessages, driver]);

  return (
    <div
      className="pad interactive-indicator"
      style={{
        animationName: color?.modifier || fx?.title,
        backgroundColor: color?.string,
        animationTimingFunction:
          fx?.title === 'Pulse' ? 'ease-in-out' : undefined,
        borderRadius: driver.shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}
