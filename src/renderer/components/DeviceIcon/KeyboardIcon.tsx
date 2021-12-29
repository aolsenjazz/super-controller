/* eslint-disable react/no-array-index-key */
import KeyBlackIcon from './KeyBlackIcon';

/* zero-based, semitone distance from C */
const FUNDAMENTALS_BLACK = [1, 3, 6, 8, 10];

type PropTypes = {
  active: boolean;
  width: number;
  height: number;
  left: number;
  bottom: number;
  deviceWidth: number;
  deviceHeight: number;
};

/**
 * Simplified graphical representation of a keyboard
 *
 * @param { object } props Component props
 * @param { boolean } props.active Should the keyboard be highlighted?
 * @param { number } props.width Width (in inches) of the keyboard
 * @param { number } props.height Height (in inches) of the keyboard
 * @param { number } props.left Distance (in inches) from the left edge of the device
 * @param { number } props.bottom Distance (in inches) from the bottom edge of the device
 * @param { number } props.deviceWidth Width (in inches) of the device
 * @param { number } props.deviceHeight height (in inches) of the device
 */
export default function Keyboard(props: PropTypes) {
  const { active, height, width, left, bottom, deviceWidth, deviceHeight } =
    props;

  const style = {
    width: `${(width / deviceWidth) * 100}%`,
    height: `${(height / deviceHeight) * 100}%`,
    left: `${(left / deviceWidth) * 100 - 1}%`, // TODO: why is this 100-1
    bottom: `${(bottom / deviceHeight) * 100}%`,
  };

  return (
    <div id="keyboard-container" style={style} className="Input">
      <div className={`octave ${active ? 'active' : ''}`}>
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        {FUNDAMENTALS_BLACK.map((fundamental) => (
          <KeyBlackIcon
            fundamental={fundamental}
            key={fundamental}
            active={active}
          />
        ))}
      </div>
    </div>
  );
}
