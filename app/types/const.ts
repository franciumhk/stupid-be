
export const DEFAULT_DATES = {
  FOUNDATION: "2020-01-01",
  LEASE_EXPIRY: "2030-12-31",
};

export const DEFAULT_BOOLEANS = {
  PRICE_INCLUDE_INVENTORY: false,
};


// String defaults
export const DEFAULT_STRINGS = {
  ADDRESS: "Wu Sang House, 655 Nathan Rd, Mong Kok, Hong Kong",
  MAIN_PRODUCT_SERVICE: "Food",
  MAIN_PRODUCT_SERVICE_PERCENTAGE: "80",
  DESCRIPTION: "NA",
  BUSINESS_NAME: "StartUp Dream",
  TITLE: "Hot StartUp",
  BUSINESS_HOURS: "9-6",
  CLIENT_NAME: "Francis",
  MOBILE: "98765432",
  EMAIL: "francis@startupdream.com",
  MEETING_LOCATION: "Office",
};

// Numeric defaults
export const DEFAULT_NUMBERS = {
  NUMBER_OF_PARTNERS: 0,
  SIZE: 5000,
  PRICE: 50000,
  MIN_PRICE: 45000,
  DEPOSIT: 10000,
  FIRST_INSTALLMENT: 20000,
  PROFIT: 5000,
  TURNOVER: 1000,
  RENT: 1000,
  RENEWAL_RENT: 1200,
  MERCHANDISE_COST: 50,
  ELECTRICITY_BILL: 100,
  WATER_BILL: 200,
  MANAGEMENT_FEE: 100,
  AIR_CONDITIONING_FEE: 100,
  RATES_AND_GOVERNMENT_RENT: 100,
  RENOVATION_AND_EQUIPMENT: 100,
  OTHER_EXPENSE: 1000,
  NUMBER_OF_STAFF: 2,
  STAFF_SALARY: 10000,
  MPF: 200,
  LEASE_TERM: 1,
};

