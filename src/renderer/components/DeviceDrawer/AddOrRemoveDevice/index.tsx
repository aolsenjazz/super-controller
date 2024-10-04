import NotConfigured from './NotConfigured';
import RemoveDeviceSubpanel from './RemoveDeviceSubpanel';

type PropTypes = {
  configured: boolean;
  nickname: string;
  portName: string;
  siblingIndex: number;
  id: string;
};

export default function AddOrRemoveDevice({
  configured,
  nickname,
  portName,
  siblingIndex,
  id,
}: PropTypes) {
  return (
    <>
      {configured ? (
        <RemoveDeviceSubpanel id={id} nickname={nickname} />
      ) : (
        <NotConfigured name={portName} siblingIndex={siblingIndex} />
      )}
    </>
  );
}
