type PropTypes = {
  onClick: (on: boolean) => void;
};

export default function HalfOnPowerButton(props: PropTypes) {
  const { onClick } = props;

  return (
    <div
      className="power-button"
      style={{ position: 'relative' }}
      onClick={() => onClick(true)}
      role="presentation"
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '100%',
          backgroundColor: '#39aa4a',
          transform: 'rotate(-45deg)',
          position: 'absolute',
        }}
      />

      <div
        style={{
          height: '200%',
          width: '200%',
          backgroundColor: '#ff5e57',
          transform: 'rotate(135deg)',
          position: 'absolute',
          left: 4,
        }}
      />
    </div>
  );
}
