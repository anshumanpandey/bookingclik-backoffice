import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getBlacklistedCompanies, deleteBlacklistedCompanies } from "../../crud/super/blacklist.crud";
import { AddCompanies } from "./AddCompany";
import { EditCompany } from "./EditCompany";
import FuzzySearch from 'fuzzy-search';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

export default function Clients() {
    const [searcherApproved, setSearcherApproved] = useState(null);

    const [dataToApprovedDisplay, setDataApprovedDisplay] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const [companiesReq, refetch] = AxioHook(getBlacklistedCompanies())
    const [deleteReq, doDelete] = AxioHook(deleteBlacklistedCompanies(), { manual: true })

    const fieldsToFilterFor = ['email']
    useEffect(() => {
        if (companiesReq.data) {

            setDataApprovedDisplay(companiesReq.data)
            if (!searcherApproved) setSearcherApproved(new FuzzySearch(companiesReq.data, fieldsToFilterFor, {}))
        }
    }, [companiesReq]);

    const columns = [
        {
            name: 'ID',
            selector: 'id',
        },
        {
            name: 'Name',
            selector: 'companyName',
        },
        {
            name: 'Delete',
            cell: (r) => {
                return <DeleteIcon onClick={() => {
                    doDelete({ data: { id: r.id } })
                        .then(() => refetch())
                }} />
            },
        },
        {
            name: 'Edit',
            cell: (r) => {
                return <EditIcon onClick={() => {
                    setShowEdit(r)
                }} />
            },
        }
    ];


    let BodyApproved = (
        <DataTable
            progressPending={companiesReq.loading}
            subHeaderAlign="center"
            columns={[...columns,]}
            actions={
                <>
                    <Button variant="contained" color="primary" onClick={() => {
                        setShowModal(true);
                    }}>Add company</Button>
                </>
            }
            pagination={true}
            data={dataToApprovedDisplay}
        />
    );


    if (companiesReq.error) {
        BodyApproved = (<h3>Error fetching the resource</h3>);
    }



    return (
        <>
            {BodyApproved}
            {showModal && <AddCompanies companies={companiesReq.data} handleClose={(reason) => {
                setShowModal(false)
                if (reason == 'edited') refetch();
            }} />}

            {showEdit && <EditCompany company={showEdit} handleClose={(reason) => {
                setShowEdit(false)
                if (reason == 'edited') refetch();
            }} />}
        </>
    );
}