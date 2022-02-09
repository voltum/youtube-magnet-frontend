import React, { useEffect } from 'react';
import toast, { ToastBar, Toaster, useToaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import { useEvents } from '../../hooks/useEvents';

const CustomToaster = () => {

  return <Toaster
    toastOptions={{
      success: {
        style: {
          border: '1px solid #0c8653',
        }
      },
      style: {
        border: '1px solid #432a62',
        backgroundColor: '#131923',
        padding: '16px',
        color: 'white',
      },
      position: 'top-right'
    }}
  >
    {(t) => (
      <ToastBar toast={t}>
        {({ icon, message }) => (
          <>
            {icon}
            {message}
            {t.type !== 'loading' && (
              <button onClick={() => toast.dismiss(t.id)}>X</button>
            )}
          </>
        )}
      </ToastBar>
    )}
  </Toaster>
};

export default CustomToaster;

export const CustomToasterComponent = () => {
  const { status } = useEvents();

  useEffect(() => {
    if(status.text)
      toast(status.text || '', { id: "mainToast", duration: status.visible ? Infinity : 0 });
    else 
      toast.dismiss("mainToast");

    if(status.type === 'success') toast.success(status.text || '', { duration: Infinity });

  }, [status]);

  return <></>;
}