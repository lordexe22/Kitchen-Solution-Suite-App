/* src\modules\addCompany\addCompany.utils.ts */
import { fetchWithJWT } from "../../utils/fetch";

// #variable BASE_URL
const BASE_URL = "http://localhost:4000/api/cloudinary";
// #end-variable

type CloudinarySignatureResponse = {
  timestamp: number;
  signature: string;
  presetName: string;
  apiKey: string;
  cloudName: string;
};

// #function uploadImageAndGetURL - Uploads a logo file to the image hosting service and returns the public URL
/**
 * uploadImageAndGetURL - Uploads the image file to Cloudinary (secure upload) and returns the public URL
 * 
 * Steps:
 * 1. Prepare FormData and append the file
 * 2. Append secure upload parameters (timestamp, signature, api_key, upload_preset)
 * 3. Send POST request to Cloudinary upload endpoint
 * 4. Await and parse the response JSON
 * 5. Extract the secure URL from response and return it
 * 6. Throw error if upload fails at any step
 */
export async function uploadImageAndGetURL(file: File): Promise<string> {
  // #step 1 - Prepare FormData with the file
  const formData = new FormData();
  formData.append("file", file);
  // #end-step
  // #step 2 - Append secure upload parameters from backend
  const { timestamp, signature, presetName, apiKey, cloudName } = await fetchWithJWT<CloudinarySignatureResponse>(
    `${BASE_URL}/signature`,
    'GET'
  );

  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("api_key", apiKey);
  formData.append("upload_preset", presetName);

  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }


  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error en la subida de la imagen");
  }

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("No se recibió URL en la respuesta de Cloudinary");
  }

  console.log("URL de la imagen subida:", data.secure_url);

  return data.secure_url;
}
// #end-function
