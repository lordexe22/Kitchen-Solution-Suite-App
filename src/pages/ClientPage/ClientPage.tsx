// src/pages/ClientPage/ClientPage.tsx
import { useEffect, useState } from "react";
import AddBusiness from "../../components/AddBusiness/AddBusiness";
import BusinessList from "../../components/BusinessList/BusinessList";
import { fetchUserBusinesses } from "../../components/BusinessList/BusinessList.utils";

type Business = {
  id: string;
  name: string;
  alias?: string;
  address?: string;
};

const ClientPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return;

      try {
        const data = await fetchUserBusinesses(token);
        setBusinesses(data);
      } catch (err) {
        console.error("Error cargando negocios:", err);
      }
    };

    load();
  }, []);

  return (
    <>
      <h1>Cliente</h1>
      <AddBusiness setBusinesses={setBusinesses} />
      <BusinessList businesses={businesses} />
    </>
  );
};

export default ClientPage;
