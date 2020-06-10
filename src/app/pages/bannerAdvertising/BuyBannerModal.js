import React, { useState, useEffect } from 'react';
import { Modal } from "react-bootstrap";
import { FormControl, Button, InputLabel, Select, MenuItem, CircularProgress, TextField, Paper, Checkbox, FormControlLabel, Input, ListItemText } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { Formik, FieldArray, Field } from "formik";
import { reportPayment } from "../../crud/pay.crud";
import { getLocations, postBannerRecip } from "../../crud/banners.crud";
import AxioHook from 'axios-hooks'
import { PayPalButton } from "react-paypal-button-v2";
import { connect } from "react-redux";
import countries from "../../widgets/countryDropdown/countries.json"
import * as auth from "../../store/ducks/auth.duck";

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

const BUY_UNITS = {
  DAY: 'day',
  MONTH: 'month',
  WEEK: 'wekk',
}

function resolvePrice(amountToBuy, frequency, isAirport) {
  let total = 0;
  if (frequency == BUY_UNITS.DAY) {
    if (isAirport) total = amountToBuy * 5
    if (!isAirport) total = amountToBuy * 2
  }

  if (frequency == BUY_UNITS.WEEK) {
    if (isAirport) total = (amountToBuy * 5) * 7
    if (!isAirport) total = (amountToBuy * 2) * 7
  }

  if (frequency == BUY_UNITS.MONTH) {
    if (isAirport) total = (amountToBuy * 5) * 30
    if (!isAirport) total = (amountToBuy * 2) * 30
  }

  return total
}


