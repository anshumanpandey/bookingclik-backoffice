import React, { useState } from "react";
import { CircularProgress, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AxioHook from 'axios-hooks'
import EditIcon from '@material-ui/icons/Edit';
import DataTable from 'react-data-table-component';
import { Container, Row, Col } from 'react-bootstrap';
import { getUsers, updateUser } from "../../crud/user.crud";
import { CreateUserModal } from "./CreateUserModal";

const TableIconsStyles = {
    cursor: 'pointer'
};

export default function Clients() {
    const [displayModal, setDisplayModal] = useState(false);
    const [loadingToggle, setLoadingToggle] = useState(false);
    const [getClientsReq, refetch] = AxioHook(getUsers())
    const [displayUpdateModal, setDisplayUpdateModal] = useState(false);
    const [displayBranchModal, setDisplayBranchModal] = useState(false);
    const [updateReq, doUpdate] = AxioHook(updateUser(), { manual: true })

    const columns = [
        {
            name: 'Email',
            selector: 'email',
        },
        {
            name: 'First Name',
            selector: 'firstName',
        },
        {
            name: 'Last Name',
            selector: 'lastName',
        },
        {
            name: 'Company Name',
            selector: 'companyName',
        },
        {
            name: 'Address',
            selector: 'address',
        },
        {
            name: 'Edit',
            maxWidth: "3%",
            minWidth: "70px",
            style: TableIconsStyles,
            cell: (r) => <EditIcon onClick={() => setDisplayUpdateModal(r)}></EditIcon>,
        },
        {
            name: 'Disable',
            maxWidth: "3%",
            minWidth: "70px",
            style: TableIconsStyles,
            cell: (client) => {
                const disabldBtnTxt = client.disabled ? "Enable" : "Disable"

                return (
                    <DeleteIcon
                        variant="warning"
                        disbled={updateReq.loading}
                        onClick={() => {
                            setLoadingToggle(client)
                            doUpdate({ data: { id: client.id, disabled: !client.disabled } })
                                .then(() => {
                                    return refetch()
                                })
                                .then(() => setLoadingToggle(false))
                        }}
                    >{loadingToggle.id === client.id ? "Wait..." : disabldBtnTxt}</DeleteIcon>
                )
            }
        },
    ];


    let Body = null

    if (getClientsReq.loading) {
        Body = (<>
            <CircularProgress />
        </>)
    } else if (getClientsReq.data) {
        Body = (
            <Col span={24}>
                <DataTable
                    subHeaderAlign="center"
                    title="Clients"
                    actions={<Button variant="contained" color="primary" onClick={() => setDisplayModal(true)}>Add User</Button>}
                    columns={columns}
                    data={getClientsReq.data}
                />
            </Col>
        );
    } else if (getClientsReq.error) {
        Body = (
            <>
                <h3>Error fetching the resource</h3>
            </>
        );
    }

    return (
        <Container fluid>
            <Row>
                {Body}
            </Row>
            {displayModal && <CreateUserModal refetch={refetch} handleClose={() => setDisplayModal(false)} />}
            {displayUpdateModal && <CreateUserModal client={displayUpdateModal} refetch={refetch} handleClose={() => setDisplayUpdateModal(false)} />}
        </Container>
    );
}
