import { MenuItem, SubMenu } from '@szhsin/react-menu'
import React, { HTMLAttributes } from 'react'
import { ContextMenuItemProps } from '.'

function ContextMenuItem({ name, children, category, onItemClick }: ContextMenuItemProps<HTMLUListElement>): JSX.Element {
    const hasChildren = children && children.length

    return (
        !hasChildren ?
            <MenuItem onClick={(e) => onItemClick && onItemClick(category)}>
                {name}
            </MenuItem>
            :
            <SubMenu label={name} className={'context-sublist'}>
                {hasChildren && children.map((child: any) => (
                    <ContextMenuItem key={child.name} {...child} onItemClick={onItemClick} />
                ))}
            </SubMenu>
    )
}

export default ContextMenuItem