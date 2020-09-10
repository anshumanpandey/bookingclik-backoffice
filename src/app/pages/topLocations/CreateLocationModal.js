import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { reportPayment } from "../../crud/pay.crud";
import AxioHook from 'axios-hooks'
import { Modal } from "react-bootstrap";
import { Formik } from 'formik';
import { saveTopLocation } from '../../crud/toplocations.crud';

export const CreateLocationModal = ({ handleClose, location }) => {
    const [payReq, doSave] = AxioHook(saveTopLocation(), { manual: true })

    return (
        <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
            <Modal.Header closeButton>
                <Modal.Title>Create Top Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{ id: location?.id || undefined, name: location?.name || "", img: null, imgPreview: location?.imagePath || undefined }}
                    validate={values => {
                        const errors = {};

                        if (!values.name) {
                            errors.name = "Required"
                        }

                        if (!values.img && !values.imgPreview) {
                            errors.img = "Required"
                        }

                        return errors;
                    }}
                    onSubmit={(values, { setFieldValue, setSubmitting }) => {

                        const data = new FormData()
                        if (values.id) {
                            data.append("id", values.id)
                        }
                        data.append("img", values.img)
                        data.append("name", values.name)
                        doSave({ data, headers: {'Content-Type': 'multipart/form-data' } })
                        .then(() => handleClose())
                    }}
                >
                    {({
                        values,
                        setFieldValue,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                            <form onSubmit={handleSubmit} className="kt-form">
                                <div className="form-group">
                                    <TextField
                                        label="Name"
                                        margin="normal"
                                        fullWidth={true}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        helperText={touched.name && errors.name}
                                        error={Boolean(touched.name && errors.name)}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        accept="image/*"
                                        id="contained-button-file"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0]
                                            const oFReader = new FileReader();
                                            oFReader.readAsDataURL(file);

                                            oFReader.onload = function (oFREvent) {
                                                setFieldValue('imgPreview', oFREvent.target.result)
                                            };
                                            setFieldValue('img', file)
                                        }}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button variant="contained" color="primary" component="span">
                                            Upload
                                        </Button>
                                    </label>
                                    {errors.img && <p style={{ color: "#f44336" }}>{errors.img}</p>}
                                </div>

                                {values.imgPreview && (
                                    <div className="form-group">
                                        <img style={{ width: 100, height: 100 }} src={values.imgPreview} />
                                    </div>
                                )}


                                <div className="kt-login__actions">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                                        disabled={payReq.loading}
                                    >
                                        Submit
                    </button>
                                </div>
                            </form>
                        )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
}
