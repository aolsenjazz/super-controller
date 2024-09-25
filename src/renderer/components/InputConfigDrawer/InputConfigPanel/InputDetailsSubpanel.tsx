import { useCallback, useMemo } from 'react';

import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';

import ControlledInput from '../../../components/ControlledInput';
import SectionHeader from '../../SectionHeader';

type PropTypes = {
  configs: InputDTO[];
  deviceId: string;
};

const { InputConfigService } = window;

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
      InputConfigService.updateInputs(deviceId, [newConf]);
    },
    [configs, deviceId]
  );

  return (
    <div className="details-panel input-details-panel">
      <div>
        <SectionHeader title="INPUT SETTINGS" size="large" />
        <div
          className={`subpanel nickname-subpanel ${
            configs.length !== 1 ? 'deactivated' : ''
          }`}
        >
          <div className="nickname-display">
            <h1>{name}</h1>
          </div>

          <label htmlFor="nickname-input">
            Nickname:
            <ControlledInput
              id="nickname-input"
              type="text"
              value={nickname}
              onChange={(e) => onChange(e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
