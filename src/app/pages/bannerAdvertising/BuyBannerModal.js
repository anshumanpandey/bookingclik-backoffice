import React, { useState, useEffect } from 'react';
import { Modal } from "react-bootstrap";
import {
  FormControl, Step, StepLabel, InputLabel, Select, MenuItem, CircularProgress,
  TextField, Paper, Checkbox, FormControlLabel, Input, ListItemText, Typography, Button
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { Formik, FieldArray, Field } from "formik";
import { reportPayment } from "../../crud/pay.crud";
import { getLocations, postBannerRecip } from "../../crud/banners.crud";
import AxioHook from 'axios-hooks'
import { PayPalButton } from "react-paypal-button-v2";
import { connect } from "react-redux";
import countries from "../../widgets/countryDropdown/countries.json"
import * as auth from "../../store/ducks/auth.duck";
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { DesktopDateRangePicker, DateRange, DateRangeDelimiter, LocalizationProvider } from "next-material-picker";
import Stepper from '@material-ui/core/Stepper';
import moment from 'moment'
import DeleteIcon from '@material-ui/icons/Delete';


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
  selectAllItem: {
    width: '90%',
  },
  closeManuItem: {
    width: '10%',
    float: 'right'
  },
  centeredMenuText: {
    justifyContent: 'center',
    display: 'flex',
  },
  dateInput: {
    width: '100%',
  },
}));

const BUY_UNITS = {
  DAY: 'day',
  MONTH: 'month',
  WEEK: 'wekk',
}

