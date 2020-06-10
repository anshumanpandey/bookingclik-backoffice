import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core"
import moment from 'moment'
import DataTable from 'react-data-table-component';
import { getBuyedBanner } from "../../crud/banners.crud";
import { BuyBannerModal } from "./BuyBannerModal";
import AxioHook from 'axios-hooks'
import countries from "../../widgets/countryDropdown/countries.json"

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
                        selector: 'BannerMeta.country',
                        cell: (r) => countries.find(i => i.code.toLocaleLowerCase() == r.BannerMetum.country.toLocaleLowerCase())?.name
                    },
                    {
                        name: 'Location',
                        selector: 'BannerMetum.locationName',
                    },
                    {
                        name: 'From',
                        cell: (r) => moment(r.availableFromDate).format('DD-MM-YYYY hh:mm A')

                    },
                    {
                        name: 'To',
                        cell: (r) => moment(r.availableToDate).format('DD-MM-YYYY hh:mm A')
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