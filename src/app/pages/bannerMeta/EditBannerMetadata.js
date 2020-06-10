import React, { useState, useEffect } from 'react';
import { Modal } from "react-bootstrap";
import { TextField, } from "@material-ui/core"
import { Formik, FieldArray, Field } from "formik";
import { updateBannerMetadata } from "../../crud/banners-meta.crud";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";

import * as auth from "../../store/ducks/auth.duck";


const CreateLocationComponent = ({ handleClose, bannerMetadata }) => {
  const [postReq, doPost] = AxioHook(updateBannerMetadata(), { manual: true })

  return (
    <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Banner Data</Modal.Title>
      </Modal.Header>
      <Formik
        enableReinitialize
        initialValues={bannerMetadata}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setSubmitting(true)
          setStatus(null);
          doPost({ data: values })
          .then((r) => {
            handleClose('SAVED');
          })
          .catch(err => {
            if (err && err.response) {
              setStatus(err.response.data.error);
            }
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
                disabled
                type="string"
                label="Location Name"
                margin="normal"
                className="kt-width-full"
                name={`locationName`}
                value={values.locationName}
                onBlur={handleBlur}
              />

              <TextField
                type="string"
                label="Available Amount"
                margin="normal"
                className="kt-width-full"
                name={`availableAmount`}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.availableAmount}
                helperText={touched.availableAmount && errors.availableAmount}
                error={Boolean(touched.availableAmount && errors.availableAmount)}
              />

              <TextField
                type="string"
                label="Price"
                margin="normal"
                className="kt-width-full"
                name={`price`}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                helperText={touched.price && errors.price}
                error={Boolean(touched.price && errors.price)}
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

export const EditBannerMetadataModal = connect(
  ({ auth }) => ({ user: auth.user }),
  auth.actions
)(CreateLocationComponent);