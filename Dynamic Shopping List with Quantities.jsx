//Dynamic Shopping List with Quantities//
import React, { useState } from 'react';

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const addItem = () => {
    // Validation to prevent empty items or invalid quantities
    if (!itemName || quantity < 1) {
      alert("Please enter a valid item and quantity (greater than 0).");
      return;
    }
    
    setItems([...items, { name: itemName, quantity: quantity }]);
    setItemName('');
    setQuantity('');
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <div>
      <h1>Shopping List</h1>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={addItem}>Add Item</button>
      <button onClick={clearAll}>Clear All</button>
      
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity} 
            <button onClick={() => removeItem(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
