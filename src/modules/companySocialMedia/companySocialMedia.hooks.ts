// src\modules\companySocialMedia\companySocialMedia.hooks.ts
import { useState } from "react";
// #function useCompanySocialMediaController - Hook para manejar redes sociales de una empresa
/**
 * Hook para manejar la lógica de redes sociales de una empresa.
 * Se encarga de cargar, modificar y guardar los links sociales desde/hacia la API.
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
   * @param businessId - ID de la empresa para consultar.
   */
  const fetchSocialLinks = async (businessId: string) => {
    setSuccess(false);
    setError(null);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Token no encontrado");

      const response = await fetch(`http://localhost:4000/api/businesses/${businessId}/socials`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al obtener redes sociales: ${text}`);
      }

      const data = await response.json();

      setSocialLinks(data.socials || {});
      setLastUpdate(data.lastUpdate || null);
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
    if (!businessId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Token no encontrado");

      const response = await fetch(`http://localhost:4000/api/businesses/${businessId}/socials`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(socialLinks),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al guardar redes sociales: ${text}`);
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al guardar redes sociales");
      }
    } finally {
      setSaving(false);
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
    fetchSocialLinks,
    saveSocialLinks,
    handleChange,
    setSuccess,
    setError,
  };
  // #end-section
};
// #end-function
