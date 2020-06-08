import React, { useState, useEffect } from "react";
import { Input, Button } from '@material-ui/core';
import AxioHook from 'axios-hooks'
import DataTable from 'react-data-table-component';
import { getPayments } from "../../crud/pay.crud";
import FuzzySearch from 'fuzzy-search';

export default function Clients() {

    return (
        <>
            <h3 style={{ textAlign: 'center', fontSize: '1.65rem'}}>
                To purchase banner advertising on our website email us to admin@bookingclik.com
            </h3>
        </>
    );
}