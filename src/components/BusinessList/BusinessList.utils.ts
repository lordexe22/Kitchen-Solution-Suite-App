// src\components\BusinessList\BusinessList.utils.ts

export const fetchUserBusinesses = async (token: string) => {
  const response = await fetch("http://localhost:4000/api/businesses/mine", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener negocios");
  }

  const data = await response.json();
  return data.businesses;
};
