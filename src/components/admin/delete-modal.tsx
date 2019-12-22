import * as React from 'react'

const $ = require('jquery')

interface DeleteModalProps {
    item: { title: string } | null
    onClose: () => void
    onDelete: () => void
}

export default class DeleteModal extends React.Component<DeleteModalProps> {
    componentDidUpdate(prevProps: DeleteModalProps) {
        if(prevProps.item === null && this.props.item !== null) {
            $('#deleteModal').on('hidden.bs.modal', () => this.props.onClose())
                .modal('show')
        } else if(prevProps.item !== null && this.props.item === null) {
            $('#deleteModal').off('hidden.bs.modal')
        }
    }

    render() {
        if(this.props.item === null) {
            return false
        }

        const { item, onDelete } = this.props

        const deletePressed = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            onDelete()
        }

        return (
            <div className="modal fade" id="deleteModal" tabIndex={ -1 } role="dialog"
                aria-labelledby="deleteModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalTitle">Borrar { item.title }</h5>
                            <button type="button" className="close" aria-label="Close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="lead">¿Estás seguro de que quieres borrar "{ item.title }"?</p>
                            <p className="text-muted">Recuerda que esta operación no se puede deshacer</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                CANCELAR
                            </button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal"
                                onClick={ deletePressed }>
                                BORRAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
