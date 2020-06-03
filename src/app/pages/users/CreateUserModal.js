import React, { useEffect } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { updateUser } from "../../crud/user.crud";
import { getRoles } from "../../crud/menu.crud";
import { Formik } from "formik";
import { injectIntl } from "react-intl";
import clsx from "clsx";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import * as lab from '@material-ui/lab';
import { useAppState } from '../AppState';

const CreateUserModalComponent = ({ handleClose, client, refetch, intl }) => {
  const [, setError] = useAppState('error');

  console.log(client)

  useEffect(() => refetch, []);

  const [, doUpdate] = AxioHook(updateUser(), { manual: true })
  const [rolesReq,] = AxioHook(getRoles())

  return (
    <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
      <Modal.Header closeButton>
        <Modal.Title>{client ? `Edit ${client.firstName}` : "Create User"}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={client || {
          email: '',
          address: '',
          companyName: '',
          role: '',
          roleGuards: []
        }}
        validate={values => {
          const errors = {};

          if (!values.email) {
            errors.email = intl.formatMessage({
              id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
          }

          if (!values.firstName) errors.firstName = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });

          if (!values.address) errors.address = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });

          if (!values.companyName) errors.companyName = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });

          return errors;
        }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setSubmitting(true)

          doUpdate({ data: values })
            .then(() => {
              setSubmitting(false)
              handleClose();
            })
            .catch(err => {
              setSubmitting(false);
              err.response && setError(err.response.data.error)
              err.response && setStatus(err.response.data.error)
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
          setFieldValue,
        }) => {
          console.log(values)
          if (rolesReq.loading) {
            return <CircularProgress />
          }
          return (
            <>
              <form
                noValidate={true}
                autoComplete="off"
                className="kt-form"
                onSubmit={handleSubmit}
              >
                <Modal.Body>
                  {status ? (
                    <div role="alert" className="alert alert-danger">
                      <div className="alert-text">{status}</div>
                    </div>
                  ) : null}

                  <div className="form-group">
                    <TextField
                      type="email"
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
                      margin="normal"
                      label="First Name"
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
                      margin="normal"
                      label="Last Name"
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
                      margin="normal"
                      label="Company Name"
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
                      margin="normal"
                      label="Adress"
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
                      margin="normal"
                      label="Phone Number"
                      className="kt-width-full"
                      name="phonenumber"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phonenumber}
                      helperText={touched.phonenumber && errors.phonenumber}
                      error={Boolean(touched.phonenumber && errors.phonenumber)}
                    />
                  </div>

                  {values.roleGuards.le}<lab.Autocomplete
                    id="combo-box-demo"
                    getOptionLabel={(option) => option.role}
                    options={rolesReq.data ? rolesReq.data : []}
                    value={values.roleGuards[0]}
                    style={{ width: '100%' }}
                    onChange={(a,v) => {
                      if (!v) return
                      setFieldValue('roleGuards', [v])
                  }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        type="string"
                        margin="normal"
                        label="Role"
                        className="kt-width-full"
                        name="role"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.country}
                        helperText={touched.country && errors.country}
                        error={Boolean(touched.country && errors.country)}
                      />
                    )}
                  />

                  <div className="form-group">
                    <FormControlLabel
                      control={<Checkbox
                        name="disabled"
                        defaultChecked={values.disabled === true}
                        error={Boolean(touched.disabled && errors.disabled)}
                        onChange={() => setFieldValue('disabled', !values.disabled)} />}
                      label="Disabled"
                    />

                  </div>

                  <div className="kt-login__actions">

                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => handleClose('close')}>
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    id="kt_login_signin_submit"
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": isSubmitting
                      }
                    )}`}
                    style={{ paddingRight: doUpdate.loading ? "3.5rem" : "2.5rem" }}
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </form>

            </>
          );
        }}
      </Formik>

    </Modal>
  );
}


export const CreateUserModal = injectIntl(
  connect(
    null,
  )(CreateUserModalComponent)
);