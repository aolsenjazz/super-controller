import { selectManyInputConfigs } from '@features/input-configs/input-configs-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { SwitchDTO } from '@shared/hardware-config/input-config/switch-config';
import { SwitchStepDTO } from '@shared/hardware-config/input-config/switch-step-config';
import { getQualifiedInputId } from '@shared/util';

import { ReactElement } from 'react';
import OsxTabs from 'renderer/components/OsxTabs';
import MonoInputConfigPanel from '../MonoInputConfigSubpanel';

type PropTypes = {
  input: SwitchDTO;
};

export default function SwitchConfigSubpanel(props: PropTypes) {
  const { input } = props;

  const configIds = input.steps.map((s) => s.id);
  const configQIds = configIds.map((i) =>
    getQualifiedInputId(input.deviceId, i)
  );
  const configs = useAppSelector((state) =>
    selectManyInputConfigs(state, configQIds)
  ) as SwitchStepDTO[];

  const TabBodies: ReactElement[] = [];
  const tabLabels: string[] = [];

  configs.forEach((c) => {
    TabBodies.push(<MonoInputConfigPanel input={c} />);
    tabLabels.push(c.label);
  });

  return <OsxTabs tabBodies={TabBodies} tabLabels={tabLabels} />;
}