function getSteps() {
  return ['Select location and date', 'Check Price', 'Pay!'];
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
  const [isSelectingDate, setIsSelectingDate] = useState(false);
  const [selectedDate, handleDateChange] = useState([null, null]);
  const [menuIsOpen, setMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [perCountry, setPerCountry] = useState(null);
  const [countryArr, setCountryArray] = useState([]);
  const [locationsReq, refetch] = AxioHook(getLocations())
  const [selectedLocations, setSelectedLocations] = useState([]);
  const classes = useStyles();

  const [stepOneDone, setStepOneDone] = useState(false);
  const [stepTwo, setStepTwoDone] = useState(false);
  const [stepThree, setStepThreeDone] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const [postReq, doPost] = AxioHook(postBannerRecip(), { manual: true })

  useEffect(() => {
    if (locationsReq.data) {
      const list = locationsReq.data.reduce((json, next) => {
        const { country, locationName } = next
        if (!json[country]) {
          json[country] = [next]
        } else {
          json[country].push(next)
        }
        return json;
      }, {})
      setPerCountry(list)
      setCountryArray(Object.keys(list).sort(function (a, b) {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
      }))
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
          isSubmitting,
          setFieldError
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
                render={arrayHelpers => {
                  const onSelectChange = (array, extra) => {
                    if (array.some(i => i == 'CLOSE')) {
                      setMenuOpen(false)
                      return
                    }
                    if (array.some(i => i == 'ALL')) array = perCountry[selectedCountry]
                    .filter(i => i.availableAmount != 0)
                    .filter((location, index, arr) => {
                      const isFilled = arr.some(i => {
                        if (i.BannerPurchaseds.length == 0) {
                          return false
                        }

                        return i.BannerPurchaseds.some(purchasedBanner => {
                          const availableFromDate = moment(purchasedBanner.availableFromDate)
                          const availableToDate = moment(purchasedBanner.availableToDate)
                          const isBetween = selectedDate[0].isBetween(availableFromDate, availableToDate, undefined, '[]') ||
                            selectedDate[1].isBetween(availableFromDate, availableToDate, undefined, '[]');
                          const isInside = availableFromDate.isBetween(selectedDate[0], selectedDate[1], undefined, '[]') ||
                            availableToDate.isBetween(selectedDate[0], selectedDate[1], undefined, '[]');
                          return (isBetween || isInside) && location.locationName == i.locationName
                        })
                      })

                      return !isFilled

                    })
                    if (array.some(i => i == 'NONE')) array = []

                    const map = new Map();
                    array
                      .forEach((next) => {
                        if (map.has(next.id)) {
                          map.delete(next.id)
                        } else {
                          map.set(next.id, next)
                        }
                      })

                    const objs = []
                    Array.from(map.values())
                      .forEach((location) => {
                        objs.push({ ...location, error: false, fromDate: selectedDate[0], toDate: selectedDate[1] })
                      })

                    arrayHelpers.form.setFieldValue("selectedLocations", [...objs])
                    if (selectedDate[0] !== null && selectedDate[1] !== null && objs.length !== 0) {
                      setStepOneDone(true)
                    } else {
                      setStepOneDone(false)
                    }
                  }
                  return (
                    <>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                      <div>
                        {activeStep == 0 && (
                          <>
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
                                      countryArr
                                        .map(c => {
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
                                <DesktopDateRangePicker
                                  className="date-range"
                                  inputFormat="DD-MM-YYYY"
                                  startText="From"
                                  endText="To"
                                  open={isSelectingDate}
                                  onChange={() => { }}
                                  onOpen={() => setIsSelectingDate(true)}
                                  value={selectedDate}
                                  disablePast={true}
                                  onAccept={(datePair) => {
                                    arrayHelpers.form.values.selectedLocations.forEach((l, idx) => {
                                      arrayHelpers.replace(idx, { ...l, fromDate: datePair[0] ? datePair[0] : null, toDate: datePair[1] ? datePair[1] : null })
                                    })
                                    handleDateChange(datePair)
                                    if (datePair[0] !== null && datePair[1] !== null && arrayHelpers.form.values.selectedLocations.length !== 0) {
                                      setStepOneDone(true)
                                    } else {
                                      setStepOneDone(false)
                                    }
                                    setIsSelectingDate(false)
                                  }}
                                  renderInput={(startProps, endProps) => {
                                    delete startProps.variant
                                    delete startProps.helperText

                                    delete endProps.variant
                                    delete endProps.helperText

                                    return (
                                      <>
                                        <TextField classes={{ root: classes.dateInput }} {...startProps} />
                                        <DateRangeDelimiter> to </DateRangeDelimiter>
                                        <TextField classes={{ root: classes.dateInput }} {...endProps} />
                                      </>
                                    );
                                  }}
                                />
                              </div>
                            )}

                            {selectedCountry && selectedDate[0] !== null && selectedDate[1] !== null && (
                              <div style={{ marginBottom: '1rem' }}>
                                <FormControl style={{ width: '100%' }}>
                                  <InputLabel id="demo-mutiple-name-label">Locations</InputLabel>
                                  <Select
                                    labelId="demo-mutiple-name-label"
                                    open={menuIsOpen}
                                    onClose={() => setMenuOpen(false)}
                                    onOpen={() => setMenuOpen(true)}
                                    multiple
                                    value={arrayHelpers.form.values.selectedLocations
                                      .filter(i => i.availableAmount != 0)
                                      .sort(function (a, b) {
                                        if (a.locationName < b.locationName) { return -1; }
                                        if (a.locationName > b.locationName) { return 1; }
                                        return 0;
                                      })}
                                    input={<Input />}
                                    renderValue={(selected) => selected.map(i => i.locationName).join(', ')}
                                    onChange={(e, t) => {
                                      onSelectChange(e.target.value, t)
                                    }}
                                  >
                                    <MenuItem classes={{ root: classes.closeManuItem }} value={'CLOSE'} >
                                      <ListItemText classes={{ root: classes.centeredMenuText }} primary={'X'} />
                                    </MenuItem>
                                    <MenuItem classes={{ root: classes.selectAllItem }} value={arrayHelpers.form.values.selectedLocations.length == perCountry[selectedCountry].length ? 'NONE' : 'ALL'} >
                                      <ListItemText
                                        primary={arrayHelpers.form.values.selectedLocations.length == perCountry[selectedCountry].length ? 'UNSELECT ALL' : 'SELECT ALL'}
                                      />
                                    </MenuItem>
                                    {perCountry[selectedCountry]
                                    .filter(i => i.availableAmount != 0)
                                    .filter((location, index, arr) => {
                                      const isFilled = arr.some(i => {
                                        if (i.BannerPurchaseds.length == 0) {
                                          return false
                                        }

                                        return i.BannerPurchaseds.some(purchasedBanner => {
                                          const availableFromDate = moment(purchasedBanner.availableFromDate)
                                          const availableToDate = moment(purchasedBanner.availableToDate)
                                          const isBetween = selectedDate[0].isBetween(availableFromDate, availableToDate, undefined, '[]') ||
                                            selectedDate[1].isBetween(availableFromDate, availableToDate, undefined, '[]');
                                          const isInside = availableFromDate.isBetween(selectedDate[0], selectedDate[1], undefined, '[]') ||
                                            availableToDate.isBetween(selectedDate[0], selectedDate[1], undefined, '[]');
                                          return (isBetween || isInside) && location.locationName == i.locationName
                                        })
                                      })

                                      return !isFilled

                                    })
                                    .map((c, idx, arr) => {
                                      return (
                                        <MenuItem key={c.id} value={c}>
                                          <Checkbox checked={arrayHelpers.form.values.selectedLocations.find(i => i.locationName == c.locationName) !== undefined} />
                                          <ListItemText primary={c.locationName} />
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              </div>
                            )}

                          </>
                        )}

                        {activeStep == 1 && selectedDate[0] !== null && selectedDate[1] !== null && arrayHelpers.form.values.selectedLocations.map((location, index, arr) => {
                          const locationWithDatesAssigned = arr.filter(i => i.fromDate && i.toDate);
                          const isFilled = locationWithDatesAssigned.length != 0 && arr.filter(i => i.fromDate && i.toDate).some(i => {
                            if (i.BannerPurchaseds.length == 0) {
                              return false
                            }


                            return i.BannerPurchaseds.some(purchasedBanner => {
                              const availableFromDate = moment(purchasedBanner.availableFromDate)
                              const availableToDate = moment(purchasedBanner.availableToDate)
                              const isBetween = i.fromDate.isBetween(availableFromDate, availableToDate, undefined, '[]') ||
                                i.toDate.isBetween(availableFromDate, availableToDate, undefined, '[]');
                              const isInside = availableFromDate.isBetween(i.fromDate, i.toDate, undefined, '[]') ||
                                availableToDate.isBetween(i.fromDate, i.toDate, undefined, '[]');
                              return (isBetween || isInside) && location.locationName == i.locationName
                            })
                          })

                          if (location.availableAmount == 0) {
                            return null
                          } else if (isFilled) {
                            return null
                          } else {
                            if (location.error) arrayHelpers.replace(index, { ...location, error: false })
                          }
                          return (
                            <>
                              <div style={{ display: 'flex', marginBottom: '1rem' }}>
                                <div style={{ flex: 1, display: 'flex', }}>
                                  <Input style={{ alignSelf: 'end' }} disabled={true} value={location.locationName} />
                                </div>

                                <div style={{ flex: 3, display: 'flex' }}>
                                  <DesktopDateRangePicker
                                    className="date-range"
                                    inputFormat="DD-MM-YYYY"
                                    startText="From"
                                    endText="To"
                                    open={false}
                                    onChange={() => { }}
                                    value={selectedDate}
                                    disablePast={true}
                                    renderInput={(startProps, endProps) => {
                                      delete startProps.variant
                                      delete startProps.helperText

                                      delete endProps.variant
                                      delete endProps.helperText

                                      return (
                                        <>
                                          <TextField classes={{ root: classes.dateInput }} {...startProps} disabled />
                                          <DateRangeDelimiter> to </DateRangeDelimiter>
                                          <TextField classes={{ root: classes.dateInput }} {...endProps} disabled />
                                        </>
                                      );
                                    }}
                                  />
                                </div>

                                <div style={{ display: 'flex', flex: '0.2', justifyContent: 'center' }}>
                                  <h5 style={{ alignSelf: 'end', margin: 0 }}>=</h5>
                                </div>

                                <div style={{ display: 'flex', flex: '0.3', justifyContent: 'center' }}>
                                  <h5 style={{ alignSelf: 'end', margin: 0 }}>{location.toDate.diff(location.fromDate, 'days') * location.price} £</h5>
                                </div>

                                <div style={{ display: 'flex', flex: '0.3', justifyContent: 'center', alignItems: 'end', cursor: 'pointer' }}>
                                  <DeleteIcon onClick={() => arrayHelpers.remove(index)} />
                                </div>

                              </div>
                            </>
                          );
                        })}

                        {activeStep == 2 && selectedDate[0] != null && selectedDate[1] != null
                          && (
                            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                              <Paper className={classes.paper}>
                                <div>{arrayHelpers.form.values.selectedLocations.length} locations selected</div>
                              Total: {arrayHelpers.form.values.selectedLocations.reduce((totalToPay, next) => {
                                  totalToPay += next.toDate.diff(next.fromDate, 'days') * next.price
                                  return totalToPay
                                }, 0)} £
                          </Paper>
                            </div>
                          )}

                        {
                          activeStep == 2 &&
                          arrayHelpers.form.values.selectedLocations.length !== 0 &&
                          !arrayHelpers.form.values.selectedLocations.some(l => l.error) &&
                          selectedDate.every(i => i.fromDate !== null && i.toDate !== null)
                          && (
                            <PayPalButton
                              createOrder={(data, actions) => {
                                const totalToPay = arrayHelpers.form.values.selectedLocations.reduce((totalToPay, next) => {
                                  totalToPay += next.toDate.diff(next.fromDate, 'days') * next.price
                                  return totalToPay
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
                                  selectedLocations: arrayHelpers.form.values.selectedLocations.map((l) => {
                                    return {
                                      ...l,
                                      fromDate: l.fromDate.unix(),
                                      toDate: l.toDate.unix()
                                    }
                                  }),
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

                        <div>
                          <div>
                            <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                            >
                              Back
              </Button>
                            <Button disabled={(activeStep == 0 && !stepOneDone) || activeStep == 2} variant="contained" color="primary" onClick={handleNext} >
                              {activeStep === steps.length - 1 ? 'Pay' : 'Next'}
                            </Button>
                          </div>
                        </div>

                      </div>
                    </>
                  )
                }}
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