/* src\modules\companySocialMedia\companySocialMedia.hooks.ts */
// #section imports
import { useState } from "react";
import { fetchWithJWT } from "../../utils/fetch";
// #end-section
// #function useCompanySocialMediaController - Hook for managing company social media links
/**
 * Hook for managing company social media links.
 * Provides functions to fetch, save, and update social media links for a company.
 * @returns An object containing social media links, last update timestamp, saving state, error state, success state,
 * and functions to fetch, save, and update social media links.
 */
export const useCompanySocialMediaController = () => {
  // #variable socialLinks, lastUpdate, saving, error, success
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    facebook_url: "",
    instagram_url: "",
    x_url: "",
    tiktok_url: "",
    threads_url: "",
  });
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // #end-variable
  // #function fetchSocialLinks - Obtiene los links de las redes sociales del usuario desde la API
  /**
   * Obtiene los datos de redes sociales de una empresa desde la API.
   *
   * @param companyId - ID de la empresa para consultar.
   */
  const fetchSocialMediaLinks = async (companyId: string) => {
    setSuccess(false);
    setError(null);

    try {
      // #step 1 - Fetch the social media links for the given company ID
      const data = await fetchWithJWT<{ socials?: Record<string, string>, lastUpdate?: string }>(
        `http://localhost:4000/api/businesses/${companyId}/socials`,
        "GET"
      );
      // #end-step
      // #step 2 - Set the social links and last update state
      setSocialLinks(data.socials || {});
      setLastUpdate(data.lastUpdate || null);
      // #end-step
    } catch (err) {
      console.error("Error al hacer fetch de redes sociales:", err);
    }
  };
  // #end-function
  // #function saveSocialLinks - Guarda los links de las redes sociales en la API
  /**
   * Guarda los datos modificados de redes sociales en la API.
   *
   * @param businessId - ID de la empresa que se desea actualizar.
   */
  const saveSocialLinks = async (businessId: string) => {
    // #step 1 - Validate the business ID 
    if (!businessId) return;
    // #end-step
    // #step 2 - Prepare the saving state and reset error and success states
    setSaving(true);
    setError(null);
    setSuccess(false);
    // #end-step
    try {
      // #step 3 - Validate the social links object
      await fetchWithJWT(
        `http://localhost:4000/api/businesses/${businessId}/socials`,
        "PUT",
        socialLinks
      );
      // #end-step
      // #step 4 - Set success state to true after saving
      setSuccess(true);
      // #end-step
    } catch (err: unknown) {
      // #step 5 - Handle errors and set the error message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al guardar redes sociales");
      }
      console.error("Error al guardar redes sociales:", err);
      // #end-step
    } finally {
      // #step 6 - Reset saving state
      setSaving(false);
      // #end-step
    }
  };
  // #end-function
  // #function handleChange - Actualiza un valor individual del objeto de redes sociales
  /**
   * Actualiza un valor individual del objeto de redes sociales.
   *
   * @param platform - Clave de la red social.
   * @param value - Nuevo valor del input.
   */
  const handleChange = (platform: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
  };
  // #end-function
  // #section return
  return {
    socialLinks,
    lastUpdate,
    saving,
    error,
    success,
    fetchSocialLinks: fetchSocialMediaLinks,
    saveSocialLinks,
    handleChange,
    setSuccess,
    setError,
  };
  // #end-section
};
// #end-function
