/* src\modules\companySocialMedia\companySocialMedia.hooks.ts */
// #section imports
import { useState, useCallback } from "react";
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
  // #variable socialMediaLinks, socialMediaLastUpdate, socialMediaSaving, socialMediaError, socialMediaSuccess
  const [socialMediaLinks, setSocialMediaLinks] = useState<Record<string, string>>({
    facebook_url: "",
    instagram_url: "",
    x_url: "",
    tiktok_url: "",
    threads_url: "",
  });
  const [socialMediaLastUpdate, setSocialMediaLastUpdate] = useState<string | null>(null);
  const [socialMediaSaving, setSocialMediaSaving] = useState(false);
  const [socialMediaError, setSocialMediaError] = useState<string | null>(null);
  const [socialMediaSuccess, setSocialMediaSuccess] = useState(false);
  // #end-variable
  // #function fetchsocialMediaLinks - Obtiene los links de las redes sociales del usuario desde la API
  /**
   * Obtiene los datos de redes sociales de una empresa desde la API.
   *
   * @param companyId - ID de la empresa para consultar.
   */
  const fetchSocialMediaLinks = useCallback(async (companyId: string) => {
    setSocialMediaSuccess(false);
    setSocialMediaError(null);

    try {
      const data = await fetchWithJWT<{ socials?: Record<string, string>, lastUpdate?: string }>(
        `http://localhost:4000/api/companies/${companyId}/socials`,
        "GET"
      );

      setSocialMediaLinks(data.socials || {});
      setSocialMediaLastUpdate(data.lastUpdate || null);
    } catch (err) {
      console.error("Error al hacer fetch de redes sociales:", err);
    }
  }, []);
  // #end-function
  // #function saveSocialMediaLinks - Guarda los links de las redes sociales en la API
  /**
   * Guarda los datos modificados de redes sociales en la API.
   *
   * @param businessId - ID de la empresa que se desea actualizar.
   */
  const saveSocialMediaLinks = async (businessId: string) => {
    // #step 1 - Validate the business ID 
    if (!businessId) return;
    // #end-step
    // #step 2 - Prepare the saving state and reset error and success states
    setSocialMediaSaving(true);
    setSocialMediaError(null);
    setSocialMediaSuccess(false);
    // #end-step
    try {
      // #step 3 - Validate the social links object
      await fetchWithJWT(
        `http://localhost:4000/api/companies/${businessId}/socials`,
        "PUT",
        socialMediaLinks
      );
      // #end-step
      // #step 4 - Set success state to true after saving
      setSocialMediaSuccess(true);
      // #end-step
    } catch (err: unknown) {
      // #step 5 - Handle errors and set the error message
      if (err instanceof Error) {
        setSocialMediaError(err.message);
      } else {
        setSocialMediaError("Error desconocido al guardar redes sociales");
      }
      console.error("Error al guardar redes sociales:", err);
      // #end-step
    } finally {
      // #step 6 - Reset saving state
      setSocialMediaSaving(false);
      // #end-step
    }
  };
  // #end-function
  // #function handleSocialMediaChange - Actualiza un valor individual del objeto de redes sociales
  /**
   * Actualiza un valor individual del objeto de redes sociales.
   *
   * @param platform - Clave de la red social.
   * @param value - Nuevo valor del input.
   */
  const handleSocialMediaChange = (platform: string, value: string) => {
    setSocialMediaLinks((prev) => ({ ...prev, [platform]: value }));
  };
  // #end-function
  // #section return
  return {
    socialMediaLinks,
    socialMediaLastUpdate,
    socialMediaSaving,
    socialMediaError,
    socialMediaSuccess,
    fetchSocialMediaLinks,
    saveSocialMediaLinks,
    handleSocialMediaChange,
    setSocialMediaSuccess,
    setSocialMediaError,
  };
  // #end-section
};
// #end-function
