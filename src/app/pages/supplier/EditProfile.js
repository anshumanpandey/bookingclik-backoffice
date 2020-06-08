import React, { useState } from 'react';
import { TextField, Select, MenuItem } from '@material-ui/core';
import { updateSupplier } from "../../crud/client.crud";
import { Formik, FieldArray, Field, Form } from "formik";
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { useAppState } from '../AppState';
import * as auth from '../../store/ducks/auth.duck';
var ValidatePassword = require('validate-password');

var validator = new ValidatePassword({
  enforce: {
    lowercase: true,
    uppercase: true,
    numbers: true
  }
});


const CreateLocationComponent = ({ user, fulfillUser }) => {
  const [clientsLocationReq, doUpdate] = AxioHook(updateSupplier(), { manual: true })
  const [, setSuccess] = useAppState('success');

  return (
      <Formik
        initialValues={user}
        validate={(values) => {
          const errors = {}
          if (!values.email) errors.email = 'Required'
          if (!values.costPerClick) errors.costPerClick = 'Required'
          if (!values.companyName) errors.companyName = 'Required'

          if (values.password || values.confirmPassword) {
            if (values.password != values.confirmPassword){
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
            if (values.confirmPassword.length < 4) errors.confirmPassword = "Password too short"

          }

          return errors;
        }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setStatus(null);
          setSubmitting(true)
          console.log(values)
          doUpdate({ data: { ...values, supplierId: user.id } })
            .then(({data}) => {
                setSuccess("Profile updated")
                fulfillUser(data)
                setSubmitting(false)
            })
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
                <TextField
                  type="string"
                  label="First Name"
                  margin="normal"
                  className="kt-width-full"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  helperText={touched.firstName && errors.firstName}
                  error={Boolean(touched.firstName && errors.firstName)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="string"
                  label="Last Name"
                  margin="normal"
                  className="kt-width-full"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  helperText={touched.lastName && errors.lastName}
                  error={Boolean(touched.lastName && errors.lastName)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="string"
                  label="Address"
                  margin="normal"
                  className="kt-width-full"
                  name="address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  helperText={touched.address && errors.address}
                  error={Boolean(touched.address && errors.address)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="string"
                  label="phonenumber"
                  margin="normal"
                  className="kt-width-full"
                  name="phonenumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phonenumber}
                  helperText={touched.phonenumber && errors.phonenumber}
                  error={Boolean(touched.phonenumber && errors.phonenumber)}
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
  );
}


export const EditProfile = injectIntl(
  connect(
    ({ auth, builder }) => ({ user: auth.user }),
    auth.actions
  )(CreateLocationComponent)
);