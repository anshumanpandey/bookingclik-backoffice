import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { updateSupplier } from "../../crud/super/supplier.crud";
import { Formik } from "formik";
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import * as auth from '../../store/ducks/auth.duck';


const CreateLocationComponent = ({ handleClose, iataCode, user }) => {
  const [clientsLocationReq, doUpdate] = AxioHook(updateSupplier(), { manual: true })


  return (
    <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Supplier</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={user}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setStatus(null);
          setSubmitting(true)
          doUpdate({ data: {...values, supplierId: user.id} })
            .then(() => {
              setSubmitting(false)
              handleClose('hide');
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

              <div className="form-group">
                <TextField
                  type="string"
                  label="Cost Per Click"
                  margin="normal"
                  className="kt-width-full"
                  name="costPerClick"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.costPerClick}
                  helperText={touched.costPerClick && errors.costPerClick}
                  error={Boolean(touched.costPerClick && errors.costPerClick)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="string"
                  margin="normal"
                  label="Credits"
                  className="kt-width-full"
                  name="credits"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.credits}
                  helperText={touched.credits && errors.credits}
                  error={Boolean(touched.credits && errors.credits)}
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


export const EditSuppplier = injectIntl(
  connect(
    null,
    auth.actions
  )(CreateLocationComponent)
);