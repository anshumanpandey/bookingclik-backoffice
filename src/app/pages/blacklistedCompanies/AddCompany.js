import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { Modal } from "react-bootstrap";
import { Formik, FieldArray, Field, Form } from "formik";
import { injectIntl } from "react-intl";
import AxioHook from 'axios-hooks'
import { connect } from "react-redux";
import { createBlacklistedCompanies } from "../../crud/super/blacklist.crud";


const CreateLocationComponent = ({ handleClose }) => {
    const [amount, setAmount] = useState(0);
    const [payReq, doPost] = AxioHook(createBlacklistedCompanies(), { manual: true })

    return (
        <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
            <Modal.Header closeButton>
                <Modal.Title>Add Funds to your Account</Modal.Title>
            </Modal.Header>
            <Formik
        initialValues={{ companies: [] }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setSubmitting(false)
          setStatus(null);
          const companiesToSend = values.companies.filter(i => i.companyName != '')
          console.log(companiesToSend)
          if (companiesToSend.length == 0) return
          setSubmitting(true)
          doPost({ data: { companies: companiesToSend } })
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

              <FieldArray
                name="companies"
                render={arrayHelpers => {
                    if (values.companies && values.companies.length == 0) {
                        arrayHelpers.push({ companyName: '' })
                    }
                    return (
                        <div>
                          {values.companies && values.companies.length > 0 ? (
                            values.companies.map((company, index) => {
                              return (
                                <div style={{ display: 'flex', flexDirection: 'row' }} key={index}>
                                  <div style={{ width: '100%' }} className="form-group">
                                    <TextField
                                      type="string"
                                      label="Company"
                                      margin="normal"
                                      className="kt-width-full"
                                      name={`blacklistedCompany.${index}`}
                                      onBlur={handleBlur}
                                      onChange={(e) => {
                                        arrayHelpers.replace(index, {companyName: e.target.value})
                                      }}
                                      value={company.companyName}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    style={{ alignSelf: 'center' }}
                                    className={`btn btn-primary btn-elevate kt-login__btn-primary`}
                                    onClick={() => {
                                        arrayHelpers.remove(index)
                                    }} // remove a friend from the list
                                  >
                                    -
                              </button>
                                  <button
                                    style={{ alignSelf: 'center' }}
                                    className={`btn btn-primary btn-elevate kt-login__btn-primary`}
                                    type="button"
                                    onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                                  >
                                    +
                              </button>
                                </div>
                              );
                            })
                          ) : (
                              <button className={`btn btn-primary btn-elevate kt-login__btn-primary`} type="button" onClick={() => arrayHelpers.push('')}>
                                {/* show this when user has removed all friends from the list */}
                          Add a Company
                              </button>
                            )}
                        </div>
                      );
                }}
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