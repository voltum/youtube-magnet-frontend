import React, { useEffect, useRef, useState } from 'react'
import DropdownCascade from 'react-dropdown-cascade';
import './styles/index.scss'

interface Props {
	options: Object[] | undefined,
	onChange: (value: string) => void
	value?: string
	separatorIcon?: string | undefined
}

function CustomCascader({ options, value, onChange, separatorIcon }: Props) {
	const [dropdownValue, setDropdownValue] = useState<string>('');

	return (
		<>
			<div className='cascader_container'>
				<DropdownCascade
					customStyles={{
						dropdown: {
							style: {
								marginBottom: '10px'
							}
						},
						dropdownMenu: {
							style: {
								backgroundColor: '#334155',
								color: 'white',
								border: '2px solid #5e6e83',
							}
						},
						dropdownMenuItem: {
							style: {

							}
						}
					}}
					items={options}
					onSelect={(value, selectedItems) => {
						setDropdownValue(value);
						onChange(value);
					}}
					value={dropdownValue || value || 'Nothing to display'}
					separatorIcon={separatorIcon || ' ➜ '}
				/>
			</div>
		</>
	)
}

export default React.memo(CustomCascader)