type SectionHeaderProps = {
  title: string;
  size: 'large' | 'small';
};

export default function SectionHeader({ title, size }: SectionHeaderProps) {
  return (
    <div className={`section-header ${size}`}>
      <div className="circle" />
      <h2>{title}</h2>
      <div className="circle" />
    </div>
  );
}
