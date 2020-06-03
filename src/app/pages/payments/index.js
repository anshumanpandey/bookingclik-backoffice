import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getPayments } from "../../crud/pay.crud";
import FuzzySearch from 'fuzzy-search';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Clients() {
    const [searcherApproved, setSearcherApproved] = useState(null);

    const [dataToApprovedDisplay, setDataApprovedDisplay] = useState([]);
    const [displayModal, setDisplayModal] = useState(false);

    const [clientsLocationReq, refetch] = AxioHook(getPayments())

    const fieldsToFilterFor = ['country']
    useEffect(() => {
        if (clientsLocationReq.data) {

            setDataApprovedDisplay(clientsLocationReq.data)
            if (!searcherApproved) setSearcherApproved(new FuzzySearch(clientsLocationReq.data, fieldsToFilterFor, {}))
        }
    }, [clientsLocationReq]);

    const columns = [
        {
            name: 'ID',
            selector: 'orderId',
        },
        {
            name: 'Created at',
            selector: 'createdAt'
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
                    <Button variant="contained" color="primary" onClick={() => {
                        setDisplayModal(true);
                    }}>Add founds</Button>
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