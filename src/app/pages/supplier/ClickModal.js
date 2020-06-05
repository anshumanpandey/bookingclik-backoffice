import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { reportPayment } from "../../crud/pay.crud";
import DataTable from 'react-data-table-component';
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";


const CreateLocationComponent = ({ handleClose, iataCode, user }) => {
    const [amount, setAmount] = useState(0);
    const [payReq, doReport] = AxioHook(reportPayment(), { manual: true })


    return (
        <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
            <Modal.Header closeButton>
                <Modal.Title>Clicks</Modal.Title>
            </Modal.Header>
            <DataTable
                noHeader={true}
                subHeaderAlign="center"
                columns={[
                    {
                        name: 'IP',
                        selector: 'ip',
                    },
                    {
                        name: 'Country',
                        selector: 'country',
                    },
                    {
                        name: 'Created At',
                        selector: 'created_at',
                    },
                ]}
                pagination={true}
                data={user.ClickTracks}
            />
        </Modal>
    );
}


export const ClickModal = injectIntl(
    connect(
        null,
    )(CreateLocationComponent)
);