import React, { useEffect } from 'react'
import $ from 'jquery'

interface DeleteModalProps {
  item: { title: string } | null
  onClose: () => void
  onDelete: () => void
}

const DeleteModal = ({ item, onClose, onDelete }: DeleteModalProps) => {
  useEffect(() => {
    if (item) {
      $('#deleteModal').on('hidden.bs.modal', onClose).modal('show')
      return () => $('#deleteModal').off('hidden.bs.modal', onClose)
    }

    $('#deleteModal').off('hidden.bs.modal')
    return () => {}
  }, [item, onClose])

  if (item === null) {
    return null
  }

  const deletePressed = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onDelete()
  }

  return (
    <div
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
              { item.title }
            </h5>
            <button type="button" className="close" aria-label="Close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className="lead">
              ¿Estás seguro de que quieres borrar &quot;
              { item.title }
              &quot;?
            </p>
            <p className="text-muted">Recuerda que esta operación no se puede deshacer</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">
              CANCELAR
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
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
