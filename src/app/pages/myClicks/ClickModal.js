import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Input } from "@material-ui/core";
import { Modal } from "react-bootstrap";
import moment from 'moment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


const CreateLocationComponent = ({ handleClose, clicks }) => {
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
                data={clicks.filter(i => moment(i.created_at).isBetween(dates[0], dates[1]))}
                subHeaderAlign="left"
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
                        name: 'Created At',
                        selector: 'created_at',
                    },
                ]}
                subHeader={true}
                subHeaderComponent={
                    <h5>
                        Total of {clicks.filter(i => moment(i.created_at).isBetween(dates[0], dates[1]))?.length} clicks
                    </h5>
                }
                pagination={true}
                actions={
                    <>
                        <CalendarInput />
                    </>
                }
            />
        </Modal>
    );
}


export const ClickModal = CreateLocationComponent