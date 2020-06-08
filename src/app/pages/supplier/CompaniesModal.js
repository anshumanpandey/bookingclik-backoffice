import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import axios from 'axios'
import AxioHook, { makeUseAxios } from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getBlacklistedCompanies, deleteBlacklistedCompanies } from "../../crud/super/blacklist.crud";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import FuzzySearch from 'fuzzy-search';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Modal } from "react-bootstrap";
import { AddCompanies } from "./AddCompany";
import { EditCompany } from "./EditCompany";


const CreateLocationComponent = ({ handleClose, refetch, user }) => {
    const [searcherApproved, setSearcherApproved] = useState(null);

    const [deleteReq, doDelete] = AxioHook(deleteBlacklistedCompanies(), { manual: true })
    const [showEdit, setShowEdit] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fieldsToFilterFor = ['email']

    let BodyApproved = (
        <DataTable
            subHeaderAlign="center"
            columns={
                [
                    {
                        name: 'ID',
                        selector: 'id',
                    },
                    {
                        name: 'Name',
                        selector: 'companyName',
                    },
                    {
                        name: 'Edit',
                        cell: (r) => {
                            return <EditIcon style={{ cursor: 'pointer'}} onClick={() => {
                                setShowEdit(r)
                            }} />
                        },
                    },
                    {
                        name: 'Delete',
                        cell: (r) => {
                            return <DeleteIcon style={{ cursor: 'pointer'}} onClick={() => {
                                doDelete({ data: { id: r.id } })
                                    .then(() => refetch())
                            }} />
                        },
                    },
                ]
            }
            actions={
                <>
                    <Button variant="contained" color="primary" onClick={() => {
                        setShowModal(true);
                    }}>Add company</Button>
                </>
            }
            pagination={true}
            data={user.BlacklistedCompanies}
        />
    );


    return (
        <Modal size="lg" show={true} onHide={() => handleClose('hide')}>
            <Modal.Header closeButton>
                <Modal.Title>Create</Modal.Title>
            </Modal.Header>
            {BodyApproved}
            {showModal && <AddCompanies user={user} handleClose={(reason) => {
                setShowModal(false)
                if (reason == 'edited') refetch();
            }} />}
            {showEdit && <EditCompany company={showEdit} handleClose={(reason) => {
                setShowEdit(false)
                if (reason == 'edited') refetch();
            }} />}
        </Modal>
    );
}


export const CompaniesModal = CreateLocationComponent