const GET_TICKET_URL = import.meta.env.VITE_GET_TICKET_BYID_API_ENDPOINT;
const CANCERL_TICKET_URL = import.meta.env.VITE_CANCEL_TICKET_BYID_API_ENDPOINT;


export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStatusText = (status) => {
  switch (status) {
    case 'PAID': return 'پرداخت شده';
    case 'UNPAID': return 'پرداخت نشده';
    case 'CANCELLED': return 'لغو شده';
    default: return status;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'PAID': return 'green';
    case 'UNPAID': return 'red';
    case 'CANCELLED': return 'amber';
    default: return 'blue';
  }
};


const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `درخواست با خطا مواجه شد (${response.status})`);
  }
  return response.json();
};

export const getTicketById = async (ticketId) => {
  try {
    const baseURL = GET_TICKET_URL;
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${baseURL}${ticketId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `${token}` })
      }
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    if (error.message.includes('404')) {
      throw new Error('قبض مورد نظر یافت نشد');
    }
    throw new Error('خطا در دریافت اطلاعات قبض');
  }
};

export const cancelTicket = async (ticketId) => {
  try {
    const baseURL = CANCERL_TICKET_URL;
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${baseURL}${ticketId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `${token}` })
      }
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    if (error.message.includes('400')) {
      throw new Error(error.message);
    }
    throw new Error('خطا در لغو قبض');
  }
};