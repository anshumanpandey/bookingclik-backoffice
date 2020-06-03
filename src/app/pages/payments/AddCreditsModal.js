import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { reportPayment } from "../../crud/pay.crud";
import {Decimal} from 'decimal.js';
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import * as auth from '../../store/ducks/auth.duck';
import { getUserByToken } from "../../crud/auth.crud";


const CreateLocationComponent = ({ handleClose, iataCode, fulfillUser }) => {
    const [amount, setAmount] = useState(0);
    const [payReq, doReport] = AxioHook(reportPayment(), { manual: true })


    return (
        <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
            <Modal.Header closeButton>
                <Modal.Title>{iataCode ? `Edit ${iataCode.iataCode}` : "Create Location"}</Modal.Title>
            </Modal.Header>
            <form
                noValidate={true}
                autoComplete="off"
                className="kt-form"
                style={{ padding: '2rem' }}
            >
                <div className="form-group">
                    <TextField
                        type="string"
                        margin="normal"
                        label="Amount to add"
                        name="iataCode"
                        onChange={(e) => {
                            if (e.target.value == "") {
                                setAmount(0)
                            } else {
                                const amount = new Decimal(e.target.value)
                                if (amount.isNaN() == false) {
                                    setAmount(e.target.value)
                                }
                            }
                        }}
                        value={amount}
                    />
                </div>
                <PayPalButton
                    amount={amount}
                    onSuccess={(details, data) => {
                        doReport({ data: {orderId: data.orderID} })
                        .then(() => {
                            getUserByToken()
                            .then((res) => {
                                fulfillUser(res.data)
                                handleClose();
                            })
                        })
                    }}
                    options={{
                        clientId: "AbBy2EJkKQpvu6zmf9gaySHsC5UK-mFjwqI_zLxaNCS60V4cIDU4mR7o5LsBtIU8KAjrh4yqdzsu3J_N"
                    }}
                />
            </form>
        </Modal>
    );
}


export const AddCreditsModal = injectIntl(
    connect(
        null,
    auth.actions
    )(CreateLocationComponent)
);