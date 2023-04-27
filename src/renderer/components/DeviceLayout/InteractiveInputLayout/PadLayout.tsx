import { FxDriver, ColorDescriptor } from '@shared/driver-types';

type PropTypes = {
  shape: string;
  color: ColorDescriptor | undefined;
  fx: FxDriver | undefined;
};

export default function Pad(props: PropTypes) {
  const { shape, color, fx } = props;

  const mod = color?.modifier || fx?.title;

  return (
    <div
      className="pad interactive-indicator"
      style={{
        animationName: mod,
        backgroundColor: color?.string,
        animationTimingFunction: mod === 'Pulse' ? 'ease-in-out' : undefined,
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}
