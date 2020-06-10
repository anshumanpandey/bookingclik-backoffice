import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core"
import moment from 'moment'
import DataTable from 'react-data-table-component';
import { getBuyedBanner } from "../../crud/banners.crud";
import { BuyBannerModal } from "./BuyBannerModal";
import AxioHook from 'axios-hooks'

export default function Clients() {
    const [showModal, setShowModal] = useState(false);
    const [getReq, refetch] = AxioHook(getBuyedBanner())


    return (
        <>
            <DataTable
                subHeaderAlign="center"
                progressPending={getReq.loading}
                columns={[
                    {
                        name: 'Country',
                        selector: 'country',
                    },
                    {
                        name: 'Location',
                        selector: 'location',
                    },
                    {
                        name: 'Amount',
                        selector: 'amount',
                    },
                    {
                        name: 'Frequency',
                        selector: 'paymentFrequency',
                    },
                    {
                        name: 'User',
                        selector: 'User.firstName',
                    },
                    {
                        name: 'Created At',
                        selector: 'createdAt',
                        cell: (r) => moment(r.createdAt).format('DD-MM-YYYY hh:mm A')
                    },
                ]}
                actions={
                    <>
                        <Button variant="contained" color="primary" onClick={() => {
                            setShowModal(true);
                        }}>Buy Ad Banners</Button>
                    </>
                }
                pagination={true}
                data={getReq.data}
            />
            {showModal && <BuyBannerModal handleClose={() => {
                setShowModal(false)
                refetch();
            }} />}
        </>
    );
}