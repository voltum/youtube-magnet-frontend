const { REACT_APP_YM_SERVER_URL, REACT_APP_YM_SERVER_URL_CHANNELS, REACT_APP_YM_SERVER_URL_LOGS, REACT_APP_YM_SERVER_URL_FOLDERS } = process.env;

// console.log("Config", [REACT_APP_YM_SERVER_URL, REACT_APP_YM_SERVER_URL_CHANNELS, REACT_APP_YM_SERVER_URL_LOGS, REACT_APP_YM_SERVER_URL_FOLDERS])

export const AppConfig = {
    getServerURL: () => REACT_APP_YM_SERVER_URL || "http://localhost:3001/",
    getChannelsURL: () => REACT_APP_YM_SERVER_URL_CHANNELS || "http://localhost:3001/channels",
    getLogsURL: () => REACT_APP_YM_SERVER_URL_LOGS || "http://localhost:3001/log",
    getFoldersURL: () => REACT_APP_YM_SERVER_URL_FOLDERS || "http://localhost:3001/folders"
}