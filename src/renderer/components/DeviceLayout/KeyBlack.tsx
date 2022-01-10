type PropTypes = {
  fundamental: number;
};

/**
 * Graphical representation of a black key
 *
 * @param fundamental Zero-based, semitone offset from C
 */
export default function KeyBlack(props: PropTypes) {
  const { fundamental } = props;

  // calculate distance from the left edge of parent octave
  const numKeysFromLeft = 0.5 + Math.floor(fundamental / 2);
  const adjustment = fundamental * Math.floor(fundamental / 6) * 1;

  return (
    <div
      className="key-black key"
      style={{
        left: `${16.2 * numKeysFromLeft - adjustment}%`,
      }}
    />
  );
}
