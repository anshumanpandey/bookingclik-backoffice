import React, { useState, useEffect } from "react";
import AxioHook from 'axios-hooks'
import { editAbout, getAbout } from "../../crud/about.crud";
import { connect } from "react-redux";
import { TextField, Button } from "@material-ui/core";

function Clients({ user }) {
    const [about, setAbout] = useState("")
    const [getAboutReq, refetch] = AxioHook(getAbout())
    const [editAboutReq, doEdit] = AxioHook(editAbout(), { manual: true })

    useEffect(() => {
        if (getAboutReq.data) {
            setAbout(getAboutReq.data.body)
        }
    }, [getAboutReq.loading])

    let BodyApproved = (
        <>
            <TextField onChange={(e) => setAbout(e.target.value)} disabled={editAboutReq.loading} fullWidth={true} multiline={true} rows={4} value={about} id="standard-basic" label="Standard" />
            <Button disabled={editAboutReq.loading} onClick={() => doEdit({ data: {body: about}})}>Save</Button>
        </>
    );


    if (getAboutReq.error) {
        BodyApproved = (<h3>Error fetching the resource</h3>);
    }
    if (getAboutReq.loading) {
        BodyApproved = (<h3>Loading...</h3>);
    }

    return (
        <>
            {BodyApproved}
        </>
    );
}


const mapStateToProps = ({ auth: { user }, builder }) => ({
    user,
});

export default connect(mapStateToProps)(Clients);