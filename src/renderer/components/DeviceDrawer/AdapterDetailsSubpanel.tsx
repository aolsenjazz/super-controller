import HelpTip from '../HelpTip';

const tipBody = `When using a 5-pin adapter, only the adapter is visible to SuperController. Select your connected 5-pin device from the dropdown below.`;

export default function AdapterDetailsSubpanel() {
  return (
    <div className="adapter-details-subpanel">
      <p>5-pin adapter</p>
      <HelpTip body={tipBody} backgroundColor="rgba(0, 0, 0, 0.4)" size={14} />
    </div>
  );
}
