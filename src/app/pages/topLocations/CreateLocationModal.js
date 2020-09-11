import React, { useEffect, useState } from 'react';
import { TextField, createStyles, CircularProgress, Button, InputBase } from '@material-ui/core';
import ListSubheader from '@material-ui/core/ListSubheader';
import { throttle } from "throttle-debounce";
import { useTheme } from '@material-ui/core/styles';
import { VariableSizeList } from 'react-window';
import AxioHook, { makeUseAxios } from 'axios-hooks'
import axios, { CancelTokenSource } from 'axios';
import { Modal } from "react-bootstrap";
import { Formik } from 'formik';
import { saveTopLocation } from '../../crud/toplocations.crud';
import Autocomplete from '@material-ui/lab/Autocomplete';

const CancelToken = axios.CancelToken;

const normalAxios = makeUseAxios({ axios: axios.create() })

let styles = createStyles({
    input: {
        width: '80%!important',
        paddingTop: 0,
        fontSize: '0.8rem'
    },
    inputRoot: {
        flexWrap: 'unset',
        width: '100%!important',

    },
    paper: {
        margin: 0
    },
})

const LISTBOX_PADDING = 15; // px
function renderRow(props) {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: style.top + LISTBOX_PADDING,
        },
    });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    // @ts-ignore
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref && ref.current) {
            // @ts-ignore
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const itemCount = itemData.length;
    const itemSize = 50;

    const getChildSize = (child) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 50;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        // @ts-ignore
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

export const CreateLocationModal = ({ handleClose, location }) => {
    const [payReq, doSave] = AxioHook(saveTopLocation(), { manual: true })
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [lastReqToken, setLastReqToken] = useState(null)

    const [{ data, loading, error }, refetch] = normalAxios({
        url: `https://www.grcgds.com/admincarrental/api/public/locationCodes`,
        method: 'POST'
    }, { manual: true })

    const searchCode = throttle(1000, (v) => {
        if (lastReqToken) {
            console.log('canceling prev resq')
            lastReqToken.cancel()
        }

        const source = CancelToken.source()
        setLastReqToken(source);
        refetch({ data: { search: v }, cancelToken: source.token })
            .then(() => setLastReqToken(null))
            .catch(() => setLastReqToken(null))
    })

    useEffect(() => {
        searchCode(searchTerm)
    }, [searchTerm])

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

                        return errors;
                    }}
                    onSubmit={(values, { setFieldValue, setSubmitting }) => {

                        const data = new FormData()
                        if (values.id) {
                            data.append("id", values.id)
                        }
                        data.append("name", values.name)
                        doSave({ data, headers: { 'Content-Type': 'multipart/form-data' } })
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
                                    <Autocomplete
                                        id="combo-box-demo"
                                        fullWidth={true}
                                        open={open}
                                        onOpen={() => {
                                            setOpen(true);
                                        }}
                                        onClose={() => {
                                            setOpen(false);
                                        }}
                                        onInputChange={(e, v) => {
                                            if (v === '') return
                                            setSearchTerm(v)
                                        }}
                                        disableListWrap={true}
                                        // @ts-ignore
                                        ListboxComponent={ListboxComponent}
                                        value={values.name}
                                        loading={open && data !== null}
                                        options={(data) ? data : []}
                                        loadingText={<></>}
                                        onChange={(event, value) => {
                                            if (!value) return

                                            setFieldValue("name", value.locationname)
                                        }}
                                        renderOption={(option) => {
                                            return (
                                                <>
                                                    <i style={{ color: 'rgba(0,0,0,.25)', marginRight: '0.8rem' }} className="fas fa-car"></i>
                                                    {option.locationname}
                                                </>
                                            );
                                        }}
                                        getOptionLabel={(option) => option}
                                        filterOptions={x => x}
                                        renderInput={(params) => {
                                            return (
                                                <InputBase
                                                    {...params.InputProps}
                                                    fullWidth={true}
                                                    inputProps={params.inputProps}
                                                    id={params.id}
                                                    disabled={params.disabled}
                                                    style={{ borderRadius: '6px' }}
                                                    placeholder="Select Pickup Location"
                                                    value={values.name}
                                                />
                                            );
                                        }}
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
