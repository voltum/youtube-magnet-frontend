import React, { useEffect } from 'react'
import { Column } from 'react-table';
import Modal from '.';
import Button from '../Button';
import ExpandableTable from '../Table/ExpandableTable';

interface Props {
  data: {
    rows: any[],
    columns: Column<{}>[]
  }
  close: () => void
}

function ManageModal({ data, close }: Props) {
  return (
    <Modal
      onCancel={close}
      header={'Manage folders'}
      footer={() => <div onClick={() => { close() }}><Button>Add new collection</Button></div>}
    >
      <div className='' style={{ maxHeight: '50vh', overflowY: "scroll" }} >
        <ExpandableTable data={data.rows} columns={data.columns} />
      </div>
    </Modal>
  )
}

export default ManageModal