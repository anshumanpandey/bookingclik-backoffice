import React, { useState, useEffect } from 'react';
import * as lab from '@material-ui/lab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import { Checkbox, TextField, Grid, Paper } from '@material-ui/core';
import { format } from 'date-fns'
import { deleteIatacode } from "../../crud/iatacodes.crud";
import Notification from '../Notification'
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
    DateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';


const FormCreate = ({ id, iataMapCode, options, onValueChange, onAddMore, onDelete }) => {
    const [success, setSuccess] = useState(false);

    const [dataToSend, setDataToSend] = useState(iataMapCode ? {...iataMapCode, iataCode: iataMapCode.pnrLocation} : {});

    const TriggerChange = (s) => {
        if (!s.iataCode || !s.clientIataCode) return 
        onValueChange({ ...s , id })
    }

    useEffect(() => {
        TriggerChange(dataToSend)
    }, [dataToSend])

    return (
        <Grid item>
            {success && (
                <Notification msg="Code deleted!" />
            )}
            <Paper>
                <Grid container spacing={1} alignItems="center">

                    <Grid item xs={3}>
                        <lab.Autocomplete
                            id="combo-box-demo"
                            getOptionSelected={(option, value) => {
                                return option.iataCode === value.iataCode;
                             }}
                            defaultValue={dataToSend.iataCode}
                            options={options}
                            getOptionLabel={(option) => `${option.airportName} - (${option.iataCode})`}
                            renderInput={(params) => <TextField {...params} label="Select Pickup Location" variant="outlined" />}
                            onChange={(event, value) => {                                
                                if (!value) return
                                setDataToSend(prev => ({ ...prev, iataCode: value }))
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            value={dataToSend.clientIataCode}
                            onChange={(e) => {
                                e.persist();
                                setDataToSend(prev => ({ ...prev, clientIataCode: e.target.value}))
                            }} placeholder="Internal Code" />
                    </Grid>

                    <Grid item>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker style={{ width: '12rem', margin: 0 }} value={dataToSend.disableStartTime || null} onChange={(d) => {
                                setDataToSend(prev => {
                                    const newState = {
                                        ...prev,
                                        disableStartTime: format(d, `yyyy-MM-dd'T'hh:mm:00`),
                                    }
                                    return newState;
                                })

                            }} />
                            <DateTimePicker style={{ width: '12rem', margin: 0 }} value={dataToSend.disableEndTime || null} onChange={(d) => {
                                setDataToSend(prev => {

                                    const newState = {
                                        ...prev,
                                        disableEndTime: format(d, `yyyy-MM-dd'T'hh:mm:00`),
                                    }
                                    return newState;
                                })

                            }} />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item style={{ cursor: 'pointer' }} >
                        <FormControlLabel
                            control={<Checkbox
                                checked={(dataToSend.disableStartTime !== null && dataToSend.disableStartTime !== undefined && dataToSend.disableEndTime !== null && dataToSend.disableEndTime !== undefined) || dataToSend.disabled}
                                onChange={() => {
                                    setDataToSend(prev => ({ ...prev, disabled: !prev.disabled }))
                                }} />}
                            label="Disabled"
                        />
                    </Grid>
                    <Grid item xs={1} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }} onClick={onAddMore} >
                        <AddIcon />
                    </Grid>
                    <Grid item
                        xs={1}
                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                        onClick={() => {
                            if (!id) return
                            deleteIatacode(id)
                                .then(() => {
                                    onDelete()
                                        .then(() => {
                                            setSuccess(true);
                                        })
                                })
                        }}


                    >
                        <DeleteForeverIcon />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
}

export default FormCreate;