import { useMemo } from 'react';

import { selectRecentRemoteMessagesById } from '@features/recent-remote-messages/recent-remote-messages-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { SwitchDriver } from '@shared/driver-types/input-drivers/switch-driver';
import { msgEquals } from '@shared/util';

type PropTypes = {
  driver: SwitchDriver;
  id: string;
};

export function SwitchLayout(props: PropTypes) {
  const { driver, id } = props;

  const { steps } = driver;
  const recentMessages = useAppSelector(selectRecentRemoteMessagesById(id, 1));
  console.log(recentMessages);

  const step = useMemo(() => {
    if (!recentMessages.length) return driver.initialStep;

    for (let i = 0; i < steps.length; i++) {
      if (msgEquals(steps[i], recentMessages[0].msg)) {
        return i;
      }
    }

    return driver.initialStep;
  }, [recentMessages, driver, steps]);

  const position = step / steps.length;
  const iStyle = {
    top: `calc(${position * 100}% - 1px)`,
    left: -1,
    width: `100%`,
    height: `${(1 / steps.length) * 100}%`,
  };

  return (
    <div className="switch interactive-indicator">
      <div className="inner interactive-indicator" style={iStyle} />
    </div>
  );
}
