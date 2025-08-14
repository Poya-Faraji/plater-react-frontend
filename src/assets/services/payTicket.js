const PAY_TICKET_API_URL = import.meta.env.VITE_PAY_TICKET_BYID_API_ENDPOINT;

export const payTicket = async (ticketId) => {
  // Validate input
  if (!ticketId) {
    throw new Error('شناسه قبض الزامی است');
  }

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('کد تایید هویت یافت نشد. لطفا دوباره وارد شوید');
  }

  try {
    const response = await fetch(`${PAY_TICKET_API_URL}/${ticketId}/pay`, {
      method: 'PUT',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific status codes
      if (response.status === 400) {
        throw new Error(data.error || 'درخواست نامعتبر است');
      }
      if (response.status === 404) {
        throw new Error(data.error || 'قبض مورد نظر یافت نشد');
      }
      if (response.status === 409) {
        throw new Error(data.error || 'وضعیت قبض برای پرداخت مناسب نیست');
      }
      throw new Error(data.error || 'پرداخت قبض انجام نشد');
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('خطای شبکه. لطفا اتصال خود را بررسی کنید.');
    }
    // Throw existing error message if available
    throw new Error(error.message || 'پرداخت قبض انجام نشد');
  }
};