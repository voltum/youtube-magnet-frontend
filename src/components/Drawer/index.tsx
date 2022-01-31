import React, { ReactChildren, ReactFragment, ReactNode } from 'react';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { JsxChild, JsxElement, JsxExpression, JsxFragment } from 'typescript';
import Button from '../Button';

interface Props{
    isOpen: boolean,
    onClose: () => void,
    direction: 'left' | 'right' | 'top' | 'bottom',
    className?: string,
    children?: ReactFragment,
    title?: string,
    width?: number
    footer?: () => void
}

function ModernDrawer(props: Props) {
  return <>
      <Drawer 
        open={props.isOpen}
        onClose={props.onClose}
        direction={props.direction}
        className={props.className}
        style={{ backgroundColor: '#1b1e25', width: props.width || 300 }}
      >
          <div className='h-screen overflow-y-auto p-0 pb-28'>
            <div className='relative p-1'>
                {props.title && <div className='text-lg uppercase border-b-2 border-slate-600 mb-4'>{props.title}</div>}
                {props.children}
            </div>
            <div className='absolute w-full flex justify-end gap-2 bg-gray-900 border-t-2 border-slate-600 bottom-0 right-0 px-4 py-4'>
                <div onClick={props.onClose}><Button>Close</Button></div>
                {props.footer && props.footer()}
            </div>
          </div>

      </Drawer>
  </>;
}

export default ModernDrawer;
