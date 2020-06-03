import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Notification({ msg, propOpen, severity, onClose }) {
    const [open, setOpen] = React.useState(propOpen ?? true);
  
    return (
        <Snackbar open={open} style={{ minWidth: '26rem', position: 'absolute', zIndex: 9999 }} autoHideDuration={6000} onClose={() => {setOpen(false); onClose && onClose()}}>
          <Alert style={{ position: 'absolute', zIndex: 9999 }} onClose={() => {setOpen(false); onClose && onClose()}} severity={severity || "success"}>
            {msg}
          </Alert>
        </Snackbar>
    );
  }