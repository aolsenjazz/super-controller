import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';
import { useCallback, useMemo } from 'react';

import NicknameSubpanel from '../../NicknameSubpanel';
import SectionHeader from '../../SectionHeader';

type PropTypes = {
  configs: InputConfigStub[];
  deviceId: string;
};

const { ConfigService } = window;

export default function InputDetailsSubpanel(props: PropTypes) {
  const { configs, deviceId } = props;

  const name = useMemo(() => {
    return configs.length > 1
      ? `${configs.length} Inputs Selected`
      : `Input: ${configs[0].nickname || configs[0].id}`;
  }, [configs]);

  const nickname = useMemo(() => {
    return configs.length > 1 ? '' : configs[0].nickname;
  }, [configs]);

  const onChange = useCallback(
    (n: string) => {
      const newConf = {
        ...configs[0],
        nickname: n,
      };
      ConfigService.updateInputs(deviceId, [newConf]);
    },
    [configs, deviceId]
  );

  return (
    <div className="details-panel input-details-panel">
      <div>
        <SectionHeader title="INPUT SETTINGS" size="large" />
        <NicknameSubpanel
          name={name}
          nickname={nickname || ''}
          onNicknameChange={onChange}
          deactivated={configs.length !== 1}
        />
      </div>
    </div>
  );
}
