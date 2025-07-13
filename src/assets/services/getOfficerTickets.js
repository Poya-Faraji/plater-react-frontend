export const getOfficerTickets = async () => {
  
  const officerId = localStorage.getItem('officerId')
  const token = localStorage.getItem("token");
  const apiUrl = `${import.meta.env.VITE_GET_OFFICER_TICKET_API_ENDPOINT}/${officerId}`


  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; 
      }
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch tickets");
    }

    const data = await response.json();

    return data
  } catch (error) {
    console.error("Error fetching officer tickets:", error);
    throw error;
  }
};
