import { selectInputConfigById } from '@features/input-configs/input-configs-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';
import { XYDTO } from '@shared/hardware-config/input-config/xy-config';
import { getQualifiedInputId } from '@shared/util';
import { ReactElement } from 'react';
import OsxTabs from 'renderer/components/OsxTabs';
import MonoInputConfigPanel from './MonoInputConfigSubpanel';

type PropTypes = {
  input: XYDTO;
};

export default function XYConfigPanel(props: PropTypes) {
  const { input } = props;
  const { x, y } = input;

  const xConfig = useAppSelector((state) =>
    selectInputConfigById(state, getQualifiedInputId(input.deviceId, x.id))
  ) as MonoInputDTO;

  const yConfig = useAppSelector((state) =>
    selectInputConfigById(state, getQualifiedInputId(input.deviceId, y.id))
  ) as MonoInputDTO;

  const XConfigPanel = <MonoInputConfigPanel input={xConfig} />;
  const YConfigPanel = <MonoInputConfigPanel input={yConfig} />;
  const Elements: ReactElement[] = [XConfigPanel, YConfigPanel];

  return (
    <OsxTabs tabBodies={Elements} tabLabels={['Horiztonal', 'Vertical']} />
  );
}
