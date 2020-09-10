import React, { useState, useEffect } from "react";
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getTopLocations, deleteTopLocation } from "../../crud/toplocations.crud";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import { CreateLocationModal } from "./CreateLocationModal";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { DeleteLocation } from "./DeleteLocation";

function Clients({ user }) {
    const [displayModal, setDisplayModal] = useState(false);
    const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState(false);

    const [clientsLocationReq, refetch] = AxioHook(getTopLocations())

    const isLoading = () => clientsLocationReq.loading

    let BodyApproved = (
        <DataTable
            data={clientsLocationReq?.data}
            progressPending={isLoading()}
            subHeader={false}
            pagination={true}
            actions={
                <>
                    <Button onClick={() => setDisplayModal(true)} color="primary">
                        New
                    </Button >
                </>
            }
            columns={[
                {
                    name: 'Name',
                    selector: 'name',
                },
                {
                    name: 'Image',
                    cell: (row) => <img style={{ width: 50, height: 50 }} src={row.imagePath} />,
                },
                {
                    name: 'Edit',
                    cell: (row) => <EditIcon style={{ cursor: "pointer" }} onClick={() => {
                        setDisplayEditModal(row)
                    }} />,
                },
                {
                    name: 'Delete',
                    cell: (row) => <DeleteIcon style={{ cursor: "pointer" }} onClick={() => {
                        setDisplayDeleteModal(row)
                    }} />,
                },
            ]}
        />
    );


    if (clientsLocationReq.error) {
        BodyApproved = (<h3>Error fetching the resource</h3>);
    }



    return (
        <>
            {BodyApproved}
            {displayModal && <CreateLocationModal refetch={refetch} handleClose={(reason) => {
                setDisplayModal(false)
                refetch();
            }} />}
            {displayEditModal && <CreateLocationModal location={displayEditModal} refetch={refetch} handleClose={(reason) => {
                setDisplayEditModal(false)
                refetch();
            }} />}
            {displayDeleteModal && <DeleteLocation location={displayDeleteModal} refetch={refetch} handleClose={(reason) => {
                setDisplayDeleteModal(false)
                if (reason == 'DELETE') refetch();
            }} />}
        </>
    );
}


const mapStateToProps = ({ auth: { user }, builder }) => ({
    user,
});

export default connect(mapStateToProps)(Clients);