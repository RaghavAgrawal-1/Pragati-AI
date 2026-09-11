import Modal from "./Modal";
import Button from "../common/Button";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", tone = "primary", onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={tone} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-slate-600">{message}</p>
    </Modal>
  );
}
