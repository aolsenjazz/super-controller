import DrawerRightClosed from '@assets/drawer_right_closed.svg';
import DrawerRightOpen from '@assets/drawer_right_open.svg';
import DrawerLeftClosed from '@assets/drawer_left_closed.svg';
import DrawerLeftOpen from '@assets/drawer_left_open.svg';
import { usePanels } from '../../context/panel-context';

export default function DrawerToggles() {
  const { panel1State, setPanel1, panel2State, setPanel2 } = usePanels();

  return (
    <div className="drawer-toggles">
      <img
        src={panel1State.collapsed ? DrawerLeftClosed : DrawerLeftOpen}
        alt={panel1State.collapsed ? 'close left drawer' : 'show left drawer'}
        onClick={() => setPanel1(!panel1State.collapsed, true)}
        height="18"
        role="presentation"
      />
      <img
        src={panel2State.collapsed ? DrawerRightClosed : DrawerRightOpen}
        alt={panel2State.collapsed ? 'close right drawer' : 'show right drawer'}
        height={18}
        onClick={() => setPanel2(!panel2State.collapsed, true)}
        role="presentation"
      />
    </div>
  );
}
