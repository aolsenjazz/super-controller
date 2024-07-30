import NotConfigured from './NotConfigured';
import RemoveDeviceSubpanel from './RemoveDeviceSubpanel';

type PropTypes = {
  configured: boolean;
  nickname: string;
  id: string;
};

export default function AddOrRemoveDevice({
  configured,
  nickname,
  id,
}: PropTypes) {
  return (
    <>
      {configured ? (
        <RemoveDeviceSubpanel id={id} nickname={nickname} />
      ) : (
        <NotConfigured />
      )}
    </>
  );
}
