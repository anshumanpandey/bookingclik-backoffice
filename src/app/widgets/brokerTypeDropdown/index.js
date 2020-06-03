import React, { useState, useEffect } from 'react'
import { TextField, Chip, MenuItem, Input, makeStyles } from '@material-ui/core';
import * as lab from '@material-ui/lab';
import AxioHook from 'axios-hooks'
import { getTypes } from "../../crud/client-brokers.crud";

const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '0.5rem'
    },
});

export const BrokerTypeDropdown = ({ onChange, defaultValues, predefiniedOptions }) => {
    const classes = useStyles();
    const [clickTriggered, setClickTriggered] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState(defaultValues || []);
    const [getTypesReq] = AxioHook(getTypes(), { manual: predefiniedOptions != undefined })
    const [options, setOptions] = useState(predefiniedOptions || []);

    useEffect(() => {
        if (getTypesReq.data) setOptions(getTypesReq.data)
    }, [getTypesReq.loading]);

    useEffect(() => {
        if (clickTriggered === true) onChange(selectedTypes)
        setClickTriggered(false)
    }, [clickTriggered]);

    return (
        <lab.Autocomplete
            multiple
            autoComplete={false}
            getOptionSelected={(option, value) => {
                return option.id === value.id;
            }}
            classes={{
                root: classes.root,
            }}
            onChange={(e, v) => {
                setSelectedTypes(v)
                setClickTriggered(true)
            }}
            value={selectedTypes}
            options={options}
            renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Account type"
                />
              )}
            loading={getTypesReq.loading}
            getOptionLabel={(option) => `${option.name}`}
        />
    );
}