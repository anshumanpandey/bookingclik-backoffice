import React from 'react'
import { TextField } from '@material-ui/core';
import AxioHook from 'axios-hooks'
import { getCountries } from "../../crud/countries.crud";
import * as lab from '@material-ui/lab';

export const CountryDropdown = ({setFieldValue,handleBlur, handleChange, touched, errors, values, getObj}) => {

    const [getReq, refetch] = AxioHook(getCountries())

    if (getReq.loading) {
        return <>Getting countries</>
    }

    if (getReq.error) {
        return <>Error getting countries</>
    }

    return (
        <lab.Autocomplete
            id="combo-box-demo"
            options={getReq.data}
            getOptionLabel={(option) => option.country}
            style={{ width: '100%' }}
            value={getReq.data.find(c => c.name === values.country || c.code === values.country?.code )}
            onChange={(a,v) => {
                if (!v) return
                if (getObj === true) return setFieldValue('country', v)

                return setFieldValue('country', v.name)
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    type="string"
                    margin="normal"
                    label="Country"
                    className="kt-width-full"
                    name="country"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.country}
                    helperText={touched.country && errors.country}
                    error={Boolean(touched.country && errors.country)}
                />
            )}
        />
    );
}