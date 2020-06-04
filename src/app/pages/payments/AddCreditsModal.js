import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { reportPayment } from "../../crud/pay.crud";
import { Decimal } from 'decimal.js';
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import * as auth from '../../store/ducks/auth.duck';
import { getUserByToken } from "../../crud/auth.crud";
import { useAppState } from '../AppState';


const CreateLocationComponent = ({ handleClose, iataCode, fulfillUser, user }) => {
    const [amount, setAmount] = useState(0);
    const [payReq, doReport] = AxioHook(reportPayment(), { manual: true })

    console.log(user)

    return (
        <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
            <Modal.Header closeButton>
                <Modal.Title>Add Funds to your Account</Modal.Title>
            </Modal.Header>
            <form
                noValidate={true}
                autoComplete="off"
                className="kt-form"
                style={{ padding: '2rem' }}
            >
                <div style={{ paddingLeft: 0}} className="alert alert-light">
                    <div style={{ color: '#5867dd'}} className="alert-text">
                        Current Balance: ${user.Payments.reduce((p,n) => {
                            p = p + n.amount;
                            return p
                        },0) * user.costPerClick} ({user.Payments.reduce((p,n) => {
                            p = p + n.amount
                            return p
                        },0) * user.costPerClick} clicks)
                    </div>
                </div>

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
                                    setAmount(amount.floor().toString())
                                }
                            }
                        }}
                        value={amount}
                    />
                </div>
                <div style={{ paddingLeft: 0}} className="alert alert-light">
                    <div style={{ color: '#5867dd'}} className="alert-text">
                        New payment: ${amount} x ${user.costPerClick}/click = {amount * user.costPerClick} clicks
                    </div>
                </div>

                <div style={{ pointerEvents: amount == 0 ? 'none' : 'unset'}}>
                    <PayPalButton
                        amount={amount}
                        onSuccess={(details, data) => {
                            doReport({ data: { orderId: data.orderID } })
                                .then(() => {
                                    getUserByToken()
                                        .then((res) => {
                                            fulfillUser(res.data)
                                            handleClose('PAY');
                                        })
                                })
                        }}
                        options={{
                            clientId: "AcDoYg60CAk48yIdgpLTKR8h99G9sdv_Xmdg8jzd8HTla_01m29inTc7d-kT5MdRwYcnpq5GmrdXbt4A"
                        }}
                    />
                </div>
            </form>
        </Modal>
    );
}

const mapStateToProps = ({ auth: { user }, builder }) => ({
    user,
});

export const AddCreditsModal = connect(mapStateToProps)(CreateLocationComponent);