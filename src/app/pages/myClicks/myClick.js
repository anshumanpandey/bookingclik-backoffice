import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getMyClicks } from "../../crud/my-click-crud";
import FuzzySearch from 'fuzzy-search';

export default function Clients() {
    const [searcherApproved, setSearcherApproved] = useState(null);

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


    let BodyApproved = (
        <DataTable
            progressPending={clientsLocationReq.loading}
            subHeaderAlign="center"
            columns={[...columns,]}
            pagination={true}
            actions={
                <>
                    <Input type="text" onChange={(e) => {
                        if (searcherApproved) setDataApprovedDisplay(searcherApproved.search(e.target.value))
                    }} />
                </>
            }
            data={dataToApprovedDisplay}
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