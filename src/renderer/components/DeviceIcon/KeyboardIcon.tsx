/* eslint-disable react/no-array-index-key */
import KeyBlackIcon from './KeyBlackIcon';

/* zero-based, semitone distance from C */
const FUNDAMENTALS_BLACK = [1, 3, 6, 8, 10];

type PropTypes = {
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
 * @param props Component props
 * @param props.width Width (in inches) of the keyboard
 * @param props.height Height (in inches) of the keyboard
 * @param props.left Distance (in inches) from the left edge of the device
 * @param props.bottom Distance (in inches) from the bottom edge of the device
 * @param props.deviceWidth Width (in inches) of the device
 * @param props.deviceHeight height (in inches) of the device
 */
export default function Keyboard(props: PropTypes) {
  const { height, width, left, bottom, deviceWidth, deviceHeight } = props;

  const style = {
    width: `calc(${(width / deviceWidth) * 100}% - 1px)`, // -1px because of right border
    height: `${(height / deviceHeight) * 100}%`,
    left: `${(left / deviceWidth) * 100}%`,
    bottom: `${(bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="keyboard-container input" style={style}>
      <div className="octave">
        <div className="key key-white" />
        <div className="key key-white" />
        <div className="key key-white" />
        <div className="key key-white" />
        <div className="key key-white" />
        <div className="key key-white" />
        <div className="key key-white" />
        {FUNDAMENTALS_BLACK.map((fundamental) => (
          <KeyBlackIcon fundamental={fundamental} key={fundamental} />
        ))}
      </div>
    </div>
  );
}
