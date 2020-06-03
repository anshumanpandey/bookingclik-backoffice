import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getMyClicks } from "../../crud/my-click-crud";
import FuzzySearch from 'fuzzy-search';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AddCreditsModal } from "./AddCreditsModal";

export default function Clients() {
    const [searcherApproved, setSearcherApproved] = useState(null);

    const [dataToApprovedDisplay, setDataApprovedDisplay] = useState([]);
    const [displayModal, setDisplayModal] = useState(false);

    const [clientsLocationReq, refetch] = AxioHook(getMyClicks())

    const fieldsToFilterFor = ['country']
    useEffect(() => {
        if (clientsLocationReq.data) {

            setDataApprovedDisplay(clientsLocationReq.data)
            if (!searcherApproved) setSearcherApproved(new FuzzySearch(clientsLocationReq.data, fieldsToFilterFor, {}))
        }
    }, [clientsLocationReq]);

    const columns = [
        {
            name: 'IP',
            selector: 'ip',
        },
        {
            name: 'Country',
            selector: 'country',
        },
        {
            name: 'Date',
            selector: 'created_at'
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
                    <Button variant="contained" color="primary" onClick={() => {
                        setDisplayModal(true);
                    }}>Add founds</Button>
                    <Button variant="contained" color="primary" onClick={() => {
                        var wb = XLSX.utils.book_new();
                        wb.Props = {
                            Title: "SheetJS Tutorial",
                            Subject: "Test",
                            Author: "Red Stapler",
                            CreatedDate: new Date(2017, 12, 19)
                        };
                        wb.SheetNames.push("Test Sheet");
                        var ws_data = [['hello', 'world']];
                        var ws = XLSX.utils.aoa_to_sheet(ws_data);
                        wb.Sheets["Test Sheet"] = ws;
                        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

                        function s2ab(s) {
                            var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                            var view = new Uint8Array(buf);  //create uint8array as viewer
                            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                            return buf;
                        }
                        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'test.xlsx');
                    }}>Export</Button>
                    <Input type="text" onChange={(e) => {
                        if (searcherApproved) setDataApprovedDisplay(searcherApproved.search(e.target.value))
                    }} />
                </>
            }
            data={dataToApprovedDisplay}
        />
    );


    if (clientsLocationReq.error) {
        BodyApproved = (<h3>Error fetching the resource</h3>);
    }



    return (
        <>
            {BodyApproved}
            {displayModal && <AddCreditsModal refetch={refetch} handleClose={() => setDisplayModal(false)} />}
        </>
    );
}