const CreateLocationComponent = ({ handleClose }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [perCountry, setPerCountry] = useState(null);
  const [countryArr, setCountryArray] = useState([]);
  const [locationsReq, refetch] = AxioHook(getLocations())
  const [selectedLocations, setSelectedLocations] = useState([]);
  const classes = useStyles();

  const [postReq, doPost] = AxioHook(postBannerRecip(), { manual: true })

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
    <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
      <Modal.Header closeButton>
        <Modal.Title>Buy Banners</Modal.Title>
      </Modal.Header>
      <Formik
        enableReinitialize
        initialValues={{ selectedLocations }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          setStatus(null);
          setSubmitting(true)
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
                name="selectedLocations"
                render={arrayHelpers => (
                  <div>
                    {locationsReq.error && <p>Could not load the resource</p>}
                    {locationsReq.loading && <CircularProgress />}
                    {perCountry && (
                      <div style={{ marginBottom: '1rem' }}>
                        <FormControl style={{ width: '100%' }}>
                          <InputLabel id="demo-simple-select-label">Country</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            fullWidth
                            defaultValue={countryArr[0]}
                            onChange={(e) => {
                              setSelectedCountry(e.target.value)
                              arrayHelpers.form.setFieldValue("selectedLocations", [])
                            }}
                          >
                            {countryArr.length !== 0 && (
                              countryArr.map(c => {
                                const country = countries.find(i => i.code.toLocaleLowerCase() == c.toLocaleLowerCase())?.name
                                return <MenuItem key={c} value={c}>{country || c}</MenuItem>
                              })
                            )}
                          </Select>
                        </FormControl>
                      </div>
                    )}

                    {selectedCountry && (
                      <div style={{ marginBottom: '1rem' }}>
                        <FormControl style={{ width: '100%' }}>
                          <InputLabel id="demo-mutiple-name-label">Locations</InputLabel>
                          <Select
                            labelId="demo-mutiple-name-label"
                            multiple
                            value={arrayHelpers.form.values.selectedLocations}
                            input={<Input />}
                            renderValue={(selected) => selected.map(i => i.locationName).join(', ')}
                            onChange={(e) => {
                              const newElement = e.target.value[e.target.value.length - 1]

                              const foundIdx = arrayHelpers.form.values.selectedLocations.findIndex(p => p.locationName == newElement)
                              if (foundIdx !== -1) {
                                return arrayHelpers.remove(foundIdx)
                              }
                              arrayHelpers.push({ locationName: newElement, frequency: BUY_UNITS.DAY, amount: 1 })

                            }}
                          >
                            {perCountry[selectedCountry].map((c) => {
                              return (
                                <MenuItem key={c} value={c} >
                                  <Checkbox checked={arrayHelpers.form.values.selectedLocations.find(i => i.locationName == c) !== undefined} />
                                  <ListItemText primary={c} />
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                    )}

                    {arrayHelpers.form.values.selectedLocations.map((location, index) => (
                      <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1, display: 'flex', }}>
                          <Input style={{ alignSelf: 'end' }} disabled={true} value={location.locationName} />
                        </div>

                        <div style={{ flex: 1, display: 'flex', }}>
                          <TextField
                            fullWidth
                            style={{ alignSelf: 'end' }}
                            label={`Amount of ${location.frequency}s`}
                            onChange={(e) => arrayHelpers.replace(index, { ...location, amount: e.target.value })}
                            value={location.amount}
                          />
                        </div>

                        <div style={{ display: 'flex', flex: '0.2', justifyContent: 'center' }}>
                          <h5 style={{ alignSelf: 'end', margin: 0 }}>X</h5>
                        </div>

                        <div style={{ flex: 1 }}>
                          <FormControl style={{ width: '100%' }}>
                            <InputLabel id="demo-mutiple-name-label">Frequency</InputLabel>
                            <Select
                              labelId="demo-mutiple-name-label"
                              id="demo-mutiple-name"
                              value={location.frequency}
                              onChange={(e) => {
                                arrayHelpers.replace(index, { ...location, frequency: e.target.value })
                              }}
                            >
                              <MenuItem value={BUY_UNITS.DAY}>Day</MenuItem>
                              <MenuItem value={BUY_UNITS.WEEK}>Week</MenuItem>
                              <MenuItem value={BUY_UNITS.MONTH}>Month</MenuItem>
                            </Select>
                          </FormControl>
                        </div>

                        <div style={{ display: 'flex', flex: '0.2', justifyContent: 'center' }}>
                          <h5 style={{ alignSelf: 'end', margin: 0 }}>=</h5>
                        </div>

                        <div style={{ display: 'flex', flex: '0.3', justifyContent: 'center' }}>
                          <h5 style={{ alignSelf: 'end', margin: 0 }}>{resolvePrice(location.amount, location.frequency, location.locationName.match(/(Airport)/))} £</h5>
                        </div>

                      </div>
                    ))}

                    {arrayHelpers.form.values.selectedLocations.length !== 0 && (
                      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        <Paper className={classes.paper}>
                          <div>{arrayHelpers.form.values.selectedLocations.length} locations selected</div>
                              Total: {arrayHelpers.form.values.selectedLocations.reduce((totalToPay, next) => {
                            totalToPay += resolvePrice(next.amount, next.frequency, next.locationName.match(/(Airport)/))
                            return totalToPay
                          }, 0)} £
                          </Paper>
                      </div>
                    )}

                    {arrayHelpers.form.values.selectedLocations.length !== 0 && (
                      <PayPalButton
                        createOrder={(data, actions) => {
                          const totalToPay = arrayHelpers.form.values.selectedLocations.reduce((total, next) => {
                            total += resolvePrice(next.amount, next.frequency, next.locationName.match(/(Airport)/))
                            return total
                          }, 0).toFixed(2)

                          const payData = {
                            intent: "CAPTURE",
                            purchase_units: [{
                              amount: {
                                currency_code: "GBP",
                                value: totalToPay,
                                breakdown: {
                                  item_total: {
                                    currency_code: 'GBP',
                                    value: totalToPay
                                  }
                                }
                              },
                              items: arrayHelpers.form.values.selectedLocations.map((i) => {
                                return {
                                  name: `banner to be displayed on bookingclik.com during ${i.amount} ${i.frequency}s for ${i.locationName}`,
                                  quantity: 1,
                                  unit_amount: {
                                    currency_code: "GBP",
                                    value: resolvePrice(i.amount, i.frequency, i.locationName.match(/(Airport)/)).toFixed(2),
                                  },
                                }
                              }),
                            }],
                          }
                          return actions.order.create(payData);
                        }}
                        amount={
                          arrayHelpers.form.values.selectedLocations.reduce((totalToPay, next) => {
                            totalToPay += resolvePrice(next.amount, next.frequency, next.locationName.match(/(Airport)/))
                            return totalToPay
                          }, 0)
                        }
                        onSuccess={(details, paypalData) => {
                          const data = {
                            orderId: paypalData.orderID,
                            country: countries.find(i => i.code == selectedCountry).name,
                            selectedLocations: arrayHelpers.form.values.selectedLocations,
                          };
                          doPost({ data })
                          .then(() => {
                            handleClose();
                          })
                        }}
                        options={{
                          clientId: "AcDoYg60CAk48yIdgpLTKR8h99G9sdv_Xmdg8jzd8HTla_01m29inTc7d-kT5MdRwYcnpq5GmrdXbt4A",
                          currency: 'GBP'
                        }}
                      />
                    )}

                  </div>
                )}
              />

            </form>
          )}
      </Formik>
    </Modal>
  );
}

export const BuyBannerModal = connect(
  ({ auth }) => ({ user: auth.user }),
  auth.actions
)(CreateLocationComponent);