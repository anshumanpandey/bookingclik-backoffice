import React, { useState, useEffect } from 'react';
import { Modal } from "react-bootstrap";
import { TextField, } from "@material-ui/core"
import { Formik, FieldArray, Field } from "formik";
import moment from 'moment'
import { updateBannerMetadata } from "../../crud/banners-meta.crud";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import * as auth from "../../store/ducks/auth.duck";


const CreateLocationComponent = ({ handleClose, bannerMetadata }) => {
  const [dates, setDates] = useState([moment().startOf('month'), moment().endOf('month')])

  const [postReq, doPost] = AxioHook(updateBannerMetadata(), { manual: true })


  return (
    <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
      <Modal.Header closeButton>
        <Modal.Title>Buy Banners</Modal.Title>
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
                label="Company"
                margin="normal"
                className="kt-width-full"
                name={`locationName`}
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

              <MuiPickersUtilsProvider utils={MomentUtils}>
                <div style={{ marginBottom: "8px", marginTop: "16px" }}>
                  <DatePicker
                    autoOk
                    fullWidth
                    label="From"
                    value={dates[0]}
                    onChange={(d) => setDates(p => [d, p[1]])}
                    disableToolbar
                    variant="inline"
                  />
                </div>

                <div style={{ marginTop: "16px", marginBottom: "8px" }}>
                  <DatePicker
                    autoOk
                    fullWidth
                    label="To"
                    value={dates[1]}
                    onChange={(d) => setDates(p => [p[0], d])}
                    disableToolbar
                    variant="inline"
                  />
                </div>

              </MuiPickersUtilsProvider>

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