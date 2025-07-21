/* src\modules\company\company.t.ts */
// #typedef CompanyAddressType
export interface CompanyAddressType {
  street: string
  number?: string
  city: string
  state?: string
  zipCode?: string
  country: string
}
// #end-typedef
// #typedef CompanySocialMediaType
export interface CompanySocialMediaType {
  instagram?: string
  facebook?: string
  twitter?: string
  tiktok?: string
} 
// #end-typedef
// #typedef CompanyFormBaseType
export interface CompanyFormBaseType{
  name: string
  email: string
  phone?: string
  website?: string
  logoUrl?: string
  description?: string
  openingDate?: string
  businessType?: 'restaurant' | 'bar' | 'cafe' | 'food_truck' | 'bakery' | 'other'
}
// #end-typedef
// #typedef CompanyOpeningHourType
export interface CompanyOpeningHourType {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  open: string // formato HH:mm (24h)
  close: string // formato HH:mm (24h)
  closed?: boolean // opcional para marcar días cerrados explícitamente
}
// #end-typedef
// #typedef CompanyFormDataType
export interface CompanyFormDataType extends CompanyFormBaseType {
  address: CompanyAddressType
  socialMedia?: CompanySocialMediaType
  openingHours?: CompanyOpeningHourType[]
}
// #end-typedef

export type Business = {
  id: string;
  name: string;
  alias?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
};