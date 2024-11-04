import React, { useState } from 'react';
import axios from 'axios';

const VehicleForm = () => {
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', category);
    formData.append('type', type);
    formData.append('make', make);
    formData.append('model', model);
    formData.append('color', color);
    formData.append('vehicleNo', vehicleNo);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post(http://localhost:5000/add-vehicle?id=${userId}, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      // Optionally, reset the form
      resetForm();
    } catch (error) {
      if (error.response) {
        alert(Error: ${error.response.data.message});
      } else {
        alert('Error adding vehicle');
      }
    }
  };

  const resetForm = () => {
    setCategory('');
    setType('');
    setMake('');
    setModel('');
    setColor('');
    setVehicleNo('');
    setImage(null);
  };

  return (
    <div>
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default VehicleForm;