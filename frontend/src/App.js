import React, { useState } from 'react';
import axios from 'axios'

function App() {
  const [applicationName, setApplicationName] = useState('');
  const [powerConsumptionData, setPowerConsumptionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!applicationName) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:2000/power-consumption', {
        applicationName
      })
      const data = response.data;
      setPowerConsumptionData(data);
    } catch (error) {
      console.error('Error fetching power consumption data:', error);
    }

    setLoading(false);
  };

  return (
    <div className='containerBox'>
      <h2 className='headerText'>Power Consumption Data</h2>
      <form className='formStyle' onSubmit={handleSubmit}>
        <input
        className='inputStyle'
          type="text"
          value={applicationName}
          autoFocus
          onChange={(e) => setApplicationName(e.target.value)}
          placeholder="Enter application name"
        />
        <button
        className='buttonStyle'
        type="submit">Get Power Consumption</button>
      </form>
      {loading && <div>Loading...</div>}
      {powerConsumptionData && (
        <div>
          <h3>Power Consumption Data</h3>
          <pre>{JSON.stringify(powerConsumptionData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
