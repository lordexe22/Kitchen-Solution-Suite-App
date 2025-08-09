/* src\modules\company\company.t.ts */
// #type CompanyBaseDataType
export interface CompanyBaseDataType {
  id: string;
  name: string;
  alias?: string;
  address?: string;
  logo_url?: string;
};
// #end-type
// #type FetchActionType

export interface FetchActionType{
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | undefined
  url: string
}
// #end-type