import { io, Socket } from "socket.io-client";
import { AppConfig } from "../../../utils/config";


interface ServerToClientEvents {
    'events:active': (event: any, callback: (event: any) => void) => void
    'events:progress': (event: any, callback: (event: any) => void) => void
    'events:error': (error: any, callback: (error: any) => void) => void
    'events:empty': (event: any, callback: (event: any) => void) => void
}

interface ClientToServerEvents {
    'queue:info': (callback: (response: any) => void) => void
    'queue:pause': (callback: (response: any) => void) => void
    'queue:resume': (callback: (response: any) => void) => void
    'queue:empty': (callback: (response: any) => void) => void
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(AppConfig.getServerURL(), {});