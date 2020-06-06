import React, { useState, useEffect } from "react";
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getMyClicks } from "../../crud/my-click-crud";
import FuzzySearch from 'fuzzy-search';

import {ClickModal} from "./ClickModal";

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

export default function Clients() {
    const [searcherApproved, setSearcherApproved] = useState(null);

    const [dataToApprovedDisplay, setDataApprovedDisplay] = useState([]);
    const [displayModal, setDisplayModal] = useState(false);

    const [clientsLocationReq, refetch] = AxioHook(getMyClicks())

    const fieldsToFilterFor = ['country', 'ip']
    useEffect(() => {
        if (clientsLocationReq.data) {

            setDataApprovedDisplay(clientsLocationReq.data)
            if (!searcherApproved) setSearcherApproved(new FuzzySearch(clientsLocationReq.data, fieldsToFilterFor, {}))
        }
    }, [clientsLocationReq]);


    const agrouped = groupBy(dataToApprovedDisplay, i => i.supplierName)
    const data = Array.from(agrouped.entries())
        .reduce((array, next) => {
            array.push({
                supplierName: next[0],
                clicks: next[1]
            });
            return array
        }, [])


    let BodyApproved = (
        <DataTable
            data={data}
            subHeader={true}
            onRowClicked={(r) => setDisplayModal(r.clicks)}
            subHeaderAlign="left"
            columns={[
                {
                    name: 'Supplier',
                    selector: 'supplierName'
                },
                {
                    name: 'Total',
                    selector: 'clicks.length'
                }
            ]}
            pagination={true}
        />
    );


    if (clientsLocationReq.error) {
        BodyApproved = (<h3>Error fetching the resource</h3>);
    }



    return (
        <>
            {BodyApproved}
            {displayModal && <ClickModal clicks={displayModal} handleClose={() => setDisplayModal(false)} />}
        </>
    );
}