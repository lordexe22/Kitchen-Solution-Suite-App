/* src\modules\companyLocation\companyLocation.hooks.ts */
// #section Imports
import { useState, useCallback } from "react";
import {
  getCompanyLocation,
  updateCompanyLocation,
} from "./companyLocation.utils";
import { type LocationData, type GetCompanyLocationResponse } from "./companyLocation.t";
// #end-section

// #hook useCompanyLocationController
export const useCompanyLocationController = () => {
  // #state [location, setLocation]
  const [location, setLocation] = useState<LocationData>({
    address: "",
    city: "",
    province: "",
  });
  // #end-state
  // #state [locationSaving, setLocationSaving]
  const [locationSaving, setLocationSaving] = useState(false);
  // #end-state
  // #state [locationLastUpdate, setLocationLastUpdate]
  const [locationLastUpdate, setLocationLastUpdate] = useState<string | null>(null);
  // #end-state
  // #state [locationSuccess, setLocationSuccess]
  const [locationSuccess, setLocationSuccess] = useState(false);
  // #end-state
  // #state [locationError, setLocationError]
  const [locationError, setLocationError] = useState<string | null>(null);
  // #end-state
  // #function fetchLocation
  const fetchLocation = useCallback(async (companyId: string) => {
    /* #info - useCallback memoriza una función y devuelve la misma referencia mientras sus dependencias no cambien. 
     * Esto evita que la función se recree en cada render, lo que es útil para evitar efectos secundarios innecesarios, 
     * como re-ejecutar un useEffect que depende de esa función. 
     */
    try {
      // #variable data - 
      const data: GetCompanyLocationResponse = await getCompanyLocation(companyId);
      // #end-variable
      // #step 1 - 
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
      setLocation({ address: "", city: "", province: "" });
      setLocationLastUpdate(null);
    }
  }, []);
  // #end-function


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
// #end-hook