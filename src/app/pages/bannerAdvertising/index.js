import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, Grid, Paper, Checkbox, FormControlLabel } from "@material-ui/core"
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import AxioHook, { makeUseAxios } from 'axios-hooks'
import { getLocations } from "../../crud/banners.crud";
import countries from "../../widgets/countryDropdown/countries.json"
import { PayPalButton } from "react-paypal-button-v2";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
    },
    paperBig: {
        padding: theme.spacing(2),
        height: theme.spacing(7)
    },
}));

function resolvePrice(amountOfLocations, isAirport, frequency) {
    let total = 0;
    if (frequency == 'daily') {
        if (isAirport) total = amountOfLocations * 5
        if (!isAirport) total = amountOfLocations * 2
    }

    if (frequency == 'weekly') {
        if (isAirport) total = (amountOfLocations * 5) * 7
        if (!isAirport) total = (amountOfLocations * 2) * 7
    }

    if (frequency == 'monthly') {
        if (isAirport) total = ((amountOfLocations * 5) * 7) * 30
        if (!isAirport) total = ((amountOfLocations * 2) * 7) * 30
    }

    return total
}

export default function Clients() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [perCountry, setPerCountry] = useState(null);
    const [countryArr, setCountryArray] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [paymentFrequency, setPaymentFrequency] = useState(null);

    const classes = useStyles();

    const [locationsReq, refetch] = AxioHook(getLocations())

    useEffect(() => {
        if (locationsReq.data) {
            const list = locationsReq.data.reduce((json, next) => {
                const { country, locationname } = next
                if (!json[country]) {
                    json[country] = [locationname]
                } else {
                    json[country].push(locationname)
                }
                return json;
            }, {})
            setPerCountry(list)
            setCountryArray(Object.keys(list))
            setSelectedCountry(Object.keys(list)[0])
        }
    }, [locationsReq.loading])

    return (
        <>
            {locationsReq.error && <p>Could not load the resource</p>}
            {locationsReq.loading && <CircularProgress />}
            {perCountry && (
                <div style={{ marginBottom: '1rem' }}>
                    <Paper className={classes.paper}>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={countryArr[0]}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                            >
                                {countryArr.length !== 0 && (
                                    countryArr.map(c => {
                                        const country = countries.find(i => i.code.toLocaleLowerCase() == c.toLocaleLowerCase())?.name
                                        return <MenuItem key={c} value={c}>{country || c}</MenuItem>
                                    })
                                )}
                            </Select>
                        </FormControl>
                    </Paper>
                </div>
            )}

            <Grid container spacing={3}>
                {selectedCountry && (
                    perCountry[selectedCountry].map(c => {
                        return (
                            <>
                                <Grid item xs={4}>
                                    <Paper className={classes.paperBig}>

                                        {c}
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper className={classes.paperBig}>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    defaultChecked={selectedLocations[c]}
                                                    color="primary"
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                    onChange={(e) => {
                                                        setSelectedLocations(p => {
                                                            if (p[c]) {
                                                                return p.filter(i => i !== p)
                                                            }

                                                            return [...p, c]

                                                        })
                                                    }}
                                                />
                                            }
                                            label="Selected"
                                        />


                                    </Paper>

                                </Grid>
                                <Grid item xs={4}>
                                    <Paper className={classes.paperBig}>

                                        Price per banner {c.match(/(Airport)/) ? '£5/day' : '£2/day'}
                                    </Paper>


                                </Grid>
                            </>
                        );
                    })
                )}
            </Grid>
            {selectedLocations.length !== 0 && (
                <div>
                    <Paper className={classes.paper}>

                        Payment Frequency
                    <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={paymentFrequency == 'daily'}
                                            color="primary"
                                            onChange={() => {
                                                setPaymentFrequency('daily')
                                            }}
                                        />
                                    }
                                    label="Daily"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={paymentFrequency == 'weekly'}
                                            color="primary"
                                            onChange={() => {
                                                setPaymentFrequency('weekly')
                                            }}
                                        />
                                    }
                                    label="Weekly"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={paymentFrequency == 'monthly'}
                                            color="primary"
                                            onChange={() => {
                                                setPaymentFrequency('monthly')
                                            }}
                                        />
                                    }
                                    label="Monthly"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            )}

            {selectedLocations.length !== 0 && paymentFrequency && (
                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <Paper className={classes.paper}>
                        <div>{selectedLocations.length} locations selected</div>
                        <div>
                            {selectedLocations.filter(i => i.match(/(Airport)/)).length} Airports: {resolvePrice(selectedLocations.filter(i => i.match(/(Airport)/)).length, true, paymentFrequency)}£
                    </div>
                        <div>
                            {selectedLocations.filter(i => !i.match(/(Airport)/)).length} Non Airports: {resolvePrice(selectedLocations.filter(i => !i.match(/(Airport)/)).length, false, paymentFrequency)}£
                    </div>
                        <div>Payment Frequency: {paymentFrequency}</div>
                    </Paper>
                </div>
            )}

            {selectedLocations.length !== 0 && paymentFrequency && (
                <PayPalButton
                    amount={
                        resolvePrice(selectedLocations.filter(i => i.match(/(Airport)/)).length, true, paymentFrequency)
                        +
                        resolvePrice(selectedLocations.filter(i => !i.match(/(Airport)/)).length, false, paymentFrequency)
                    }
                    onSuccess={(details, data) => {

                    }}
                    options={{
                        clientId: "AcDoYg60CAk48yIdgpLTKR8h99G9sdv_Xmdg8jzd8HTla_01m29inTc7d-kT5MdRwYcnpq5GmrdXbt4A",
                        currency: 'GBP'
                    }}
                />
            )}

        </>
    );
}