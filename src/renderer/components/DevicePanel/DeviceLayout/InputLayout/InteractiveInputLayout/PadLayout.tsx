import { useMemo } from 'react';

import { PadDriver } from '@shared/driver-types/input-drivers/pad-driver';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { selectRecentLoopbackMessagesById } from '@features/recent-loopback-messages/recent-loopback-messages-slice';
import { msgEquals, subtractMidiArrays } from '@shared/util';

type PropTypes = {
  driver: PadDriver;
  id: string;
};

function removeNegatives(arr: NumberArrayWithStatus) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] < 0 ? 0 : arr[i];
  }
  return arr;
}

export default function Pad(props: PropTypes) {
  const { driver, id } = props;

  const lastMsgArr = useAppSelector(selectRecentLoopbackMessagesById(id, 1));

  const color = useMemo(() => {
    if (lastMsgArr.length !== 1) return undefined;
    const msg = lastMsgArr[0];

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
      // .map((arr) => removeNegatives(arr))
      .map((diffArr) => diffArr.reduce((a, b) => a + b));

    // find the smallest positive difference between arrays, and return the index
    const relevantIdx = diffsFromMsg.reduce(
      (lowestIndex, num, index, array) =>
        num < array[lowestIndex] && num >= 0 ? index : lowestIndex,
      0
    );

    if (driver.number === 32) {
      console.log(msg, unaffectedColorCandidates, diffsFromMsg);
      // console.log(driver.availableColors[relevantIdx]);
    }

    return driver.availableColors[relevantIdx];
  }, [lastMsgArr, driver.availableColors, driver.number]);

  const fx = useMemo(() => {
    if (lastMsgArr.length !== 1 || !color) return undefined;
    const msg = lastMsgArr[0];

    const currentFxVal = subtractMidiArrays(msg, color.array);
    return driver.availableFx.find((f) => {
      for (let i = 0; i < f.validVals.length; i++) {
        if (msgEquals(currentFxVal, f.validVals[i])) return true;
      }
      return false;
    });
  }, [lastMsgArr, color, driver.availableFx]);

  return (
    <div
      className="pad interactive-indicator"
      style={{
        animationName: color?.modifier,
        backgroundColor: color?.string,
        animationTimingFunction:
          color?.modifier === 'pulse' ? 'ease-in-out' : undefined,
        borderRadius: driver.shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}
