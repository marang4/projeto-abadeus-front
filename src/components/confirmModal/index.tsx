import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { ExclamationTriangleFill, CheckCircleFill, InfoCircleFill } from 'react-bootstrap-icons';
import './index.css';

interface ConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm?: () => void;
  title?: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'success' | 'primary' | 'info';
  isAlert?: boolean; // Define se é apenas um aviso (oculta o botão de cancelar)
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  isLoading = false,
  variant = 'danger',
  isAlert = false
}) => {
  
  const renderIcon = () => {
    switch (variant) {
      case 'success': return <CheckCircleFill size={48} className="confirm-icon" />;
      case 'info': return <InfoCircleFill size={48} className="confirm-icon" />;
      default: return <ExclamationTriangleFill size={48} className="confirm-icon" />;
    }
  };

  const defaultTitle = title || (isAlert && variant === 'success' ? "Sucesso!" : "Confirmar Ação");

  return (
    <Modal
      show={show}
      onHide={isLoading ? undefined : onHide}
      centered
      dialogClassName="custom-modal confirm-modal"
      backdrop="static"
    >
      <Modal.Body className="text-center p-4 p-sm-5">
        <div className={`confirm-icon-wrapper ${variant}`}>
          {renderIcon()}
        </div>
        
        <h4 className="confirm-modal-title">{defaultTitle}</h4>
        <p className="confirm-modal-message mt-3 mb-4">{message}</p>

        <div className="confirm-modal-actions d-flex justify-content-center gap-3">
          {!isAlert && (
            <Button
              variant="outline-secondary"
              onClick={onHide}
              disabled={isLoading}
              className="px-4 fw-medium"
            >
              {cancelText}
            </Button>
          )}
          
          <Button
            variant={variant}
            onClick={isAlert ? onHide : onConfirm}
            disabled={isLoading}
            className={`px-4 fw-medium text-white`}
          >
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Processando...
              </>
            ) : (
              isAlert ? "Entendi" : confirmText
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;