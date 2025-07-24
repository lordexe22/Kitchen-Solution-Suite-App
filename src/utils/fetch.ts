/* src\utils\fetch.ts */

/* #note - This file contains utility functions for making HTTP requests using the Fetch API. */

// #function fetchWithJWT - This function performs a fetch request with JWT authentication.
/**
 * Performs a fetch request with JWT authentication.
 * This function retrieves a JWT token from localStorage, sets it in the request headers,
 * and handles the response. It supports various HTTP methods and can send a request body.
 * 
 * @param url The URL to which the request is sent.
 * @param method The HTTP method to use for the request (default is 'GET').
 * @param body The body of the request, which will be stringified if provided.
 * @returns 
 */
export const fetchWithJWT = async <T = object> (
  url: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown,
): Promise<T> => {
  try {
    // #step 1 - capture and validate the JWT from localStorage
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Token no encontrado");
    // #end-step
    // #step 2 - prepare the request headers >> headers
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    // #end-step
    // #step 3 - execute the fetch request
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    // #end-step
    // #step 4 - check if the response is ok
    if (!response.ok) {
      throw new Error(`Error en la solicitud`);
    }
    // #end-step
    // #step 5 - parse the response as JSON
    const data: T = await response.json();
    // #end-step
    // #step 6 - return the parsed data
    return data;
    // #end-step
  } catch (error) {
    // #step 7 - handle exceptions
      console.error(error);
      throw error; 
    // #end-step
  }
}
// #end-function