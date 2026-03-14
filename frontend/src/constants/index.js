// Color scheme for the application
export const colors = {
  primary: '#1e3a8a',      // Dark Blue
  secondary: '#3b82f6',    // Light Blue
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Amber
  danger: '#ef4444',       // Red
  gray: '#6b7280'          // Gray
};

// Paper cones standard specifications
export const STANDARD_CONES = [
  {
    id: 1,
    degree: '4°20',
    length: 170,
    topDia: 16,
    bottomDia: 69,
    threadCompatibility: ['30S', '40S']
  },
  {
    id: 2,
    degree: '4°30',
    length: 175,
    topDia: 17,
    bottomDia: 69,
    threadCompatibility: ['34S']
  },
  {
    id: 3,
    degree: '5°57',
    length: 230,
    topDia: 22,
    bottomDia: 69,
    threadCompatibility: ['61S', 'Coarse Thread']
  },
  {
    id: 4,
    degree: '3°30',
    length: 170,
    topDia: 18,
    bottomDia: 62,
    threadCompatibility: ['20S', '40S']
  }
];

// Color options
export const COLOR_OPTIONS = [
  'Sky Blue Solid',
  'Brown Kraft',
  'White',
  'Natural',
  'Custom'
];

// Material options
export const MATERIAL_OPTIONS = [
  'Sky Blue Solid',
  'Brown Kraft',
  'White Kraft',
  'Custom'
];

// Strength levels
export const STRENGTH_LEVELS = [
  'Low',
  'Medium',
  'High',
  'Extra High'
];

// Finish types
export const FINISH_TYPES = [
  'Diamond',
  'Plain',
  'Smooth'
];

// Tip types
export const TIP_TYPES = [
  'Round',
  'Sharp',
  'Flat'
];

// Surface finishes
export const SURFACE_FINISHES = [
  'Glossy',
  'Matte',
  'Textured'
];

// Unit of measurement options
export const UOM_OPTIONS = [
  'NOS',
  'KG',
  'BOXES',
  'CARTONS'
];

// Order status options
export const ORDER_STATUS = [
  { value: 'Draft', label: 'Draft', color: '#gray-500' },
  { value: 'Confirmed', label: 'Confirmed', color: '#yellow-500' },
  { value: 'Shipped', label: 'Shipped', color: '#blue-500' },
  { value: 'Delivered', label: 'Delivered', color: '#green-500' },
  { value: 'Cancelled', label: 'Cancelled', color: '#red-500' }
];

// Default GST rates
export const GST_RATES = {
  CGST: 9,
  SGST: 9,
  TOTAL_TAX: 18
};

// Company information
export const COMPANY_INFO = {
  name: 'Shree Paper Products',
  location: 'Kangeyam, Tirupur, Tamilnadu, India',
  industry: 'Paper Cone Manufacturing',
  gst: '27AEXXX0000H2Z9'
};
