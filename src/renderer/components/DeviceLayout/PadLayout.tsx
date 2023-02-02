import { FxDriver } from '@shared/driver-types';
import { ColorImpl } from '@shared/hardware-config';

type PropTypes = {
  onClick: (event: React.MouseEvent, id: string) => void;
  id: string;
  shape: string;
  color: ColorImpl | undefined;
  width: string;
  height: string;
  enabled: boolean;
  focus: boolean;
  fx: FxDriver | undefined;
  overrideable: boolean;
};

/**
 * @callback onClick
 * @param event Mouse event
 * @param id Input id
 */

/**
 * Graphical representation of a pad input
 *
 * @param props Component props
 * @param props.onClick Click listener to set selected inputs
 * @param props.shape 'circle' | 'rect' | 'square'
 * @param props.color Backlight color
 * @param props.width CSS width attribute
 * @param props.hieght CSS height attribute
 * @param enabled Should this input respond to click events?
 * @param focus Should this input be highlighted?
 * @param overrideable Can this input be overridden?
 */
export default function Pad(props: PropTypes) {
  const {
    shape,
    width,
    height,
    onClick,
    enabled,
    focus,
    color,
    id,
    fx,
    overrideable,
  } = props;

  const layoutDimens = /(circle|square)/.test(shape)
    ? { width: `${width}`, aspectRatio: '1' }
    : { width: `${width}`, height: `${height}` };

  const mod = color?.modifier || fx?.title;

  return (
    <div
      className={`pad ${focus ? 'focus' : ''} ${enabled ? 'hoverable' : ''}${
        overrideable ? '' : 'disabled'
      }`}
      onMouseDown={(event) => {
        onClick(event, id);
      }}
      style={{
        ...layoutDimens,
        animationName: mod,
        backgroundColor: color?.string,
        animationTimingFunction: mod === 'Pulse' ? 'ease-in-out' : undefined,
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      aria-label={`pad ${id}`}
    />
  );
}
