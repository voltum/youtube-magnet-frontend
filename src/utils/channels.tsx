import axios, { AxiosResponse } from "axios"
import { AppConfig } from "./config";

// Const declarations
const host = window.location.hostname;
const protocol = window.location.protocol;

interface Folder{
    _id: string,
    name: string,
    type: string
}

export interface Channel{
    id: string
    folder: string
    title: string
    url: string
    description: string
    email: string
    country: string
    language: string 
    socialLinks: string
    viewCount: number
    videoCount: number
    subscriberCount: number
    lastVideoPublishedAt: Date
    publishedAt: Date
    createdAt: Date
    updatedAt: Date
}

export const getFoldersList = () : Promise<AxiosResponse<Folder[], any>> => {
    return axios.get<Folder[]>(`${AppConfig.getFoldersURL()}`);
}
export const getChannelsList = (folder: string) : Promise<AxiosResponse<Channel[], any>> => {
    return axios.get<Channel[]>(`${AppConfig.getChannelsURL()}`, { params: { folder } });
}