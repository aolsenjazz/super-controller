import { useEffect, useState } from 'react';

import { Color, PadDriver } from '@shared/driver-types';
import { subtractMidiArrays } from '@shared/util';
import { useSelector } from 'react-redux';
import { selectSelectedDevice } from '@selectors/selected-device-selector';

const { HostService } = window;

type PropTypes = {
  driver: PadDriver;
  id: string;
};

export default function Pad(props: PropTypes) {
  const { driver, id } = props;
  const selectedDevice = useSelector(selectSelectedDevice);

  const [color, setColor] = useState<Color>();

  // Whenever a loopback message is received, set the pad color and fx if appropriate
  useEffect(() => {
    function cb(msg: NumberArrayWithStatus) {
      // Map available colors to their arrays, which we will use to determine the base
      // color mapping of a message prior to affecting with FX arrays
      const unaffectedColorCandidates = driver.availableColors.map(
        (c) => c.array
      );

      // sum(sourceMsgParts) - sum(unaffectedColorCandidateArray). The smallest positive
      // difference between these arrays indicates that the correlating array
      // represents the relevant color, sans fx
      const diffsFromMsg = unaffectedColorCandidates
        .map((arr) => subtractMidiArrays(msg, arr))
        .map((diffArr) => diffArr.reduce((a, b) => a + b));

      // find the smallest positive difference between arrays, and return the index
      const relevantIdx = diffsFromMsg.reduce(
        (lowestIndex, num, index, array) =>
          num < array[lowestIndex] && num >= 0 ? index : lowestIndex,
        0
      );

      const c = driver.availableColors[relevantIdx];
      setColor(c);
    }

    const off = HostService.listenToLoopbackMessages(
      selectedDevice!.id,
      id,
      cb
    );

    return () => off();
  }, [driver.availableColors, selectedDevice, id]);

  return (
    <div
      className="pad interactive-indicator"
      style={{
        // animationName: mod,
        backgroundColor: color?.string,
        // animationTimingFunction: mod === 'Pulse' ? 'ease-in-out' : undefined,
        borderRadius: driver.shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}
