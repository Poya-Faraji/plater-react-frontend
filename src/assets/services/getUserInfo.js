const USER_API_URL = import.meta.env.VITE_USER_API_ENDPOINT;

export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    const response = await fetch(`${USER_API_URL}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed fetching user info");
    }

    const data = await response.json();
    return (data)
  } catch {
  
    localStorage.removeItem("token"); // Clean up invalid token
    return false;
  }
};
