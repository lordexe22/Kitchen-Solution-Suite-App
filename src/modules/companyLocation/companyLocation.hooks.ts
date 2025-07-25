import { useState } from "react";
import {
  getCompanyLocation,
  updateCompanyLocation,
} from "./companyLocation.utils";
import { type LocationData, type GetCompanyLocationResponse } from "./companyLocation.t";

export const useCompanyLocationController = () => {
  const [location, setLocation] = useState<LocationData>({
    address: "",
    city: "",
    province: "",
  });
  const [locationSaving, setLocationSaving] = useState(false);
  const [locationLastUpdate, setLocationLastUpdate] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchLocation = async (companyId: string) => {
    try {
      const data: GetCompanyLocationResponse = await getCompanyLocation(companyId);
      // Si no hay ubicación, inicializamos con valores vacíos
      if (!data.location) {
        setLocation({ address: "", city: "", province: "" });
        setLocationLastUpdate(null);
      } else {
        setLocation(data.location);
        setLocationLastUpdate(data.lastUpdate);
      }
      setLocationError(null);
    } catch (e) {
      console.error(e);
      setLocationError("Error al cargar la ubicación");
      // Para evitar estado inconsistente si hay error
      setLocation({ address: "", city: "", province: "" });
      setLocationLastUpdate(null);
    }
  };


  const saveLocation = async (companyId: string) => {
    try {
      setLocationSaving(true);
      await updateCompanyLocation(companyId, location);
      setLocationSuccess(true);
      setLocationLastUpdate(new Date().toISOString());
      setLocationError(null);
    } catch (e) {
      console.error(e);
      setLocationError("Error al guardar la ubicación");
      setLocationSuccess(false);
    } finally {
      setLocationSaving(false);
    }
  };

  const handleLocationChange = (field: keyof LocationData, value: string) => {
    setLocation((prev) => ({ ...prev, [field]: value }));
  };

  return {
    location,
    locationSaving,
    locationSuccess,
    locationError,
    locationLastUpdate,
    fetchLocation,
    saveLocation,
    handleLocationChange,
    setLocationError,
    setLocationSuccess,
  };
};
