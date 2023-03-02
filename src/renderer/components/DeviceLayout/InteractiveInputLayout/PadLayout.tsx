import { FxDriver } from '@shared/driver-types';
import { ColorImpl } from '@shared/hardware-config';

type PropTypes = {
  shape: string;
  color: ColorImpl | undefined;
  fx: FxDriver | undefined;
};

export default function Pad(props: PropTypes) {
  const { shape, color, fx } = props;

  // const layoutDimens = /(circle|square)/.test(shape)
  //   ? { width: `${width}`, aspectRatio: '1' }
  //   : { width: `${width}`, height: `${height}` };

  const mod = color?.modifier || fx?.title;

  return (
    <div
      className="pad"
      style={{
        animationName: mod,
        backgroundColor: color?.string,
        animationTimingFunction: mod === 'Pulse' ? 'ease-in-out' : undefined,
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}
