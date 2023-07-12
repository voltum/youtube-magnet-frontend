import { AdjustmentsIcon, InformationCircleIcon, PauseIcon, PlayIcon, StopIcon, TrashIcon } from '@heroicons/react/outline';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { socket } from '../../modules/modals/services/Socket';

function MiniDrawer() {
  const [opened, setOpened] = useState(false);

  function openHandler() {
    setOpened(!opened);
  }

  function emitEvent(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: "queue:info" | "queue:resume" | "queue:pause" | "queue:empty") {
    if (name === "queue:empty") {
      let confirmed = window.confirm("Are you sure?");
      if (confirmed) socket.emit(name, (response: any) => {
        toast(JSON.stringify(response));
      });
    } else {
      socket.emit(name, (response: any) => {
        toast(JSON.stringify(response));
      });
    }
    const btn = e.currentTarget;
    btn.disabled = true;
    setTimeout(() => {
      btn.disabled = false;
    }, 2000);
  }

  return (
    <div className={`fixed w-52 ${opened ? 'right-0' : '-right-52'} bottom-20 z-50 bg-slate-600 px-2 py-2 h-12 transition-all shadow-xl`}>
      <div className='absolute bg-slate-500 w-8 h-12 -left-8 top-0 cursor-pointer flex items-center' onClick={openHandler}>
        <AdjustmentsIcon className='w-6 h-6 m-auto' />
      </div>
      <div className='h-full flex justify-evenly gap-2'>
        <button className='minidrawer-button' onClick={(e) => emitEvent(e, "queue:resume")}><PlayIcon className='w-6 h-6' /></button>
        <button className='minidrawer-button' onClick={(e) => emitEvent(e, "queue:pause")}><PauseIcon className='w-6 h-6' /></button>
        <button className='minidrawer-button' onClick={(e) => emitEvent(e, "queue:info")}><InformationCircleIcon className='w-6 h-6' /></button>
        <button className='minidrawer-button' onClick={(e) => emitEvent(e, "queue:empty")}><TrashIcon className='w-6 h-5' /></button>
      </div>
    </div>
  )
}

export default MiniDrawer