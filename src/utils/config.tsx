const { YM_SERVER_URL, YM_SERVER_URL_CHANNELS, YM_SERVER_URL_LOGS, YM_SERVER_URL_FOLDERS } = process.env;

export const AppConfig = {
    getServerURL: () => YM_SERVER_URL || "http://localhost:3001/",
    getChannelsURL: () => YM_SERVER_URL_CHANNELS || "http://localhost:3001/channels",
    getLogsURL: () => YM_SERVER_URL_LOGS || "http://localhost:3001/logs",
    getFoldersURL: () => YM_SERVER_URL_FOLDERS || "http://localhost:3001/folders"
}