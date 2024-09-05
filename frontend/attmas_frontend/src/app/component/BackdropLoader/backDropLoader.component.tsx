import React, { useEffect } from 'react';
import {
    CircularProgress,
    Backdrop,
} from '@mui/material';
import { pubsub } from '@/app/services/pubsub.service';
import { PUB_SUB_ACTIONS } from '@/app/constants/pubsub.constant';

const BackDropLoader = () => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        pubsub.subscribe(PUB_SUB_ACTIONS.backDropOpen, handleOpen);
        return () => {
            pubsub.unsubscribe(PUB_SUB_ACTIONS.backDropOpen, handleOpen);
        };
    }, [handleOpen]);

    useEffect(() => {
        pubsub.subscribe(PUB_SUB_ACTIONS.backDropClose, handleClose);
        return () => {
            pubsub.unsubscribe(PUB_SUB_ACTIONS.backDropClose, handleClose);
        };
    }, [handleClose]);


    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={open}
            onClick={handleClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default BackDropLoader;
