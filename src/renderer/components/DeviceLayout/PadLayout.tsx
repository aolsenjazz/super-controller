import { Color } from '../../../driver-types';

type PropTypes = {
  onClick: (event: React.MouseEvent, id: string) => void;
  id: string;
  shape: string;
  color: Color | undefined;
  width: string;
  height: string;
  enabled: boolean;
  focus: boolean;
  overrideable: boolean;
};

/**
 * @callback onClick
 * @param { React.MouseEvent } event Mouse event
 * @param { string } id Input id
 */

/**
 * Graphical representation of a pad input
 *
 * @param { object } props Component props
 * @param { onClick } props.onClick Click listener to set selected inputs
 * @param { string } props.shape 'circle' | 'rect' | 'square'
 * @param { Color | undefined } props.color Backlight color
 * @param { string } props.width CSS width attribute
 * @param { string } props.hieght CSS height attribute
 * @param { boolean } enabled Should this input respond to click events?
 * @param { boolean } focus Should this input be highlighted?
 * @param { boolean } overrideable Can this input be overridden?
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
    overrideable,
  } = props;

  return (
    <div
      className={`pad ${focus ? 'focus' : ''} ${enabled ? 'hoverable' : ''}${
        overrideable ? '' : 'disabled'
      }`}
      onMouseDown={(event) => {
        onClick(event, id);
      }}
      style={{
        width,
        height,
        animationName: color?.modifier,
        backgroundColor: color?.string,
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      aria-label={`pad ${id}`}
    />
  );
}
