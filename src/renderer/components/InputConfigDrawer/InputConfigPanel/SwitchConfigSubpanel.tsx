import { ReactElement } from 'react';

import { SwitchDTO } from '@shared/hardware-config/input-config/switch-config';

import OsxTabs from 'renderer/components/OsxTabs';
import MonoInputConfigPanel from './MonoInputConfigSubpanel';

type PropTypes = {
  input: SwitchDTO;
};

export default function SwitchConfigSubpanel(props: PropTypes) {
  const { input } = props;

  const TabBodies: ReactElement[] = [];
  const tabLabels: string[] = [];

  input.steps.forEach((c) => {
    TabBodies.push(<MonoInputConfigPanel input={c} />);
    tabLabels.push(c.label);
  });

  return <OsxTabs tabBodies={TabBodies} tabLabels={tabLabels} />;
}
