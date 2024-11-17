
export interface BuyerFormIfc {
  // Contact Information
  client_name: string;
  mobile: string;
  email: string;
  meeting_location: string;
  contact_method: string[];

  // Business Overview
  ref_id: string[];
  capital: number;
  involvement: string[];

  // Additional Information
  description: string[];
};

export interface BuyerIfc extends BuyerFormIfc{
  buyer_id: number;
}

export interface SellerFormIfc {
  // Business Overview
  business_name: string;
  industry: string[];

  // Location and Premises
  location: string;
  address: string;
  size: number;

  // Financial Information
  price: number;
  profit: number;
  expense: number;
  turnover: number;
  license: string[];

  // Transfer Details
  transfer_method: string[];
  reason: string[];

  // Contact Information
  client_name: string;
  mobile: string;
  email: string;
  meeting_location: string;
  contact_method: string[];

  // Additional Information
  description: string[];
};

export interface SellerIfc extends SellerFormIfc{
  seller_id: number;
}

export interface AdminFormIfc {
  business_name: string;
  title: string;
  availability: string;

  // Business Overview
  business_type: string;
  industry: string[];
  label: string[];
  foundation_date: string;
  number_of_partners: number;

  // Location and Premises
  location: string;
  address: string;
  business_situs: string;
  business_situs_owner_type: string;
  size: number;

  // Financial Information
  price: number;
  min_price : number;
  price_include_inventory: boolean;
  deposit: number;
  first_installment: number;
  profit: number;
  turnover: number;

  // Operational Costs
  rent: number;
  renewal_rent: number;
  merchandise_cost: number;
  electricity_bill: number;
  water_bill: number;
  management_fee: number;
  air_conditioning_fee: number;
  rates_and_government_rent: number;
  renovation_and_equipment: number;
  other_expense: number;

  // Staff Information
  number_of_staff: number;
  staff_salary: number;
  staff_remain: string;
  mpf: number;

  // Business Details
  main_product_service: string[];
  main_product_service_percentage: number[];
  business_hours: string;
  license: string[];

  // Lease Information
  lease_term: number;
  lease_expiry_date: string;

  // Transfer Details
  transfer_method: string[];
  reason: string[];
  involvement: string[];

  // Contact Information
  agent: string;
  client_name: string;
  mobile: string;
  email: string;
  meeting_location: string;

  // Additional Information
  description: string[];
};

export interface BusinessDbIfc extends AdminFormIfc {
  id: number;
  ref_id: string;
  availability: string;
  creation_datetime: string;
}

export interface BusinessItemViewIfc {
  ref_id: string;
  title: string;
  label: string[];
  involvement: string[];
  industry: string[];
  location: string;
  size: number;
  price: number;
  turnover: number;
}

export interface BusinessInfoViewIfc {
  ref_id?: string;
  title?: string;
  label?: string[];
  involvement?: string[];
  industry?: string[];
  location?: string;
  business_situs?: string;
  size?: number;
  price?: number;
  turnover?: number;
  transfer_method?: string[];
  profit?: number;
  reason?: string[];
  license?: string[];
  rent?: number;
  description?: string[];
}

export interface BusinessDetailViewIfc {
  ref_id: string;
  title: string;

  // Business Overview
  business_type: string;
  industry: string[];
  label: string[];
  foundation_date: string;
  involvement: string[];

  // Location and Premises
  location: string;
  business_situs: string;
  business_situs_owner_type: string;
  size: number;

  // Financial Information
  price: number;
  price_include_inventory: boolean;
  profit: number;
  turnover: number;

  // Operational Costs
  rent: number;

  // Staff Information
  number_of_staff: number;
  staff_remain: string;

  // Business Details
  main_product_service: string[];
  main_product_service_percentage: number[];
  business_hours: string;
  license: string[];

  // Lease Information
  lease_term: number;
  lease_expiry_date: string;

  // Transfer Details
  transfer_method: string[];
  reason: string[];

  // Additional Information
  description: string[];
}