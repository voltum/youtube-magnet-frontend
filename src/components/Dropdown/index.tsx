import React from 'react';

const options: any = {

}

function Dropdown() {
  return <div>
        <button onClick={()=>(console.log('click'))} className="">Dropdown</button>
        <div id="myDropdown" className="dropdown-content">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
        </div>
  </div>;
}

export default Dropdown;
