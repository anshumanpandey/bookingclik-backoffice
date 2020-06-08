import React, { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import DataTable from 'react-data-table-component';
import { injectIntl } from "react-intl";
import moment from 'moment';
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


const CreateLocationComponent = ({ handleClose, iataCode, user }) => {
    const [dates, setDates] = useState([moment().startOf('month'), moment().endOf('month')])

    const CalendarInput = () => {
        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                    value={dates[0]}
                    onChange={(d) => setDates(p => [d, p[1]])}
                    disableToolbar
                    variant="inline"
                />

                <DatePicker
                    value={dates[1]}
                    onChange={(d) => setDates(p => [p[0],d])}
                    disableToolbar
                    variant="inline"
                />

            </MuiPickersUtilsProvider>
        );
    }


    return (
        <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
            <Modal.Header closeButton>
                <Modal.Title>Clicks</Modal.Title>
            </Modal.Header>
            <DataTable
                subHeaderAlign="center"
                columns={[
                    {
                        name: 'IP',
                        selector: 'ip',
                    },
                    {
                        name: 'Country',
                        selector: 'country',
                    },
                    {
                        name: 'Pick up Location',
                        selector: 'pickupLocation',
                    },
    
                    {
                        name: 'Dropoff location',
                        selector: 'dropoffLocation',
                    },
                    {
                        name: 'Created At',
                        selector: 'created_at',
                    },
                    {
                        name: 'Brand',
                        cell: () => user.companyName
                    },
                ]}
                pagination={true}
                data={user.ClickTracks.filter(i => moment(i.created_at).isBetween(dates[0], dates[1]))}
                actions={
                    <>
                        <CalendarInput />
                    </>
                }
            />
        </Modal>
    );
}


export const ClickModal = injectIntl(
    connect(
        null,
    )(CreateLocationComponent)
);