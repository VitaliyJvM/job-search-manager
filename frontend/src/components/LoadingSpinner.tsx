interface LoadingSpinnerProps {
  text?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ text = 'Loading...', fullPage = false }: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
        <div className="loading-overlay">
          <span className="loading-spinner" />
          <span>{text}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="loading-overlay">
      <span className="loading-spinner" />
      <span>{text}</span>
    </div>
  );
}
