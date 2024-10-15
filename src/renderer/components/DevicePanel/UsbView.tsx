import { UsbIcon } from '../UsbIcon';

type PropTypes = {
  active: boolean;
};

export default function UsbView(props: PropTypes) {
  const { active } = props;
  return (
    <div className="device-layout">
      <UsbIcon active={active} />
    </div>
  );
}
