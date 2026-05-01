import Modal from './Modal.tsx';

interface ConfirmDialogProps {
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title = 'Confirm Delete',
  message,
  confirmLabel = 'Delete',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      title=""
      onClose={onCancel}
      maxWidth="380px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="loading-spinner" style={{ width: 14, height: 14 }} /> : null}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="confirm-dialog">
        <div className="confirm-icon">🗑️</div>
        <h3 style={{ marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: '0.9rem' }}>{message}</p>
      </div>
    </Modal>
  );
}
