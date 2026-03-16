// #type HttpMethod - Métodos HTTP soportados por el cliente
/**
 * @description
 * Métodos HTTP soportados por el módulo de cliente HTTP.
 *
 * @purpose
 * Tipificar los métodos HTTP permitidos para restringir los valores aceptados en la configuración de peticiones.
 *
 * @context
 * Utilizado por RequestConfig y por las funciones del módulo httpClient de librería.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
// #end-type
// #interface RetryConfig - Configuración de reintentos automáticos
/**
 * @description
 * Parámetros de configuración para el mecanismo de reintentos automáticos de peticiones.
 *
 * @purpose
 * Centralizar la configuración de resiliencia de peticiones HTTP en una estructura reutilizable.
 *
 * @context
 * Utilizado por RequestConfig y HttpClientConfig del módulo httpClient.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface RetryConfig {
  // #v-field maxRetries - Número máximo de reintentos
  /** número máximo de reintentos ante un fallo */
  maxRetries: number;
  // #end-v-field
  // #v-field delay - Tiempo de espera entre reintentos
  /** tiempo de espera en milisegundos entre cada reintento */
  delay: number;
  // #end-v-field
}
// #end-interface
// #interface RequestConfig - Configuración completa de una petición HTTP
/**
 * @description
 * Parámetros de configuración para una petición HTTP individual.
 *
 * @purpose
 * Centralizar todas las opciones configurables de una petición en una única estructura tipada.
 *
 * @context
 * Utilizado por las funciones de petición del módulo httpClient de librería.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface RequestConfig {
  // #v-field url - URL del endpoint
  /** URL del endpoint de destino */
  url: string;
  // #end-v-field
  // #v-field method - Método HTTP de la petición
  /** método HTTP a utilizar */
  method?: HttpMethod;
  // #end-v-field
  // #v-field headers - Cabeceras de la petición
  /** cabeceras HTTP personalizadas de la petición */
  headers?: Record<string, string>;
  // #end-v-field
  // #v-field data - Cuerpo de la petición
  /** cuerpo de datos a enviar en la petición */
  data?: unknown;
  // #end-v-field
  // #v-field params - Parámetros de query string
  /** parámetros de query string de la petición */
  params?: Record<string, string | number | boolean>;
  // #end-v-field
  // #v-field timeout - Tiempo límite de la petición
  /** tiempo máximo de espera en milisegundos antes de cancelar la petición */
  timeout?: number;
  // #end-v-field
  // #v-field withCredentials - Incluir credenciales en la petición
  /** indica si se deben incluir cookies y credenciales en la petición */
  withCredentials?: boolean;
  // #end-v-field
  // #v-field retry - Configuración de reintentos
  /** configuración del mecanismo de reintentos automáticos */
  retry?: RetryConfig;
  // #end-v-field
}
// #end-interface
// #interface ApiResponse - Respuesta normalizada de la API
/**
 * @description
 * Estructura normalizada de la respuesta de la API del sistema.
 *
 * @purpose
 * Proveer un contrato consistente para todas las respuestas de la API, independientemente del endpoint.
 *
 * @context
 * Utilizado por los servicios del frontend que consumen la API del backend.
 *
 * @template T Tipo del dato retornado en la respuesta exitosa
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface ApiResponse<T> {
  // #v-field success - Indica si la operación fue exitosa
  /** indica si la operación fue exitosa */
  success: boolean;
  // #end-v-field
  // #v-field data - Datos de la respuesta
  /** datos retornados por la operación */
  data?: T;
  // #end-v-field
  // #v-field error - Mensaje de error
  /** mensaje de error si la operación falló */
  error?: string;
  // #end-v-field
  // #v-field message - Mensaje informativo
  /** mensaje informativo asociado a la respuesta */
  message?: string;
  // #end-v-field
}
// #end-interface
// #interface HttpResponse - Respuesta cruda del cliente HTTP
/**
 * @description
 * Respuesta cruda retornada por el cliente HTTP antes de ser normalizada.
 *
 * @purpose
 * Encapsular la respuesta HTTP completa para su procesamiento por los interceptores y servicios.
 *
 * @context
 * Utilizado internamente por el módulo httpClient de librería.
 *
 * @template T Tipo del cuerpo de la respuesta
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface HttpResponse<T> {
  // #v-field data - Cuerpo de la respuesta
  /** cuerpo deserializado de la respuesta HTTP */
  data: T;
  // #end-v-field
  // #v-field status - Código de estado HTTP
  /** código de estado HTTP de la respuesta */
  status: number;
  // #end-v-field
  // #v-field statusText - Texto del estado HTTP
  /** texto descriptivo del código de estado HTTP */
  statusText: string;
  // #end-v-field
  // #v-field headers - Cabeceras de la respuesta
  /** cabeceras HTTP de la respuesta */
  headers: Headers;
  // #end-v-field
}
// #end-interface
// #interface HttpClientConfig - Configuración del cliente HTTP base
/**
 * @description
 * Configuración inicial del cliente HTTP.
 *
 * @purpose
 * Centralizar los parámetros base del cliente HTTP para reutilizarlos en todas las peticiones.
 *
 * @context
 * Utilizado al inicializar una instancia del cliente HTTP en el módulo de librería.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface HttpClientConfig {
  // #v-field baseURL - URL base del cliente
  /** URL base que se antepone a todas las peticiones del cliente */
  baseURL: string;
  // #end-v-field
  // #v-field timeout - Tiempo límite por defecto
  /** tiempo máximo de espera por defecto en milisegundos */
  timeout?: number;
  // #end-v-field
  // #v-field headers - Cabeceras por defecto
  /** cabeceras HTTP aplicadas por defecto a todas las peticiones */
  headers?: Record<string, string>;
  // #end-v-field
  // #v-field withCredentials - Incluir credenciales por defecto
  /** indica si se incluyen cookies y credenciales en todas las peticiones */
  withCredentials?: boolean;
  // #end-v-field
  // #v-field retry - Configuración de reintentos por defecto
  /** configuración del mecanismo de reintentos aplicada por defecto */
  retry?: RetryConfig;
  // #end-v-field
}
// #end-interface
// #type RequestInterceptor - Interceptor ejecutado antes de cada petición
/**
 * @description
 * Función interceptora ejecutada antes de enviar cada petición HTTP.
 *
 * @purpose
 * Permitir transformar o enriquecer la configuración de la petición antes de su envío.
 *
 * @context
 * Registrado en el cliente HTTP de librería para modificar peticiones salientes.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;
// #end-type
// #type ResponseInterceptor - Interceptor ejecutado al recibir cada respuesta
/**
 * @description
 * Función interceptora ejecutada al recibir cada respuesta HTTP.
 *
 * @purpose
 * Permitir transformar o normalizar la respuesta antes de ser entregada al consumidor.
 *
 * @context
 * Registrado en el cliente HTTP de librería para procesar respuestas entrantes.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type ResponseInterceptor = <T>(
  response: HttpResponse<T>
) => HttpResponse<T> | Promise<HttpResponse<T>>;
// #end-type
// #type ErrorInterceptor - Interceptor ejecutado cuando una petición falla
/**
 * @description
 * Función interceptora ejecutada cuando una petición HTTP falla.
 *
 * @purpose
 * Centralizar el manejo de errores de red y HTTP en un único punto del cliente.
 *
 * @context
 * Registrado en el cliente HTTP de librería para interceptar errores de peticiones.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type ErrorInterceptor = (
  error: Error
) => never | Promise<never>;
// #end-type
