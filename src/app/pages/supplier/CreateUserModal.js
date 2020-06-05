import React, { useState } from 'react';
import { TextField, Select, MenuItem } from '@material-ui/core';
import { createSupplier } from "../../crud/super/supplier.crud";
import { Formik, FieldArray, Field, Form } from "formik";
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import * as auth from '../../store/ducks/auth.duck';


const CreateLocationComponent = ({ handleClose, iataCode, user }) => {
  const [clientsLocationReq, doUpdate] = AxioHook(createSupplier(), { manual: true })


  return (
    <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
      <Modal.Header closeButton>
        <Modal.Title>Create</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          costPerClick: 1,
          type: "supplier",
          currencySymbol: '$'
        }}
        validate={(values) => {
          const errors = {};

          if (!values.email) errors.email = 'Missing email';
          if (!values.password) errors.password = 'Missing password';
          if (!values.confirmPassword) errors.confirmPassword = 'Missing confirmPassword';
          if (values.password !== values.confirmPassword) errors.password = 'Password and confirm password not match';

          return errors;
        }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setStatus(null);
          setSubmitting(true)
          doUpdate({ data: { ...values } })
            .then(() => {
              setSubmitting(false)
              handleClose('created');
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
                  label="Email"
                  margin="normal"
                  className="kt-width-full"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="string"
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
                  type="string"
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
                  label="Company Name"
                  margin="normal"
                  className="kt-width-full"
                  name="companyName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.companyName}
                  helperText={touched.companyName && errors.companyName}
                  error={Boolean(touched.companyName && errors.companyName)}
                />
              </div>

              <div className="form-group">
                <Select
                  label="Currency Symbol"
                  fullWidth
                  name="currencySymbol"
                  value={values.currencySymbol}
                  onChange={handleChange}
                >
                  <MenuItem value={"$"}>$</MenuItem>
                  <MenuItem value={"£"}>£</MenuItem>
                  <MenuItem value={"€"}>€</MenuItem>
                </Select>
              </div>

              <div className="form-group">
                <Select
                  fullWidth
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                >
                  <MenuItem value={"supplier"}>Supplier</MenuItem>
                  <MenuItem value={"broker"}>Broker</MenuItem>
                </Select>
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


export const CreateUserModal = injectIntl(
  connect(
    null,
    auth.actions
  )(CreateLocationComponent)
);