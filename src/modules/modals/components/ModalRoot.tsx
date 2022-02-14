import { XIcon } from '@heroicons/react/outline';
import { useState, useEffect, ReactNode, Component, ComponentType, useRef } from 'react';
import Button from '../../../components/Button';
import ModalService from '../services/ModalService';

export default function ModalRoot() {
    const container = useRef<HTMLDivElement>(null);
    const [modal, setModal] = useState<any>({});

    const ModalComponent = modal.component ? modal.component : null;

    useEffect(() => {
        if(ModalComponent)
        {
            document.body.style.overflow = 'hidden';
            // document.body.style.paddingRight = '15px';
        }

        if(container.current) container.current.onclick = (e) => {
            if(container.current === e.target){
                setModal({});
            }
        };

        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [ModalComponent])

    useEffect(() => {
        ModalService.on('open', ({ component, props }) => {
            setModal({
                component,
                props,
                close: (value: any) => {
                    setModal({});
                    console.log('Close')
                },
            });
        });
    }, []);


    return (
        <section>
            { ModalComponent && (
                <ModalComponent 
                    {...modal.props}
                    close={modal.close}
                    className={`${ModalComponent?'visible':'invisible'} fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm z-50 before:fixed before:top-0 before:right-0 before:bottom-0 before:left-0 before:bg-black before:opacity-50`}
                >
                    
                </ModalComponent>
            )}
        </section>
    );
}