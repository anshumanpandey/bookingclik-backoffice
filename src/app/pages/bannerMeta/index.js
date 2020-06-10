import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core"
import DataTable from 'react-data-table-component';
import { getBannersOnDb } from "../../crud/banners-meta.crud";
import { EditBannerMetadataModal } from "./EditBannerMetadata";
import AxioHook from 'axios-hooks'
import EditIcon from '@material-ui/icons/Edit';


export default function Clients() {
    const [showModal, setShowModal] = useState(false);
    const [getReq, refetch] = AxioHook(getBannersOnDb())


    return (
        <>
            <DataTable
                subHeaderAlign="center"
                progressPending={getReq.loading}
                columns={[
                    {
                        name: 'Location',
                        selector: 'locationName',
                    },
                    {
                        name: 'Available Banners',
                        selector: 'availableAmount',
                    },
                    {
                        name: 'Price',
                        cell: (r) => `${r.price}£/day`
                    },
                    {
                        name: 'Edit',
                        cell: (r) => <EditIcon onClick={() => setShowModal(r)} />,
                    },
                ]}
                pagination={true}
                data={getReq.data}
            />
            {showModal && <EditBannerMetadataModal bannerMetadata={showModal} handleClose={(reson) => {
                setShowModal(false)
                if (reson == "SAVED") refetch();
            }} />}
        </>
    );
}