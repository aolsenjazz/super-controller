import React from 'react';

type PropTypes = {
  max: number;
  value: number;
  enabled: boolean;
  focus: boolean;
  width: string;
  height: string;
  handleWidth: string;
  handleHeight: string;
  overrideable: boolean;
  onClick: (event: React.MouseEvent) => void;
};

/**
 * @callback onClick
 * @param { React.MouseEvent } event Mouse event
 */

/**
 * Graphical representation of a wheel input
 *
 * @param { object } props Component props
 * @param { number } props.max Maximum value the wheel can represent
 * @param { number } props.value Current value represented by the wheel
 * @param { boolean } props.enabled Should the wheel respond to click events?
 * @param { boolean } props.focus Should the wheel be highlighted?
 * @param { boolean } props.overrideable Can this input be overridden?
 * @param { string } props.width CSS width attribute
 * @param { string } props.height CSS height attribute
 * @param { string } props.handleWidth CSS width attribute of the "grabbable" part of the input
 * @param { string } props.handleHeight CSS height attribute of the "grabbable" part of the input
 * @param { onClick } props.onClick Click listener for setting selected inputs
 */
export function WheelLayout(props: PropTypes) {
  const {
    width,
    height,
    max,
    value,
    enabled,
    focus,
    onClick,
    handleWidth,
    handleHeight,
    overrideable,
  } = props;

  const boundingStyle = {
    bottom: `calc(${handleHeight} / 2)`,
    height: `calc(100% - ${handleHeight})`,
  };

  const shift = value / max;
  const iStyle = {
    bottom: `${shift * 100}%`,
    left: 0,
    width: `calc(${handleWidth} - 2px)`,
    height: `calc(${handleHeight} + ${handleHeight} / 2 - 2px)`,
  };

  return (
    <div
      className={`wheel ${enabled ? 'hoverable' : ''} ${focus ? 'focus' : ''}${
        overrideable ? '' : 'disabled'
      }`}
      style={{ height, width }}
      onClick={(e) => onClick(e)}
      tabIndex={0}
      onKeyDown={() => {}}
      role="button"
    >
      <div className="bounding-box" style={boundingStyle}>
        <div className={`inner `} style={iStyle} />
      </div>
    </div>
  );
}
