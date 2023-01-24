import Icon from '@assets/warning-icon.svg';

type PropTypes = {
  warningBody: string;
};

export default function WarningIcon(props: PropTypes) {
  const { warningBody } = props;

  return (
    <div className="warning-icon">
      <img src={Icon} alt="warning icon" height="30" />
      <div className="tip-container">
        <p>{warningBody}</p>
      </div>
    </div>
  );
}
