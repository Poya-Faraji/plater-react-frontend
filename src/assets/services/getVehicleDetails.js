// src/services/vehicleService.js

const VEHICLE_API_URL = import.meta.env.VITE_VEHICLE_DETAIL_API_ENDPOINT;

export const getVehicleDetails = async (vehicleId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`${VEHICLE_API_URL}${vehicleId}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch vehicle details");
    }

    const data = await response.json();
    
    // Convert Decimal objects to numbers
    const transformedData = {
      ...data,
      tickets: data.tickets.map(ticket => ({
        ...ticket,
        amount: Number(ticket.amount),
        payments: ticket.payments.map(payment => ({
          ...payment,
          amount: Number(payment.amount)
        }))
      }))
    };
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching vehicle details:", error.message);
    
    // Handle specific error cases
    if (error.message.includes("404")) {
      throw new Error("Vehicle not found");
    }
    
    if (error.message.includes("401") || error.message.includes("403")) {
      localStorage.removeItem("token");
      throw new Error("Session expired. Please login again");
    }
    
    throw error;
  }
};
