"use client"
import React, { useEffect } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { pubsub } from '@/app/services/pubsub.service';

interface ToastMessage {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

const InnerToast: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const subscription = pubsub.subscribe('toast', ({ message, severity }: ToastMessage) => {
      enqueueSnackbar(message, { variant: severity });
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [enqueueSnackbar]);

  return null; // This component does not render anything
};

const Toast: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={1} anchorOrigin={{ vertical:'bottom', horizontal: 'right' }}>
      <InnerToast />
    </SnackbarProvider>
  );
};

export default Toast;
