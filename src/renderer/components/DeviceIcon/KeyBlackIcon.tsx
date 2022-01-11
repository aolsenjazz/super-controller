type PropTypes = {
  fundamental: number;
};

/**
 * Simplified graphical representation of a black key
 *
 * @param props Component props
 * @param props.fundamental Zero-based offset from C in the same octave (1,3,6,8 or 10)
 */
export default function KeyBlackIcon(props: PropTypes) {
  const { fundamental } = props;

  // B.S. math to calculate distance from the left edge of parent octave
  const numKeysFromLeft = Math.floor(0.5 + Math.floor(fundamental / 2));
  const adjustment = fundamental * Math.floor(fundamental / 6);

  return (
    <div
      className="key-black key"
      style={{
        left: `${16.2 * numKeysFromLeft - adjustment + 9}%`,
      }}
    />
  );
}
