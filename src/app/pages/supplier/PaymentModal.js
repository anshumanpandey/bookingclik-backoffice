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
                <Modal.Title>Payments</Modal.Title>
            </Modal.Header>
            <DataTable
                noHeader={true}
                subHeaderAlign="center"
                columns={[
                    {
                        name: 'Order ID',
                        selector: 'id',
                    },
                    {
                        name: 'Amount',
                        selector: 'amount',
                    },
                    {
                        name: 'Created At',
                        selector: 'createdAt',
                    },
                ]}
                pagination={true}
                data={user.Payments}
            />
        </Modal>
    );
}


export const PaymentModal = injectIntl(
    connect(
        null,
    )(CreateLocationComponent)
);