// Option arrays
export const OPTIONS = {
  AVAILABILITY: ["Inactive", "Active", "Sold"],
  BUSINESS_TYPE: ["Sole Proprietorship", "Partnership", "Limited Company"],
  INDUSTRY: [
    "Education",
    "Maternity & Baby",
    "Beauty & Nail",
    "Retail",
    "Service",
    "Online Business",
    "Party Room",
    "Foot Massage",
    "Pet",
    "Hotel",
    "Frozen Meat",
    "Market Stall",
    "Grocery Store",
    "Food & Beverage",
    "Tea Restaurant",
    "Chinese Restaurant",
    "Hotpot",
    "Factory Canteen",
    "Western Restaurant",
    "Café",
    "Specialty Restaurant",
    "Snack Shop",
    "Takeaway",
    "Beverage Shop",
    "Bakery",
    "Dessert Shop",
    "Noodle Shop",
    "Bar Food Factory",
    "Others"],
  LABEL: ["Startup Choice",
    "Hot",
    "Quick Payback",
    "Affordable Rent",
    "Smooth Operation",
    "Low Entry"],
  STAFF_REMAIN: ["All Remain", "Partly Remain", "Negotiable", "Not Remain"],
  LICENSE: [
    "School Registration License",
    "Hotel License",
    "Money Lender License",
    "Pet License Money Service Operator License",
    "Entertainment License",
    "Travel Agent License",
    "Employment Agency License",
    "Elderly Home License",
    "Charitable Organization License",
    "Chinese Herbal Medicine Retailer License",
    "General Restaurant License",
    "Light Refreshment Restaurant License",
    "Factory Canteen License",
    "Food Factory License",
    "Bakery License",
    "Sashimi Sushi License",
    "Ice Cream Factory License",
    "Liquor License",
    "Club License",
    "Frozen Food Storage License",
    "Fresh Provision Shop License",
    "Dairy Factory License",
    "Roasted & Siu Mei Shop License",
    "Composite Food Shop License",
    "Restricted Foods Permit",
    "Live Seafood License",
    "Food Factory License - Reheating",
    "Others"],
  TRANSFER_METHOD: ["Business Transfer", "Asset Transfer", "Brand Transfer"],
  REASON: ["Owner plans to retire",
    "Owner is immigrating",
    "Disagreement among shareholders, consensus to part ways",
    "Shareholders have individual developments, reluctantly parting ways",
    "Owner has other developments, unable to manage",
    "Owner needs to take care of family, reluctantly letting go",
    "Health issues, unable to manage",
    "After many years of operation, looking to change lifestyle",
    "Owner intends to develop in other areas, reluctantly letting go",
    "Insufficient staff for business, cashing out",
    "Owner has stable operations and is willing to transfer if the price is right",
    "Selling at a bargain price"],
  INVOLVEMENT: ["Full Time", "Part Time", "Auto Run"],
  LOCATION: [
    "Kennedy Town - KT",
    "Sai Ying Pun - SYP",
    "Sheung Wan - CW",
    "Central - CL",
    "Mid,Levels - ML",
    "Wan Chai - WC",
    "Causeway Bay - CWB",
    "Tin Hau - TH",
    "Fortress Hill - FH",
    "North Point - NP",
    "ay - Quarry",
    "Sai Wan Ho - SWH",
    "Shau Kei Wan - SKW",
    "Chai Wan - CW",
    "Aberdeen - ABD",
    "Ap Lei Chau - ALC",
    "Wong Chuk Hang - WCH",
    "Stanley - SL",
    "Tsim Sha Tsui - TST",
    "Yau Ma Tei - YMT",
    "Mong Kok - MK",
    "Tai Kok Tsui - TKT",
    "Mei Foo - MF",
    "Lai Chi Kok - LCK",
    "Sham Shui Po - SSP",
    "Hung Hom - HH",
    "To Kwa Wan - TKW",
    "Kai Tak - KT",
    "Kowloon City - KC",
    "Kowloon Tong - KLT",
    "San Po Kong - SPK",
    "Wong Tai Sin - WTS",
    "Diamond Hill - DMH",
    "Kowloon Bay - KLW",
    "Kwun Tong - KT",
    "Lam Tin - LT",
    "Yau Tong - YT",
    "Tsuen Wan - TW",
    "Kwai Fong - KF",
    "Kwai Chung - KC",
    "Tsing Yi - TY",
    "Yuen Long - YL",
    "Tin Shui Wai - TSW",
    "Tuen Mun - TM",
    "Sheung Shui - SS",
    "Fanling - FL",
    "Tai Po - TP",
    "Tai Wai - TW",
    "Sha Tin - ST",
    "Fo Tan - FT",
    "Wu Kai Sha - WKS",
    "Ma On Shan - MOS",
    "Sai Kung - SK",
    "Tseung Kwan O - TKO",
    "Hang Hau - HH",
    "Hong Kong Island - HK",
    "Kowloon - KL",
    "New Territories - NT",
    "Outlying Islands - IL"],
  BUSINESS_SITUS: [
    "Ground Floor",
    "Ground Floor with Mezzanine",
    "Industrial Building",
    "Shopping Mall",
    "Commercial Building",
    "Upper Floor",
    "Others"],
  BUSINESS_SITUS_OWNER_TYPE: ["Private Owner", "Company Group"],
  AGENT: ["Amiee", "Felix"],
  CONTACT_METHOD: ["Call", "Email", "WhatsApp"],
};

export const DEFAULT_OPTIONS = {
  AVAILABILITY: OPTIONS.AVAILABILITY[0],
  BUSINESS_TYPE: OPTIONS.BUSINESS_TYPE[0],
  INDUSTRY: OPTIONS.INDUSTRY[0],
  LABEL: OPTIONS.LABEL[0],
  STAFF_REMAIN: OPTIONS.STAFF_REMAIN[0],
  LICENSE: OPTIONS.LICENSE[0],
  TRANSFER_METHOD: OPTIONS.TRANSFER_METHOD[0],
  REASON: OPTIONS.REASON[0],
  INVOLVEMENT: OPTIONS.INVOLVEMENT[0],
  LOCATION: OPTIONS.LOCATION[0],
  BUSINESS_SITUS: OPTIONS.BUSINESS_SITUS[0],
  BUSINESS_SITUS_OWNER_TYPE: OPTIONS.BUSINESS_SITUS_OWNER_TYPE[0],
  AGENT: OPTIONS.AGENT[0],
  CONTACT_METHOD: OPTIONS.CONTACT_METHOD[0],
}

export const DEFAULT_LIMITS = {
  MIN_PRICE: 0,
  MAX_PRICE: 10000000,
  STEP_PRICE: 1000,
  MIN_TURNOVER: 0,
  MAX_TURNOVER: 1000000,
  STEP_TURNOVER: 1000,
  BIZ_FETCH_COUNT: 5,
}