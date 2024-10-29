type PropTypes = {
  on: boolean;
  onClick: () => void;
};

export default function PowerButton(props: PropTypes) {
  const { on, onClick } = props;

  return (
    <div
      className={`power-button ${on ? 'on' : 'off'}`}
      onClick={onClick}
      role="presentation"
    />
  );
}
