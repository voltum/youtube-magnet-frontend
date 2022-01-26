import { ReactText, ReducerAction, ReducerState, useEffect, useReducer, useRef, useState } from "react"
// import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import toast, { Toaster } from 'react-hot-toast';


const SERVER_URL = 'http://localhost:3001'

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

    const [visible, setVisible] = useState(false);
    const [statusText, setStatusText] = useState('sss');

    const [individualProgress, setIndividualProgress] = useState(0);
    const [count, setCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [logging, setLogging] = useState<Array<string>>([]);

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SERVER_URL, {});

    useEffect(() => {
        
        console.log('Connect');

        toast('Connected!');

        socket.on('events:active', (event: any) => {            
            toast.loading('Channel is processing...', { id: 'mainToast' });

            setCount(count + 1);
            if(!totalCount) setTotalCount(event.remain);

            setLogging(prevState => [...prevState, `Channel "${event.id}" is processing...`]);
        });

        socket.on('events:progress', (event) => {
            setIndividualProgress(event.progress);
            toast.loading(`Channel is processing... ${event.progress}%`, { id: 'mainToast' });
            setLogging(prevState => [...prevState, `Channel "${event.id}" is processing ${event.progress}%...`]);
        })
        
        socket.on('events:empty', () => {

            toast.success('All channels proceeded!', { id: 'mainToast' });
            setLogging(prevState => [...prevState, `All channels are ready...`]);
        })

        socket.on('events:error', (error) => {
            console.log('Error!', error);
            
            toast.error('Error: ' + error)
            setLogging(prevState => [...prevState, `Error: ${error}...`]);
        })

        return () => {
            console.log('Disconnect')
            socket.disconnect();
        }
    }, []);

    useEffect(() => {
    })


    return { logging, individualProgress, count, totalCount };
}

