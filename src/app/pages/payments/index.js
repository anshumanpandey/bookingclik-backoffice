import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getPayments } from "../../crud/pay.crud";
import FuzzySearch from 'fuzzy-search';
import { parse, format } from 'date-fns';
import { AddCreditsModal } from "./AddCreditsModal";

export default function Clients() {
    const [searcherApproved, setSearcherApproved] = useState(null);

    const [dataToApprovedDisplay, setDataApprovedDisplay] = useState([]);
    const [displayModal, setDisplayModal] = useState(false);

    const [clientsLocationReq, refetch] = AxioHook(getPayments())

    const fieldsToFilterFor = ['orderId']
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
            name: 'Amount',
            selector: 'amount',
        },
        {
            name: 'Item',
            selector: 'buyedItem',
        },
        {
            name: 'Created at',
            selector: 'createdAt',
            //2020-06-03T05:29:26.000Z
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
                    <Input placeholder="Search For Transaction" type="text" onChange={(e) => {
                        if (searcherApproved) setDataApprovedDisplay(searcherApproved.search(e.target.value))
                    }} />
                    <Button variant="contained" color="primary" onClick={() => {
                        setDisplayModal(true);
                    }}>Add Funds</Button>
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
            {displayModal && <AddCreditsModal refetch={refetch} handleClose={(reason) => {
                setDisplayModal(false)
                if (reason == 'PAY') refetch();
            }} />}
        </>
    );
}