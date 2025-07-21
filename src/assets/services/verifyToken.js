const VERIF_TOKEN_URL = import.meta.env.VITE_TOKEN_VERIFY_API_ENDPOINT;

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    const response = await fetch(`${VERIF_TOKEN_URL}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    const data = await response.json();
    return data.success;
  } catch {
    // Token is invalid or expired
    localStorage.removeItem("token"); // Clean up invalid token
    return false;
  }
};
