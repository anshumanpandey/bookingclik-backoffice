import React, { useState, useEffect } from "react";
import { getVisitors } from "../../crud/visitor.crud";
import AxioHook from 'axios-hooks'
import moment from 'moment'
import DataTable from 'react-data-table-component';


export default function Clients() {

    const [clientsLocationReq, refetch] = AxioHook(getVisitors())


    return (
        <>
            <DataTable
            progressPending={clientsLocationReq.loading}
            subHeaderAlign="center"
            columns={[
                { name: 'IP', selector: 'ip' },
                { name: 'Country', selector: 'country' },
                { name: 'Pickup Location', selector: 'pickupLocation' },
                {
                    name: 'Pickup Date',
                    cell: (r) => {
                        return moment(r.pickupDate).format(`DD-MM-YYYY`)

                    }
                },
                {
                    name: 'Pickup Time',
                    cell: (r) => {
                        return moment.utc(r.pickupTime, 'hh:mm:ss').format(`hh:mm A`)
                    }
                },
                { name: 'Dropoff Location', selector: 'dropoffLocation' },
                {
                    name: 'Dropoff Date',
                    cell: (r) => {
                        return moment(r.dropoffDate).format(`DD-MM-YYYY`)

                    }
                },
                {
                    name: 'Dropoff Time',
                    cell: (r) => {
                        return moment.utc(r.dropoffTime, 'hh:mm:ss').format(`hh:mm A`)
                    }
                },

            ]}
            pagination={true}

            data={clientsLocationReq.data}
        />
        </>
    );
}