import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getSupplier } from "../../crud/super/supplier.crud";
import FuzzySearch from 'fuzzy-search';
import { PaymentModal } from './PaymentModal';
import { ClickModal } from './ClickModal';
import PaymentIcon from '@material-ui/icons/Payment';
import MouseIcon from '@material-ui/icons/Mouse';

export default function Clients() {
    const [searcherApproved, setSearcherApproved] = useState(null);

    const [dataToApprovedDisplay, setDataApprovedDisplay] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showClickModal, setShowClickModal] = useState(false);

    const [clientsLocationReq, refetch] = AxioHook(getSupplier())

    const fieldsToFilterFor = ['email']
    useEffect(() => {
        if (clientsLocationReq.data) {

            setDataApprovedDisplay(clientsLocationReq.data)
            if (!searcherApproved) setSearcherApproved(new FuzzySearch(clientsLocationReq.data, fieldsToFilterFor, {}))
        }
    }, [clientsLocationReq]);

    const columns = [
        {
            name: 'ID',
            selector: 'id',
        },
        {
            name: 'Email',
            selector: 'email',
        },
        {
            name: 'Price per Click',
            cell: (r) => `${r.costPerClick}$`
        },
        {
            name: 'Created at',
            selector: 'createdAt'
        },
        {
            name: 'Transaction',
            cell: (r) => {
                return <PaymentIcon onClick={() => {
                    console.log('a')
                    setShowPaymentModal(r);
                }}/>
            },
        },
        {
            name: 'Clicks',
            cell: (r) => {
                return <MouseIcon onClick={() => {
                    console.log('a')
                    setShowClickModal(r);
                }}/>
            },
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
            {showPaymentModal && <PaymentModal user={showPaymentModal} handleClose={() => setShowPaymentModal(false)} />}
            {showClickModal && <ClickModal  user={showClickModal} handleClose={() => setShowClickModal(false)} />}
        </>
    );
}