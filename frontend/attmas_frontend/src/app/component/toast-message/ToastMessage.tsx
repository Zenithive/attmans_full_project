import { Alert, AlertColor, AlertTitle, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

/* eslint-disable-next-line */
export interface ToastMessageProps {
  message?: string;
  openFlag: boolean;
  severity: AlertColor;
  title?: string;
}

export function ToastMessage(props: ToastMessageProps) {
  const [toggleOpen, setToggleOpen] = useState(false);

  useEffect(()=>{
    setToggleOpen(props.openFlag);
  }, [props.openFlag]);


  return (
    <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={ toggleOpen } autoHideDuration={3000} onClose={()=>{setToggleOpen(false)}}>
      <Alert severity={props.severity} sx={{ width: '100%' }}>
        {props.title ? <AlertTitle>{props.title || ""}</AlertTitle> : ""}
        {props.message || "Hello World"}
      </Alert>
    </Snackbar>
  );
}

export default ToastMessage;
