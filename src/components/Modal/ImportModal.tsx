import axios from 'axios';
import React, { useRef } from 'react'
import { TabPanel, useTabs } from 'react-headless-tabs'
import toast from 'react-hot-toast';
import Modal from '.'
import { AppConfig } from '../../utils/config';
import Button from '../Button';
import { TabSelector } from '../Tabs'

interface Props{
    currentCollection: string
    chunks: number[]
    close: () => void
}

function ImportModal({ currentCollection, chunks, close } : Props) {
    const importFileForm = useRef<HTMLFormElement>(null);
    const importSingleForm = useRef<HTMLFormElement>(null);
    
    // Tabs
    const [ activeTab, setActiveTab ] = useTabs(['file', 'single'], 'file');

    function importFormSubmitted(e: any){
        e.preventDefault();
        const importFormData = new FormData(e.target);
        const file: any = importFormData.get('file');

        const shouldUpdate: boolean = importFormData.get('should_update') ? true : false;
        
        if(!file.name){
            toast.error("Please, select a file!"); 
            return;
        }

        axios.post(`${AppConfig.getChannelsURL()}/upload`, importFormData, { params: { folder: currentCollection, shouldUpdate }})
            .then(response => {
                close();
            }).catch(error => {
                toast.error('Error while making request!');
            }).finally(() => {
                const fileInput = importFileForm.current?.file;
                if(fileInput) fileInput.value = "";
            })
    }

    function importSingleFormSubmitted(e: any){
        e.preventDefault();
        const importSingleData = new FormData(e.target);
        const url: any = importSingleData.get('url');

        if(!url) { 
            toast.error("Please, enter channel's URL");
            return;
        }
        try{
            const urlObj = new URL(url);
        } catch {
            toast.error("Please, enter valid URL");
            return;
        }

        axios.post(`${AppConfig.getChannelsURL()}`, { url, folder: currentCollection, chunkStamp: chunks[0] })
            .then(response => {
                close();
            }).catch(error => {
                toast.error('Error while making request!');
            }).finally(() => {
                const urlInput = importSingleForm.current?.url;
                if(urlInput) urlInput.value = "";
            })
    }

  return (
    <Modal 
        onCancel={close}
        header={'Import channels'}
        footer={<button form={activeTab === 'file' ? 'importChannelsForm' : 'importSingleChannelForm'} type='submit'><Button>Import</Button></button>}
    >
        {/* Tabs navigation */}
        <nav className='flex'>
            <TabSelector isActive={activeTab === 'file'} onClick={() => setActiveTab('file')} >File</TabSelector>
            <TabSelector isActive={activeTab === 'single'} onClick={() => setActiveTab('single')} >Single</TabSelector>
        </nav>
        
        {/* Tabs panels */}
        <TabPanel hidden={activeTab !== "file"}>
            <form ref={importFileForm} id="importChannelsForm" onSubmit={importFormSubmitted}>
                <input type="file" name="file" placeholder='Select scv file'></input>
                <div className='my-3'>
                    <input type="checkbox" id="should_update" name="should_update" value={1} className='w-auto mr-2'/>
                    <label htmlFor="should_update" className='inline'>Should update</label>
                </div>
            </form>
        </TabPanel>

        <TabPanel hidden={activeTab !== "single"}>
            <form ref={importSingleForm} id="importSingleChannelForm" onSubmit={importSingleFormSubmitted}>
                <input type={'text'} name={'url'} placeholder='Input channel url'></input>
            </form>
        </TabPanel>
    </Modal>
  )
}

export default ImportModal