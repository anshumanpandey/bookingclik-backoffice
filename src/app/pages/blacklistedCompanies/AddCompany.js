import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { Modal } from "react-bootstrap";
import { Formik, FieldArray, Field, Form } from "formik";
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { createBlacklistedCompanies } from "../../crud/blacklist.crud";


const CreateLocationComponent = ({ handleClose }) => {
  const [amount, setAmount] = useState(0);
  const [payReq, doPost] = AxioHook(createBlacklistedCompanies(), { manual: true })

  return (
    <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
      <Modal.Header closeButton>
        <Modal.Title>Add Funds to your Account</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ companyName: '' }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setStatus(null);
          setSubmitting(true)
          doPost({ data: { companyName: values.companyName } })
            .then(() => {
              setSubmitting(false)
              handleClose('edited');
            })
            .catch(() => handleClose())
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => (
            <form
              style={{ padding: '2rem' }}
              noValidate={true}
              autoComplete="off"
              className="kt-form"
              onSubmit={handleSubmit}
            >
              {status ? (
                <div role="alert" className="alert alert-danger">
                  <div className="alert-text">{status}</div>
                </div>
              ) : null}

              <TextField
                type="string"
                label="Company"
                margin="normal"
                className="kt-width-full"
                name={`companyName`}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyName}
                helperText={touched.companyName && errors.companyName}
                error={Boolean(touched.companyName && errors.companyName)}
              />

              <div className="kt-login__actions">
                <button
                  id="kt_login_signin_submit"
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-primary btn-elevate kt-login__btn-primary`}
                >
                  Save
                  </button>
              </div>
            </form>
          )}
      </Formik>
    </Modal>
  );
}

const mapStateToProps = ({ auth: { user }, builder }) => ({
  user,
});

export const AddCompanies = connect(mapStateToProps)(CreateLocationComponent);