import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { Modal } from "react-bootstrap";
import { Formik, FieldArray, Field, Form } from "formik";
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { editBlacklistedCompanies } from "../../crud/blacklist.crud";


const CreateLocationComponent = ({ handleClose, company }) => {
  const [payReq, doEdit] = AxioHook(editBlacklistedCompanies(), { manual: true })

  return (
    <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
      <Modal.Header closeButton>
        <Modal.Title>Add Funds to your Account</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ ...company }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setSubmitting(false)
          setStatus(null);
          setSubmitting(true)
          doEdit({ data: { company: values } })
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

              <div style={{ width: '100%' }} className="form-group">
                <TextField
                  type="string"
                  label="Company"
                  margin="normal"
                  className="kt-width-full"
                  name={`companyName`}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.companyName}
                  helperText={touched.company && errors.company}
                  error={Boolean(touched.company && errors.company)}
                />
              </div>

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

export const EditCompany = connect(mapStateToProps)(CreateLocationComponent);