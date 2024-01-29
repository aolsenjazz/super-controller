import { useCallback } from 'react';

import NicknameSubpanel from '../../NicknameSubpanel';
import SectionHeader from '../../SectionHeader';
import { BaseInputGroup } from './input-group/base-input-group';

type PropTypes = {
  group: BaseInputGroup;
};

export default function InputDetailsSubpanel(props: PropTypes) {
  const { group } = props;

  const name =
    group.inputs.length > 1
      ? `${group.inputs.length} Input Selected`
      : group.inputs[0].id;

  const onChange = useCallback((n: string) => {
    return n;
  }, []);

  return (
    <div className="details-panel input-details-panel">
      <div>
        <SectionHeader title="INPUT SETTINGS" size="large" />
        <NicknameSubpanel
          name={name}
          nickname={name}
          onNicknameChange={onChange}
        />
      </div>
    </div>
  );
}
