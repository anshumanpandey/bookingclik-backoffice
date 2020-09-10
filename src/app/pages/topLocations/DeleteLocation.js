import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { reportPayment } from "../../crud/pay.crud";
import AxioHook from 'axios-hooks'
import { Modal } from "react-bootstrap";
import { deleteTopLocation } from '../../crud/toplocations.crud';

export const DeleteLocation = ({ handleClose, location }) => {
    const [deleteReq, doDelete] = AxioHook(deleteTopLocation(), { manual: true })


    return (
        <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
            <Modal.Header closeButton>
                <Modal.Title>Create Top Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Do you want to delete this location?</p>
            </Modal.Body>
            <Modal.Footer>
                <div className="kt-login__actions">
                    <button
                        type="submit"
                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                        disabled={deleteReq.loading}
                        onClick={() => {
                            handleClose()
                        }}
                    >
                        Cancel
                    </button>
                </div>
                <div className="kt-login__actions">
                    <button
                        type="submit"
                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                        disabled={deleteReq.loading}
                        onClick={() => {
                            doDelete({ data: { id: location.id }})
                            .then(() => handleClose("DELETE"))
                        }}
                    >
                        Delete
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
