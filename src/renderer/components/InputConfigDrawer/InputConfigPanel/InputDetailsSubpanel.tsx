import { useCallback } from 'react';

import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';

import ControlledInput from '../../ControlledInput';
import SectionHeader from '../../SectionHeader';

type PropTypes = {
  input: InputDTO;
};

const { InputConfigService } = window;

export default function InputDetailsSubpanel(props: PropTypes) {
  const { input } = props;

  const name = `Input: ${input.nickname || input.id}`;
  const { nickname } = input;

  const onChange = useCallback(
    (n: string) => {
      const newConf = {
        ...input,
        nickname: n,
      };
      InputConfigService.updateInputs([newConf]);
    },
    [input],
  );

  return (
    <div className="details-panel input-details-panel">
      <div>
        <SectionHeader title="INPUT SETTINGS" size="large" />
        <div className="subpanel nickname-subpanel">
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
