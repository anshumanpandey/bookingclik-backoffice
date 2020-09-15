import React, { useEffect, useRef, useState } from 'react';
import { TextField, createStyles, CircularProgress, Button, InputBase } from '@material-ui/core';
import { throttle } from "throttle-debounce";
import { useTheme } from '@material-ui/core/styles';
import { VariableSizeList } from 'react-window';
import AxioHook, { makeUseAxios } from 'axios-hooks'
import axios, { CancelTokenSource } from 'axios';
import { Modal } from "react-bootstrap";
import { Formik } from 'formik';
import { saveValuatedLocations } from '../../crud/valuatedLocations.crud';
import { SuggestionInput } from '../../../_metronic/layout/SuggestionInput';

const CancelToken = axios.CancelToken;

const normalAxios = makeUseAxios({ axios: axios.create() })

export const CreateLocationModal = ({ handleClose, location }) => {
    const formRef = useRef()

    const [payReq, doSave] = AxioHook(saveValuatedLocations(), { manual: true })
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [lastReqToken, setLastReqToken] = useState(null)

    const [{ data, loading, error }, refetch] = normalAxios({
        url: `http://localhost:3010/api/public/locationCodesBySupplier`,
        method: 'POST'
    }, { manual: true })

    const [clientReq] = normalAxios({
        url: `http://localhost:3010/api/public/suppliers`,
        method: 'POST'
    })

    const searchCode = throttle(1000, (v) => {
        if (lastReqToken) {
            console.log('canceling prev resq')
            lastReqToken.cancel()
        }

        const source = CancelToken.source()
        setLastReqToken(source);
        refetch({ data: { search: v, clientId: formRef?.current?.values?.grcgdsClient?.id }, cancelToken: source.token })
            .then(() => setLastReqToken(null))
            .catch(() => setLastReqToken(null))
    })

    useEffect(() => {
        if (searchTerm) {
            searchCode(searchTerm)
        }
    }, [searchTerm])

    useEffect(() => {
        if (clientReq.data && clientReq.loading == false) {
            const v = location?.grcgdsClientId ? clientReq.data?.find(l => l.id == location?.grcgdsClientId) : "";
            //formRef?.current?.setFieldValue("grcgdsClient", v);
            console.log(formRef?.current?.setFieldValue("grcgdsClient", v))
        }
    }, [clientReq.loading])

    return (
        <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
            <Modal.Header closeButton>
                <Modal.Title>Create Valuated Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    innerRef={(r) => formRef.current = r}
                    initialValues={{
                        id: location?.id || undefined,
                        name: location?.name || "",
                        grcgdsClient: location?.grcgdsClientId ? {clientname: clientReq.data?.find(l => l.id == location?.grcgdsClientId).clientname} : "",
                        value: location?.value || ""
                    }}
                    validate={values => {
                        const errors = {};

                        if (!values.name) {
                            errors.name = "Required"
                        }
                        if (!values.value) {
                            errors.value = "Required"
                        }

                        return errors;
                    }}
                    onSubmit={(values, { setFieldValue, setSubmitting }) => {
                        console.log(values)
                        doSave({ data: {...values, grcgdsClientId: values.grcgdsClient.id } })
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
                                    <SuggestionInput
                                        options={clientReq.data}
                                        inputValue={values.grcgdsClient?.clientname}
                                        placeHolder="Select Client"
                                        renderOption={(option) => {
                                            return (
                                                <>
                                                    {option.clientname}
                                                </>
                                            );
                                        }}
                                        onInputValueChange={(v) => {
                                            setSearchTerm(v)
                                        }}
                                        onOptionSelected={(v) => {
                                            setFieldValue("grcgdsClient", v)
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <SuggestionInput
                                        options={data}
                                        inputValue={values.name}
                                        placeHolder="Select Pickup Location"
                                        renderOption={(option) => {
                                            return (
                                                <>
                                                    <i style={{ color: 'rgba(0,0,0,.25)', marginRight: '0.8rem' }} className="fas fa-car"></i>
                                                    {option.location}
                                                </>
                                            );
                                        }}
                                        onInputValueChange={(v) => {
                                            setSearchTerm(v)
                                        }}
                                        onOptionSelected={(v) => {
                                            setFieldValue("name", v.location)
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <TextField
                                        type="string"
                                        label="Value %"
                                        margin="normal"
                                        className="kt-width-full"
                                        name={`value`}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.value}
                                        helperText={touched.value && errors.value}
                                        error={Boolean(touched.value && errors.value)}
                                    />
                                </div>
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
