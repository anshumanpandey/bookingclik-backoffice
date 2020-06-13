import React, { useState, useEffect } from 'react';
import { Modal } from "react-bootstrap";
import {
  FormControl, Step, StepLabel, InputLabel, Select, MenuItem, CircularProgress,
  TextField, Paper, Checkbox, FormControlLabel, Input, ListItemText, Typography, Button
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { Formik, FieldArray, Field } from "formik";
import { getLocations, postBannerRecip } from "../../crud/banners.crud";
import AxioHook from 'axios-hooks'
import { PayPalButton } from "react-paypal-button-v2";
import { connect } from "react-redux";
import countries from "../../widgets/countryDropdown/countries.json"
import * as auth from "../../store/ducks/auth.duck";
import DataTable from 'react-data-table-component';
import { DesktopDateRangePicker, DateRange, DateRangeDelimiter, LocalizationProvider } from "next-material-picker";
import Stepper from '@material-ui/core/Stepper';
import DeleteIcon from '@material-ui/icons/Delete';

function createFormData(formData, key, data) {
  if (data === Object(data) || Array.isArray(data)) {
    for (var i in data) {
      createFormData(formData, key + '[' + i + ']', data[i]);
    }
  } else {
    formData.append(key, data);
  }
}

function checkImageResolution(imgFile, imgWidth, imgHeight, imgTime) {
  return new Promise((resolve, rejected) => {
    var reader = new FileReader();

    //Read the contents of Image File.
    reader.readAsDataURL(imgFile);
    reader.onload = function (e) {

      //Initiate the JavaScript Image object.
      var image = new Image();

      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;

      //Validate the File Height and Width.
      image.onload = function () {
        var height = this.height;
        var width = this.width;

        if (height !== imgHeight) {
          rejected(`Invalid height. ${imgTime} must of size ${imgHeight}`);
          return
        }
        if (width !== imgWidth) {
          rejected(`Invalid width. ${imgTime} must of size ${imgWidth}`);
          return
        }
        resolve(true)
      };
    }
  });
}

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
  dropzoneTextContainer: {
    padding: '1rem'
  }
}));

const BUY_UNITS = {
  DAY: 'day',
  MONTH: 'month',
  WEEK: 'wekk',
}

function getSteps() {
  return ['Date', 'Location', 'Configure', 'Review', 'Payment'];
}

const STEPS_ENUM = {
  DATE: 0,
  LOCATION: 1,
  CONFIGURE: 2,
  REVIEW: 3,
  PAYMENT: 4,
}

