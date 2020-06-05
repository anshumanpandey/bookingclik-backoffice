import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getMyClicks } from "../../crud/my-click-crud";
import FuzzySearch from 'fuzzy-search';
import moment from 'moment';
// @ts-ignore
import Calendar from 'rc-calendar';
// @ts-ignore
import DatePicker from 'rc-calendar/lib/Picker';
import 'rc-calendar/assets/index.css';

export default function Clients() {
    const [searcherApproved, setSearcherApproved] = useState(null);

    const [dataToApprovedDisplay, setDataApprovedDisplay] = useState([]);
    const [dates, setDates] = useState([moment().startOf('month'), moment().endOf('month')])
    const [displayModal, setDisplayModal] = useState(false);

    const [clientsLocationReq, refetch] = AxioHook(getMyClicks())

    useEffect(() => {
        refetch()
    }, dates);

    const fieldsToFilterFor = ['country', 'ip']
    useEffect(() => {
        if (clientsLocationReq.data) {

            setDataApprovedDisplay(clientsLocationReq.data)
            if (!searcherApproved) setSearcherApproved(new FuzzySearch(clientsLocationReq.data, fieldsToFilterFor, {}))
        }
    }, [clientsLocationReq]);

    const columns = [
        {
            name: 'IP',
            selector: 'ip',
        },
        {
            name: 'Country',
            selector: 'country',
        },
        {
            name: 'Date',
            selector: 'created_at'
        }
    ];

    const CalendarInput = () => {
        return (
            <>
                <DatePicker
                    value={dates[0]}
                    onChange={(value) => {
                        return setDates(p => [value, p[1]]);
                    }}
                    animation="slide-up"
                    calendar={<Calendar
                        showDateInput={false}
                        format="YYYY-MM-DD"
                        dateInputPlaceholder="please input"
                        defaultValue={dates[0]}
                    />}
                >
                    {
                        () => {
                            return (
                                <div style={{ padding: 'unset', margin: 'unset', boxShadow: 'unset' }} className="main-register">
                                    <div className="custom-form">
                                        <Input
                                            style={{ margin: 0, backgroundColor: 'white' }}
                                            type="text"
                                            placeholder="please select"
                                            readOnly
                                            className="ant-calendar-picker-input ant-input"
                                            value={`${dates[0].format('YYYY-MM-DD')}` || ''}
                                        />
                                    </div>
                                </div>
                            );
                        }
                    }
                </DatePicker>
                <DatePicker
                    value={dates[1]}
                    onChange={(value) => {
                        return setDates(p => [p[0], value]);
                    }}
                    animation="slide-up"
                    calendar={<Calendar
                        showDateInput={false}
                        format="YYYY-MM-DD"
                        dateInputPlaceholder="please input"
                        defaultValue={dates[1]}
                    />}
                >
                    {
                        () => {
                            return (
                                <div style={{ padding: 'unset', margin: 'unset', boxShadow: 'unset' }} className="main-register">
                                    <div className="custom-form">
                                        <Input
                                            style={{ margin: 0, backgroundColor: 'white' }}
                                            type="text"
                                            placeholder="please select"
                                            readOnly
                                            className="ant-calendar-picker-input ant-input"
                                            value={`${dates[1].format('YYYY-MM-DD')}` || ''}
                                        />
                                    </div>
                                </div>
                            );
                        }
                    }
                </DatePicker>
            </>
        );
    }



    let BodyApproved = (
        <DataTable
            data={dataToApprovedDisplay.filter(i => moment(i.created_at).isBetween(dates[0], dates[1]))}
            subHeader={
                <>
                Total of ${clientsLocationReq.data?.length} clicks
                </>
            }
            progressPending={clientsLocationReq.loading}
            subHeaderAlign="center"
            columns={columns}
            pagination={true}
            actions={
                <>
                    <CalendarInput />
                    <Input type="text" onChange={(e) => {
                        if (searcherApproved) setDataApprovedDisplay(searcherApproved.search(e.target.value))
                    }} />
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