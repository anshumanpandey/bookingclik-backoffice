import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextField, InputLabel, Select, MenuItem } from "@material-ui/core";
import * as auth from "../../store/ducks/auth.duck";
import { register } from "../../crud/auth.crud";

function Registration(props) {
  const { intl } = props;

  return (
    <div className="kt-login__body">
      <div className="kt-login__form">
        <div className="kt-login__title">
          <h3>
            <FormattedMessage id="AUTH.REGISTER.TITLE" />
          </h3>
        </div>

        <Formik
          initialValues={{
            clientname: "",
            email: "",
            address: "",
            phonenumber: "",
            type: 'PARTNER'
          }}
          validate={values => {
            const errors = {};

            if (!values.email) {
              errors.email = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_FIELD"
              });
            }

            if (!values.clientname) {
              errors.clientname = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (!values.clientname) {
              errors.clientname = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (!values.address) {
              errors.address = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (!values.phonenumber) {
              errors.phonenumber = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            return errors;
          }}
          onSubmit={(values, { setStatus, setSubmitting }) => {
            register({
              clientname: values.clientname,
              email: values.email,
              address: values.address,
              phonenumber: values.phonenumber,
            })
              .then(({ data: { token } }) => {
                props.register(token);
              })
              .catch((err) => {
                let errToDisplay = intl.formatMessage({
                  id: "AUTH.VALIDATION.INVALID_LOGIN"
                });
                if (err.response) {
                  errToDisplay = `${err.response.data.error} | ${errToDisplay}` 
                }
                
                setSubmitting(false);
                setStatus(errToDisplay);
              });
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
          }) => {
            return (
              <form onSubmit={handleSubmit} noValidate autoComplete="off">
                {status && (
                  <div role="alert" className="alert alert-danger">
                    <div className="alert-text">{status}</div>
                  </div>
                )}

                <div className="form-group mb-0">
                  <TextField
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

                <div className="form-group mb-0">
                  <TextField
                    margin="normal"
                    label="Client name"
                    className="kt-width-full"
                    name="clientname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.clientname}
                    helperText={touched.clientname && errors.clientname}
                    error={Boolean(touched.clientname && errors.clientname)}
                  />
                </div>

                <div className="form-group mb-0">
                  <TextField
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

                <div className="form-group mb-0">
                  <TextField
                    margin="normal"
                    label="Phone number"
                    className="kt-width-full"
                    name="phonenumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phonenumber}
                    helperText={touched.phonenumber && errors.phonenumber}
                    error={Boolean(touched.phonenumber && errors.phonenumber)}
                  />
                </div>

                <div className="form-group mb-0">
                  <InputLabel id="demo-simple-select-label">Account Type</InputLabel>
                  <Select
                    style={{ width: '100%' }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.type}
                    name="type"
                    onChange={handleChange}
                  >
                    <MenuItem value={'PARTNER'}>Type 1</MenuItem>
                    <MenuItem value={'ASSOCIATE'}>Type 2</MenuItem>
                  </Select>
                </div>

                <div className="kt-login__actions">
                  <Link to="/auth">
                    <button type="button" className="btn btn-secondary btn-elevate kt-login__btn-secondary">
                      Back
                    </button>
                  </Link>

                  <button
                    disabled={isSubmitting}
                    className="btn btn-primary btn-elevate kt-login__btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )
          }}
        </Formik>
      </div>
    </div>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Registration)
);
