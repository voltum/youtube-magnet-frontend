import { useMenuState } from '@szhsin/react-menu';
import axios from 'axios';
import React, { FocusEvent, useRef, useState } from 'react'
import Modal from '.'
import { AppConfig } from '../../utils/config';
import Button from '../Button'
import Cascader from '../Cascader';
import { SelectorMenu } from '../ContextMenu';

interface Props {
    data?: {
        folders?: object[]
    }
    close: () => void
}

function NewFolderModal({ close, data }: Props) {
    const newFolderForm = useRef<HTMLFormElement>(null);
    const parentSelector = useRef<HTMLInputElement>(null);
    const [parentFolder, setParentFolder] = useState('/');

    const [menuProps, toggleMenu] = useMenuState();
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

    function newFolderFormSubmitted(e: any) {
        e.preventDefault();
        const folderName: string = e.target.elements.folder_name.value;
        const parentCategory: string = e.target.elements.parent_category.value;
        axios.post(`${AppConfig.getFoldersURL()}`,
            {
                name: folderName,
                parent: parentCategory,
                category: `${parentCategory}/${folderName.toLowerCase()}`
            })
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
        console.log(folderName, parentCategory)
    }

    return (
        <>
            <Modal
                onCancel={close}
                header={'Add new folder'}
                footer={<button form='newFolderForm' type='submit'><Button>Create new folder</Button></button>}
            >
                <form ref={newFolderForm} id="newFolderForm" onSubmit={newFolderFormSubmitted} className={'flex h-8 gap-2'}>
                    <input name="folder_name" type={'text'} placeholder='Folder name' autoComplete='fldrnm'></input>
                    {/* <Cascader options={data?.folders} onChange={(val) => setParentFolder(val)} value={'Select parent'} separatorIcon={'/'} /> */}
                    <input ref={parentSelector} name="parent_category" type={'text'} autoComplete='prntslctr' placeholder='Parent category' value={parentFolder} />
                    <SelectorMenu items={data?.folders} onItemClick={(category) => setParentFolder(category || '')} menuProps={menuProps} toggleMenu={toggleMenu} anchorPoint={anchorPoint} />
                </form>
            </Modal>
        </>
    )
}

export default NewFolderModal