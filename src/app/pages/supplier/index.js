import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import { connect } from "react-redux";
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getSupplier } from "../../crud/super/supplier.crud";
import FuzzySearch from 'fuzzy-search';
import { PaymentModal } from './PaymentModal';
import { ClickModal } from './ClickModal';
import { CreateUserModal } from './CreateUserModal';
import { EditSuppplier } from './EditSuppplier';
import { CompaniesModal } from './CompaniesModal';
import PaymentIcon from '@material-ui/icons/Payment';
import MouseIcon from '@material-ui/icons/Mouse';
import EditIcon from '@material-ui/icons/Edit';
import BusinessIcon from '@material-ui/icons/Business';


const SupplierComponent = () => {
    const [searcherApproved, setSearcherApproved] = useState(null);

    const [dataToApprovedDisplay, setDataApprovedDisplay] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showClickModal, setShowClickModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCompanies, setShowCompanies] = useState(false);

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
            name: 'Email',
            selector: 'email',
        },
        {
            name: 'Price per Click',
            cell: (r) => `${r.currencySymbol}${r.costPerClick}`
        },
        {
            name: 'Credits',
            selector: 'credits',
        },
        {
            name: 'Created at',
            selector: 'createdAt'
        },
        {
            name: 'Transaction',
            cell: (r) => {
                return <PaymentIcon onClick={() => {
                    setShowPaymentModal(r);
                }}/>
            },
        },
        {
            name: 'Clicks',
            cell: (r) => {
                return <MouseIcon onClick={() => {
                    setShowClickModal(r);
                }}/>
            },
        },
        {
            name: 'Edit',
            cell: (r) => {
                return <EditIcon onClick={() => {
                    setShowEditModal(r);
                }}/>
            },
        },
        {
            name: 'Blacklisted Companies',
            cell: (r) => {
                return <BusinessIcon onClick={() => {
                    setShowCompanies(r);
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
                    <Input placeholder="Search" type="text" onChange={(e) => {
                        if (searcherApproved) setDataApprovedDisplay(searcherApproved.search(e.target.value))
                    }} />
                    <Button variant="contained" color="primary" onClick={() => {
                        setShowCreateModal(true);
                    }}>Create</Button>
                </>
            }
            data={dataToApprovedDisplay.sort(function(a, b){
                if(a.email < b.email) { return -1; }
                if(a.email > b.email) { return 1; }
                return 0;
            })}
        />
    );


    if (clientsLocationReq.error) {
        BodyApproved = (<h3>Error fetching the resource</h3>);
    }



    return (
        <>
            {BodyApproved}
            {showCreateModal && <CreateUserModal user={showPaymentModal} handleClose={(reason) => {
                setShowCreateModal(false)
                if (reason == 'created') refetch();
            }} />}
            {showPaymentModal && <PaymentModal user={showPaymentModal} handleClose={() => setShowPaymentModal(false)} />}
            {showCompanies && clientsLocationReq.data.find(i => i.id == showCompanies.id) && <CompaniesModal refetch={refetch} user={clientsLocationReq.data.find(i => i.id == showCompanies.id)} handleClose={() => setShowCompanies(false)} />}
            {showClickModal && <ClickModal  user={showClickModal} handleClose={() => setShowClickModal(false)} />}
            {showEditModal && <EditSuppplier  user={showEditModal} handleClose={(reason) => {
                setShowEditModal(false)
                if (reason == 'edited') refetch();
            }} />}
        </>
    );
}

const mapStateToProps = ({ auth: { user }, builder }) => ({
    user,
});

export default connect(mapStateToProps)(SupplierComponent);