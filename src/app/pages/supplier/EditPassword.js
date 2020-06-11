import React, { useState } from 'react';
import { TextField, Select, MenuItem } from '@material-ui/core';
import { updateSupplier } from "../../crud/super/supplier.crud";
import { Formik, FieldArray, Field, Form } from "formik";
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import * as auth from '../../store/ducks/auth.duck';
var ValidatePassword = require('validate-password');

var validator = new ValidatePassword({
  enforce: {
    lowercase: true,
  }
});


const CreateLocationComponent = ({ handleClose, iataCode, user }) => {
  const [clientsLocationReq, doUpdate] = AxioHook(updateSupplier(), { manual: true })

  return (
    <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
      <Modal.Header closeButton>
        <Modal.Title>Edit password</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={user}
        validate={(values) => {
          const errors = {}

          if (values.password || values.confirmPassword) {
            if (values.password != values.confirmPassword) {
              errors.password = "Password not match"
              errors.confirmPassword = "Password not match"
            }

            if (values.password.length < 4) errors.password = "Password too short"
            const validation = validator.checkPassword(values.password)
            if (!validation.isValid) errors.password = validation.validationMessage
            if (values.password.length < 4) errors.password = "Password too short"

            const validation2 = validator.checkPassword(values.confirmPassword)
            if (!values.confirmPassword) {
              errors.confirmPassword = 'Required'
            } else if (!validation2.isValid) {
              errors.confirmPassword = validation2.validationMessage
            }
            if (values.confirmPassword && values.confirmPassword.length < 4) errors.confirmPassword = "Password too short"
          }

          return errors;
        }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setStatus(null);
          setSubmitting(true)
          console.log(values)
          doUpdate({ data: { ...values, supplierId: user.id } })
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
          isSubmitting,
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

              <div className="form-group">
                <TextField
                  type="password"
                  label="Password"
                  margin="normal"
                  className="kt-width-full"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  helperText={touched.password && errors.password}
                  error={Boolean(touched.password && errors.password)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="password"
                  label="Confirm Password"
                  margin="normal"
                  className="kt-width-full"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
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


export const EditPassword = injectIntl(
  connect(
    null,
    auth.actions
  )(CreateLocationComponent)
);