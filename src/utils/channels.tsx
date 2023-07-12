import axios, { AxiosResponse } from "axios"
import { AppConfig } from "./config";

// Const declarations
const host = window.location.hostname;
const protocol = window.location.protocol;

export interface Folder {
    _id: string,
    name: string,
    type: string,
    parent: string,
    category: string
}

export type FolderType = {
    name: string;
    chunkStamp: number,
    note?: string
    blocked?: boolean
}

export interface Channel {
    _id: string
    folders: Array<FolderType>
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
    blocked: boolean
    globalNote: string
    lastVideoPublishedAt: Date
    publishedAt: Date
    createdAt: Date
    updatedAt: Date
}

export const getFoldersList = (): Promise<AxiosResponse<Folder[], any>> => {
    return axios.get<Folder[]>(`${AppConfig.getFoldersURL()}`);
}
export const getChannelsList = (folder?: string, blacklist?: boolean, filter?: object): Promise<AxiosResponse<Channel[], any>> => {
    return axios.get<Channel[]>(`${AppConfig.getChannelsURL()}`, { params: { folder, blacklist, filter } });
}
export const updateChannel = (id: string, query: object, options?: object) => {
    return axios.put<Channel>(`${AppConfig.getChannelsURL()}`, { update: query, options }, { params: { id } });
}
export const changeChannelFolder = (id: string | undefined, from: string, to: string | undefined) => {
    if (id && to)
        return axios.put<Channel>(`${AppConfig.getChannelsURL()}`, { update: { "folders.$[element].name": to }, options: { arrayFilters: [{ "element.name": from }] } }, { params: { id } })
}
export const blockChannel = (id: string, folder: string, target?: boolean) => {
    return axios.put<Channel>(`${AppConfig.getChannelsURL()}`, { update: { "folders.$[element].blocked": target }, options: { arrayFilters: [{ "element.name": folder }] } }, { params: { id } });
}
export const remakeFolder = (id: string) => {
    return axios.post<Channel>(`${AppConfig.getFoldersURL()}/remake/${id}`);
}