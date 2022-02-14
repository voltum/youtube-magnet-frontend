import React from 'react'
import { Column } from 'react-table';
import Modal from '.';
import Button from '../Button';
import Table from '../Table';

interface Props{
    data: {
        rows: any[],
        columns: Column<{}>[]
    }
    close: () => void
}

function ManageModal({ data, close } : Props) {
  return (
      <Modal 
        onCancel={close}
        header={'Manage folders'}
        footer={()=><div onClick={()=> { close() }}><Button>Add new collection</Button></div>}
      >
        <Table data={data.rows} columns={data.columns} />
      </Modal>
  )
}

export default ManageModal