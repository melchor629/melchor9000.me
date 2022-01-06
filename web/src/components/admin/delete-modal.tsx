import { Modal } from 'bootstrap'
import React, { useCallback, useEffect, useState } from 'react'

interface DeleteModalProps {
  item: { title: string } | null
  onClose: () => void
  onDelete: () => void
}

const DeleteModal = ({ item, onClose, onDelete }: DeleteModalProps) => {
  const [[modal, element], setModal] = useState<[Modal, HTMLDivElement] | []>([])

  const handleModalRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      setModal([new Modal(el), el])
    } else {
      setModal([])
    }
  }, [])

  useEffect(() => {
    if (item) {
      modal?.show()
    } else {
      modal?.hide()
    }
  }, [modal, item])

  useEffect(() => {
    element?.addEventListener('hidden.bs.modal', onClose, false)

    return () => element?.removeEventListener('hidden.bs.modal', onClose, false)
  }, [element, onClose])

  const deletePressed = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onDelete()
  }, [onDelete])

  return (
    <div
      ref={handleModalRef}
      className="modal fade"
      id="deleteModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="deleteModalTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteModalTitle">
              Borrar
              {item?.title}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <p className="lead">
              ¿Estás seguro de que quieres borrar &quot;
              {item?.title}
              &quot;?
            </p>
            <p className="text-muted">Recuerda que esta operación no se puede deshacer</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              CANCELAR
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={deletePressed}
            >
              BORRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
