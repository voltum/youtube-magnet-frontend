import { ReactText, ReducerAction, ReducerState, useEffect, useReducer, useRef, useState } from "react"
// import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import toast, { Toaster } from 'react-hot-toast';


// Const declarations
const host = window.location.hostname;
const protocol = window.location.protocol;
const SERVER_URL = `${protocol}//${host}:3001`;

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;

    'events:active': (event: any, callback: (event: any) => void) => void
    'events:progress': (event: any, callback: (event: any) => void) => void
    'events:error': (error: any, callback: (error: any) => void) => void
    'events:empty': (event: any, callback: (event: any) => void) => void
}

interface ClientToServerEvents {
}

function getToastText(progress: number){

}

export const useEvents = () => {

    const [status, setStatus] = useState<{ visible: boolean, text?: string, type?: string }>({ visible: false, text: '' });

    const [individualProgress, setIndividualProgress] = useState(0);
    const [remainedCount, setRemainedCount] = useState(null);

    const [logging, setLogging] = useState<Array<string>>([]);

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SERVER_URL, {});

    useEffect(() => {
        
        console.log('Connect');

        toast('Connected!');

        socket.on('events:active', (event: any) => {
            setRemainedCount(event.remainedCount);

            setStatus({ visible: true, text: `Channel is processing... ${event.remainedCount ? 'Remained: ' + event.remainedCount : ''}` });

            // setLogging(prevState => [...prevState, `Channel "${event.id}" is processing...`]);
        });

        socket.on('events:progress', (event) => {
            // setIndividualProgress(event.progress);

            setStatus({ visible: true, text: `Channel is processing (${event.progress}%). ${event.remainedCount ? 'Remained: ' + event.remainedCount : ''}`, type: 'loading' });

            // setLogging(prevState => [...prevState, `Channel "${event.id}" is processing ${event.progress}%...`]);
        })
        
        socket.on('events:empty', () => {
            setStatus({ visible: false, text: `All channels proceeded!`, type: 'success' });

            setStatus({ visible: false });
            // setLogging(prevState => [...prevState, `All channels are ready...`]);
        })

        socket.on('events:error', (error) => {
            console.log('Error!', error);

            toast.error(`Error! ${error}`);

            setStatus({ visible: false });
            // setLogging(prevState => [...prevState, `Error: ${error}...`]);
        })

        return () => {
            console.log('Disconnect')
            socket.disconnect();
        }
    }, []);

    useEffect(() => {
    })


    return { status };
}

