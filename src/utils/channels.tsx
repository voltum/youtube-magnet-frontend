import axios, { AxiosResponse } from "axios"

// Const declarations
const host = window.location.hostname;
const protocol = window.location.protocol;

interface Folder{
    _id: string,
    name: string,
    type: string
}

interface Channel{
    id: string
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
}

export const getFoldersList = () : Promise<AxiosResponse<Folder[], any>> => {
    return axios.get<Folder[]>(`${protocol}//${host}:3001/folders`, { timeout: 5000 });
}
export const getChannelsList = (folder: string) : Promise<AxiosResponse<Channel[], any>> => {
    return axios.get<Channel[]>(`${protocol}//${host}:3001/channels`, { params: { folder }, timeout: 5000 });
}