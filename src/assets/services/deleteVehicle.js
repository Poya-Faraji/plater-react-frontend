const API_BASE_URL = import.meta.env.VITE_DELETE_VEHICLE_API_ENDPOINT;

export const deleteVehicle = async (vehicleId) => {
  // Validate input
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }


  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found. Please login again.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${vehicleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(data.message || 'Vehicle has unpaid tickets and cannot be deleted');
      }
      if (response.status === 404) {
        throw new Error('Vehicle not found');
      }
      throw new Error(data.message || 'Failed to delete vehicle');
    }

    return data;
  } catch (error) {
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw new Error(error.message || 'Failed to delete vehicle');
  }
};
