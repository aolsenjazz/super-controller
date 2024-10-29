type StatusSelectProps = {
  eligibleStatuses: (StatusString | 'noteon/noteoff')[];
  defaultStatus: StatusString | 'noteon/noteoff';
  statusOverride: StatusString | 'noteon/noteoff';
  onStatusChange: (status: StatusString | 'noteon/noteoff') => void;
};

export function StatusSelect(props: StatusSelectProps) {
  const { eligibleStatuses, defaultStatus, statusOverride, onStatusChange } =
    props;

  const statusLabels = eligibleStatuses.map((status) => {
    return `${status}${status === defaultStatus ? ' [default]' : ''}`;
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as StatusString | 'noteon/noteoff';
    onStatusChange(status);
  };

  return (
    <label>
      Event type:
      <select value={statusOverride || defaultStatus} onChange={handleChange}>
        {eligibleStatuses.map((status, i) => (
          <option key={status} value={status}>
            {statusLabels[i]}
          </option>
        ))}
      </select>
    </label>
  );
}
