import { XYDTO } from '@shared/hardware-config/input-config/xy-config';
import { ReactElement } from 'react';
import OsxTabs from 'renderer/components/OsxTabs';
import MonoInputConfigPanel from './MonoInputConfigSubpanel';

type PropTypes = {
  input: XYDTO;
};

export default function XYConfigPanel(props: PropTypes) {
  const { input } = props;
  const { x, y } = input;

  const XConfigPanel = <MonoInputConfigPanel input={x} />;
  const YConfigPanel = <MonoInputConfigPanel input={y} />;
  const Elements: ReactElement[] = [XConfigPanel, YConfigPanel];

  return (
    <OsxTabs tabBodies={Elements} tabLabels={['Horiztonal', 'Vertical']} />
  );
}
