import axios from 'axios';
import React, { useRef } from 'react'
import Modal from '.'
import { AppConfig } from '../../utils/config';
import Button from '../Button'

interface Props{
    
    close: () => void
}

function NewFolderModal({ close } : Props) {
    const newFolderForm = useRef<HTMLFormElement>(null);
    
    function newFolderFormSubmitted(e: any){
        e.preventDefault();
        const folderName = e.target.elements.folder_name.value;
        axios.post(`${AppConfig.getFoldersURL()}`, { name: folderName })
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }
    
  return (
    <Modal
        onCancel={close}
        header={'Add new folder'}
        footer={<button form='newFolderForm' type='submit'><Button>Create new folder</Button></button>}
    >
        <form ref={newFolderForm} id="newFolderForm" onSubmit={newFolderFormSubmitted}>
            <input name="folder_name" placeholder='Folder name'></input>
        </form>
    </Modal>
  )
}

export default NewFolderModal