const CreateLocationComponent = ({ handleClose }) => {
  const [isSelectingDate, setIsSelectingDate] = useState(false);
  const [selectedDate, handleDateChange] = useState([null, null]);
  const [bannerImages, setBannersImages] = useState([null, null]);
  const [urlToOpen, setUrlToOpen] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [perCountry, setPerCountry] = useState(null);
  const [countryArr, setCountryArray] = useState([]);
  const [locationsReq, refetch] = AxioHook(getLocations())
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [activeStep, setActiveStep] = useState(STEPS_ENUM.DATE);
  const classes = useStyles();

  const [stepOneDone, setStepOneDone] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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
      const countryArr = Object.keys(list)
        .sort((a, b) => {
          const countryA = countries.find(i => i.code.toLocaleLowerCase() == a.toLocaleLowerCase())?.name
          const countryB = countries.find(i => i.code.toLocaleLowerCase() == b.toLocaleLowerCase())?.name
          return countryA.localeCompare(countryB)
        })
      setSelectedCountry('NONE')
      setCountryArray(countryArr)
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
          setStatus
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
                  const resolveNextButtonDisabledStatus = () => {
                    if (activeStep == STEPS_ENUM.DATE && selectedDate[0] == null && selectedDate[1] == null) return true
                    if (activeStep == STEPS_ENUM.LOCATION && arrayHelpers.form.values.selectedLocations.length == 0) return true
                    if (activeStep == STEPS_ENUM.CONFIGURE && (bannerImages[0] instanceof File == false || bannerImages[1] instanceof File == false || urlToOpen == null)) return true
                    if (activeStep == STEPS_ENUM.PAYMENT) return true

                    return false
                  }

                  const onSelectChange = (array, extra) => {
                    if (array.some(i => i == 'ALL')) array = perCountry[selectedCountry]
                      .filter(i => i.availableAmount != 0)
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
                        {activeStep == STEPS_ENUM.DATE && (
                          <>
                            <div role="alert" className="alert alert-secondary">
                              <div className="alert-text">
                                In order to buy banners please have 2 two banner images ready of size 160*600 and 1382*200
                              </div>
                            </div>
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
                                  if (datePair[0] !== null && datePair[1] !== null) {
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
                          </>
                        )}

                        {activeStep == STEPS_ENUM.LOCATION && selectedDate[0] !== null && selectedDate[1] !== null && (
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
                                    value={selectedCountry}
                                    onChange={(e) => {
                                      if (e.target.value == 'NONE') {
                                        setSelectedCountry(null)
                                        return
                                      }
                                      setSelectedCountry(e.target.value)
                                      arrayHelpers.form.setFieldValue("selectedLocations", [])
                                    }}
                                  >
                                    <MenuItem value={'NONE'}>Please Select</MenuItem>
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

                            {selectedCountry && selectedCountry !== 'NONE' && (
                              <>
                                <div style={{ marginBottom: '1rem' }}>
                                  <DataTable
                                    noHeader={true}
                                    selectableRows={true}
                                    onSelectedRowsChange={(e) => {
                                      console.log(e)
                                      onSelectChange(e.selectedRows)
                                    }}
                                    columns={[
                                      {
                                        name: 'Select all',
                                        selector: 'locationName',
                                      },
                                    ]}
                                    selectableRowSelected={(row) => {
                                      return arrayHelpers.form.values.selectedLocations.find(l => l.locationName == row.locationName) !== undefined
                                    }}
                                    pagination={true}
                                    data={perCountry[selectedCountry]
                                      .sort((a, b) => a.locationName.localeCompare(b.locationName))
                                      .filter(i => i.availableAmount != 0)}
                                  />
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {activeStep == STEPS_ENUM.CONFIGURE && (
                          <div style={{ marginBottom: '1rem' }}>
                            <div style={{ flex: 1, display: 'flex', marginBottom: '1rem' }}>
                              <TextField fullWidth style={{ alignSelf: 'end' }} label={'URL'} value={urlToOpen} onChange={(e) => setUrlToOpen(e.target.value)} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}>
                                <input
                                  accept="image/*"
                                  className={classes.input}
                                  style={{ display: 'none' }}
                                  id="raised-button-file-desktop"
                                  onChange={({ target }) => {
                                    checkImageResolution(target.files[0], 160, 600, "Desktop Image")
                                      .then(() => {
                                        setBannersImages(p => [target.files[0], p[1]])
                                        setStatus(null)
                                      })
                                      .catch(err => setStatus(err))
                                  }}
                                  type="file"
                                />
                                <label htmlFor="raised-button-file-desktop">
                                  <Button color={"primary"} variant="container" component="span">
                                    Upload desktop banner image
                                  </Button>
                                </label>
                                {!bannerImages[0] && <p>Select an 160x600 resolution image</p>}
                                {bannerImages[0] && <img style={{ width: 64, height: 240 }} src={URL.createObjectURL(bannerImages[0])} />}
                              </div>
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}>
                                <input
                                  accept="image/*"
                                  className={classes.input}
                                  style={{ display: 'none' }}
                                  id="raised-button-file-mobile"
                                  onChange={({ target }) => {
                                    checkImageResolution(target.files[0], 1382, 200, "Mobile Image")
                                      .then(() => {
                                        setBannersImages(p => [p[0], target.files[0]])
                                        setStatus(null)
                                      })
                                      .catch(err => setStatus(err))
                                  }}
                                  type="file"
                                />
                                <div>
                                <label htmlFor="raised-button-file-mobile">
                                  <Button color={"primary"} variant="container" component="span">
                                    Upload mobile banner image
                                  </Button>
                                </label>
                                {!bannerImages[1] && <p>Select an 1382x200 resolution image</p>}
                                </div>
                                {bannerImages[1] && <img style={{ width: 300 }} src={URL.createObjectURL(bannerImages[1])} />}
                              </div>
                            </div>
                          </div>
                        )}



                        {activeStep == STEPS_ENUM.REVIEW && selectedDate[0] !== null && selectedDate[1] !== null && arrayHelpers.form.values.selectedLocations.map((location, index, arr) => {
                          if (location.availableAmount == 0) {
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
                                          <Input classes={{ root: classes.dateInput }} {...startProps} disabled={true} />
                                          <DateRangeDelimiter> to </DateRangeDelimiter>
                                          <Input classes={{ root: classes.dateInput }} {...endProps} disabled={true} />
                                        </>
                                      );
                                    }}
                                  />
                                </div>

                                <div style={{ display: 'flex', flex: '0.2', justifyContent: 'center' }}>
                                  <h5 style={{ alignSelf: 'end', margin: 0 }}>=</h5>
                                </div>

                                <div style={{ display: 'flex', flex: '0.3', justifyContent: 'center' }}>
                                  <h5 style={{ alignSelf: 'end', margin: 0 }}>{(location.toDate.diff(location.fromDate, 'days') + 1) * location.price} £</h5>
                                </div>

                                <div style={{ display: 'flex', flex: '0.3', justifyContent: 'center', alignItems: 'end', cursor: 'pointer' }}>
                                  <DeleteIcon onClick={() => arrayHelpers.remove(index)} />
                                </div>

                              </div>
                            </>
                          );
                        })}

                        {activeStep == STEPS_ENUM.PAYMENT && selectedDate[0] != null && selectedDate[1] != null
                          && (
                            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                              <Paper className={classes.paper}>
                                <div>{arrayHelpers.form.values.selectedLocations.length} locations selected</div>
                              Total: {arrayHelpers.form.values.selectedLocations.reduce((totalToPay, next) => {
                                  totalToPay += (next.toDate.diff(next.fromDate, 'days') + 1) * next.price
                                  return totalToPay
                                }, 0)} £
                          </Paper>
                            </div>
                          )}

                        {
                          activeStep == STEPS_ENUM.PAYMENT &&
                          arrayHelpers.form.values.selectedLocations.length !== 0 &&
                          !arrayHelpers.form.values.selectedLocations.some(l => l.error) &&
                          selectedDate.every(i => i.fromDate !== null && i.toDate !== null)
                          && (
                            <PayPalButton
                              createOrder={(data, actions) => {
                                const totalToPay = arrayHelpers.form.values.selectedLocations.reduce((totalToPay, next) => {
                                  totalToPay += (next.toDate.diff(next.fromDate, 'days') + 1) * next.price
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
                                        name: `banner to be displayed on bookingclik.com during ${selectedDate[1].diff(selectedDate[0], 'days') + 1 } days for ${i.locationName}`,
                                        quantity: 1,
                                        unit_amount: {
                                          currency_code: "GBP",
                                          value: (i.toDate.diff(i.fromDate, 'days') + 1) * i.price,
                                        },
                                      }
                                    }),
                                  }],
                                }
                                return actions.order.create(payData);
                              }}
                              onSuccess={(details, paypalData) => {
                                const formData = new FormData();
                                formData.append("desktopImage", bannerImages[0]);
                                formData.append("mobileImage", bannerImages[1]);

                                formData.set("orderId", paypalData.orderID);
                                formData.set("urlToOpen", urlToOpen);

                                createFormData(
                                  formData,
                                  'selectedLocations',
                                  arrayHelpers.form.values.selectedLocations.map((l) => {
                                    return {
                                      ...l,
                                      fromDate: l.fromDate.unix(),
                                      toDate: l.toDate.unix(),
                                    };
                                  })
                                )

                                doPost({
                                  data: formData,
                                  headers: {
                                    'Content-Type': 'multipart/form-data'
                                  }
                                })
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

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            disabled={activeStep === STEPS_ENUM.DATE}
                            onClick={handleBack}
                          >
                            Back
              </Button>
                          <Button disabled={resolveNextButtonDisabledStatus()} variant="contained" color="primary" onClick={handleNext} >
                            {activeStep === steps.length - 1 ? 'Pay' : 'Next'}
                          </Button>
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