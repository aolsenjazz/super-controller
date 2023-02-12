type PropTypes = {
  body: string;
  transform?: string;
};

export default function HelpTip(props: PropTypes) {
  const { body, transform } = props;

  return (
    <div className="help-tip">
      <p style={{ transform }}>{body}</p>
    </div>
  );
}

HelpTip.defaultProps = {
  transform: '',
};
