import React, { useState, useEffect } from "react";
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getMyClicks } from "../../crud/my-click-crud";
import FuzzySearch from 'fuzzy-search';
import moment from 'moment';
import { Button } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { CSVLink, CSVDownload } from "react-csv";
import { connect } from "react-redux";


function Clients({ user }) {
    const [searcherApproved, setSearcherApproved] = useState(null);
    const [dates, setDates] = useState([moment().startOf('month'), moment().endOf('month')])

    const [dataToApprovedDisplay, setDataApprovedDisplay] = useState([]);
    const [displayModal, setDisplayModal] = useState(false);

    const [clientsLocationReq, refetch] = AxioHook(getMyClicks())

    const fieldsToFilterFor = ['country', 'ip']
    useEffect(() => {
        if (clientsLocationReq.data) {

            setDataApprovedDisplay(clientsLocationReq.data)
            if (!searcherApproved) setSearcherApproved(new FuzzySearch(clientsLocationReq.data, fieldsToFilterFor, {}))
        }
    }, [clientsLocationReq]);

    const CalendarInput = () => {
        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                    label="From"
                    value={dates[0]}
                    onChange={(d) => setDates(p => [d, p[1]])}
                    disableToolbar
                    variant="inline"
                />

                <DatePicker
                    label="To"
                    value={dates[1]}
                    onChange={(d) => setDates(p => [p[0],d])}
                    disableToolbar
                    variant="inline"
                />

            </MuiPickersUtilsProvider>
        );
    }


    let BodyApproved = (
        <DataTable
            data={dataToApprovedDisplay}
            progressPending={clientsLocationReq.loading}
            subHeader={true}
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
                    selector: 'User.companyName',
                },
            ]}
            pagination={true}
            actions={
                <>
                    <CalendarInput />
                    <CSVLink
                        filename={`${user.companyName}-${moment().format()}.csv`}
                        data={dataToApprovedDisplay.map(i => {
                            return {
                                ip: i.ip,
                                country: i.country,
                                dropoffLocation: i.dropoffLocation,
                                pickupLocation: i.pickupLocation,
                                created_at: i.created_at,
                                brand: i.supplierName,
                            };
                        })}
                    >
                        <Button color="primary" >
                            Download CSV
                        </Button >
                    </CSVLink>
                </>
            }
        />
    );


    if (clientsLocationReq.error) {
        BodyApproved = (<h3>Error fetching the resource</h3>);
    }



    return (
        <>
            {BodyApproved}
        </>
    );
}


const mapStateToProps = ({ auth: { user }, builder }) => ({
    user,
});

export default connect(mapStateToProps)(Clients);