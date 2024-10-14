import { InputShape } from '@shared/driver-types/input-drivers/base-input-driver';

type PropTypes = {
  shape: InputShape;
};

export default function NoninteractiveInputLayout(props: PropTypes) {
  const { shape } = props;

  return (
    <div
      className="pad noninteractive"
      style={{
        borderRadius: shape === 'circle' ? '100%' : '',
      }}
    />
  );
}
