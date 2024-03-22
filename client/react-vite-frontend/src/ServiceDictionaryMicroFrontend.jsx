// ServiceDictionaryMicroFrontend.js
import React, { useEffect, useState } from 'react';

function ServiceDictionaryMicroFrontend() {
  const [services, setServices] = useState(null);

  useEffect(() => {
    async function fetchServiceDictionary() {
      try {
        const response = await fetch('http://localhost:3001/service-dictionary');
        const data = await response.json();
        setServices(data.services);
      } catch (error) {
        console.error('Error fetching service dictionary:', error);
      }
    }

    fetchServiceDictionary();
  }, []);

  return (
    <div>
      {services ? (
        services.map((service) => (
          <div key={service.name}>
            <h2>{service.name}</h2>
            <ul>
              {service.endpoints.map((endpoint) => (
                <li key={endpoint.name}>
                  {endpoint.name}: {endpoint.url}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Loading service dictionary...</p>
      )}
    </div>
  );
}

export default ServiceDictionaryMicroFrontend;
