const API_BASE_URL = import.meta.env.VITE_DELETE_VEHICLE_API_ENDPOINT;

export const deleteVehicle = async (vehicleId) => {
  // Validate input
  if (!vehicleId) {
    throw new Error('Vehicle ID is required');
  }


  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('کد تایید هویت یافت نشد. لطفا دوباره وارد شوید');
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
        throw new Error(data.message || 'وسیله نقلیه دارای جریمه‌های پرداخت نشده است و قابل حذف نیست');
      }
      if (response.status === 404) {
        throw new Error('Vehicle not found');
      }
      throw new Error(data.message || 'حذف خودرو انجام نشد');
    }

    return data;
  } catch (error) {
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('خطای شبکه. لطفا اتصال خود را بررسی کنید..');
    }
    
    throw new Error(error.message || 'حذف خودرو انجام نشد');
  }
};
