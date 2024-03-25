import React, { useState } from 'react';

function CheckboxGroup({ data }) {
  const [selected, setSelected] = useState(Array(data.length).fill(true));

  const handleCheckboxClick = (index) => {
    const updatedSelected = [...selected];
    updatedSelected[index] = !updatedSelected[index];
    setSelected(updatedSelected);
  };

  return (
    <div>
      {data.map((name, index) => (
        <div key={name}>
          <input
            type="checkbox"
            checked={selected[index]}
            onChange={() => handleCheckboxClick(index)}
          />
          <label>{name}</label>
        </div>
      ))}
    </div>
  );
}

// Example usage
function Checkbox() {
  const dataFromBackend = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];

  return (
    <div className="App">
      <CheckboxGroup data={dataFromBackend} />
    </div>
  );
}

export default Checkbox;
