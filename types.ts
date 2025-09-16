

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  FOUNDATION = 'Foundation (Daycare)',
  PRODUCT_SUPPLIER = 'Product Supplier', // Updated
  SERVICE_PROVIDER = 'Service Provider', // New
  EDUCATOR = 'Educator / Candidate',
  PARENT = 'Parent',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId?: string;
  orgName?: string; // Added for convenience
  avatarUrl?: string;
  status?: 'Active' | 'Pending' | 'Inactive';
  lastLogin?: string;
  region?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'foundation' | 'supplier' | 'service_provider'; // Clarify supplier types
  region: string;
  logoUrl?: string;
  coverImageUrl?: string; // New
  email?: string; // New
  phone?: string; // New
  website?: string; // New
  address?: string; // New
  description?: string; // New: For supplier/provider short bio
  tags?: string[]; // New: For categories like "Food Supplier", "Legal Service"
  rating?: number; // New: For supplier cards (0-5)
  badges?: string[]; // New: e.g., "Verified", "Promo Active"
  directOrderLink?: string; // New: For suppliers' direct order page

  // New fields for Foundation
  capacity?: number;
  pedagogy?: string[]; // e.g., ["Montessori", "Reggio Emilia"]
  languagesSpoken?: string[]; // e.g., ["French", "English", "German"]
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Demand';

export interface Product {
  id: string;
  title: string;
  supplierId: string; // This is an Organization ID
  supplierName: string; // Denormalized for convenience
  supplierLogo?: string; // Denormalized
  brochureUrl?: string;
  description: string;
  category: string; // e.g., 'Toys', 'Furniture', 'Educational Materials'
  tags: string[];
  imageUrl?: string; 
  price?: number; // New
  stockStatus?: StockStatus; // New
}

export const SERVICE_CATEGORIES = ['Legal', 'Catering', 'Cleaning', 'Workshops', 'IT Support', 'Consulting', 'Maintenance', 'Photography', 'Staff Training', 'Landscaping', 'Other'] as const;
export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

export const SERVICE_DELIVERY_TYPES = ['On-site', 'Remote', 'Hybrid'] as const;
export type ServiceDeliveryType = typeof SERVICE_DELIVERY_TYPES[number];

export interface Service {
  id: string;
  title: string;
  providerId: string; // This is an Organization ID
  providerName: string; // Denormalized
  providerLogo?: string; // Denormalized
  description: string;
  category: ServiceCategory; 
  availability: string; // General availability text
  tags: string[];
  imageUrl?: string;
  deliveryType?: ServiceDeliveryType;
  priceInfo?: string; // New: e.g., "$50/hr", "From $200/package", "Free Consultation"
}

export interface JobListing {
  id: string;
  title: string;
  foundationName: string;
  location: string;
  contractType: 'CDI' | 'CDD' | 'Internship' | 'Part-time' | 'Full-time';
  startDate: string;
  applicationsReceived: number;
  status: 'Open' | 'Closed';
  description: string;
  requirements: string[];
}

// Detailed Candidate Profile Types
export interface WorkExperienceItem {
  id: string; // Added for stable keys
  jobTitle: string;
  institutionName: string;
  startDate: string; // e.g., "YYYY-MM" or "YYYY"
  endDate: string | 'Present'; // e.g., "YYYY-MM" or "YYYY" or "Present"
  descriptionPoints: string[]; // Array of bullet points
}

export interface EducationItem {
  id: string; // Added for stable keys
  degree: string;
  institutionName: string;
  graduationYear: string; // e.g., "YYYY"
  description?: string;
}

export interface CertificationItem {
  id: string; // Added
  name: string;
  issuingOrganization: string;
  issueDate: string; // e.g., "YYYY-MM"
  expiryDate?: string; // e.g., "YYYY-MM"
  credentialUrl?: string;
}

export interface DocumentItem {
  id: string; // Added
  name: string;
  url: string; // URL to the document (mock for now)
  type: 'CV' | 'Certificate' | 'Reference' | 'Other';
}

export interface AvailabilityPreferences {
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  times: 'Morning' | 'Afternoon' | 'Full-Day' | 'Flexible';
  contractType: 'Full-time' | 'Part-time' | 'Internship' | 'Temporary' | 'Flexible';
  preferredAgeGroups: ('Infants' | 'Toddlers' | 'Preschool' | 'All')[];
}

export interface CandidateProfile {
  id: string;
  name: string; // Full Name
  email?: string; // Added
  phone?: string; // Added
  avatarUrl?: string;
  currentRoleOrTitle: string; // e.g., “Early Childhood Educator”
  location: string; // city/canton
  availabilityStatus: string; // e.g., “Available Immediately”, “Seeking Part-Time from Oct 2024”
  
  shortBio: string; // 2-3 lines, max ~250 chars
  
  skills: string[]; // Array for badges: “Bilingual FR/EN”, “Montessori Certified”
  
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  certifications?: CertificationItem[]; // Optional

  availabilityPreferences: AvailabilityPreferences;
  
  documents: DocumentItem[]; // For CV, diplomas, etc.

  // Original simpler fields - can be deprecated or mapped from detailed fields if needed.
  role: 'Educator' | 'Assistant' | 'Admin'; // Simplified role for quick filter
  availability: string; // Original availability string
  preferredRegion: string; // Original region preference
  resumeUrl?: string; // Can be derived from documents
  profileLink?: string; // Link to external profile like LinkedIn (optional)
  experience?: string; // Original experience summary
  languages?: string[]; // Original languages list
}


export interface HRDocument {
  id: string;
  title: string;
  category: string; // e.g., 'Staff Management', 'Child & Family Onboarding', etc.
  fileUrl: string; // Will be a mock URL or filename for now
  uploaderId: string;
  lastUpdated: string; // ISO date string
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  tags: string[];
  isFavorite?: boolean;
  language?: 'EN' | 'FR' | 'DE'; // New
  version?: string; // New, e.g., "v1.0"
  status?: 'Draft' | 'Published' | 'Archived'; // New
}

export enum ELearningContentType {
  VIDEO = 'Video',
  PDF = 'PDF',
  LINK = 'Link',
  COURSE = 'Course' // Existing 'Course' type can be used, this enum is for form selection
}

export interface Course {
  id: string;
  title: string;
  description: string;
  type: 'Course' | 'Video' | 'PDF' | 'Link'; // Updated to include 'Link'
  category: string; // e.g., "Child Safety", "Positive Discipline", "Pedagogy", "First Aid"
  duration?: string; // for videos/courses
  lessons?: number; // for courses
  fileUrl?: string; // for PDFs/videos/link URL
  thumbnailUrl?: string;
  updatedDate: string; // ISO date string
  language?: 'EN' | 'FR' | 'DE'; // New
  accessRoles?: UserRole[]; // New: Roles that can access this course
  tags?: string[]; // New: Added optional tags
  status?: 'Draft' | 'Published' | 'Archived'; // New
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  websiteUrl?: string;
  type: 'Institutional' | 'Academic' | 'Service';
  countryRegion?: string;
}

export enum PolicyType {
  REGULATION = 'Regulation',
  BEST_PRACTICE = 'Best-Practice',
  GUIDELINE = 'Guideline',
  UPDATE = 'Update'
}

export interface PolicyDocument {
  id:string;
  title: string;
  policyType?: PolicyType; 
  country?: string; 
  region?: string; 
  tags: string[]; 
  publishedDate: string; 
  lastUpdatedDate: string; 
  effectiveDate?: string; 
  contentPreview?: string; 
  externalLink?: string; 
  fileUrl?: string; 
  fileType?: 'PDF' | 'DOC';
  status?: 'Approved' | 'Upcoming' | 'In Review' | 'Draft' | 'Archived' | 'Published'; // Added Published
  isCritical?: boolean;
  language?: 'EN' | 'FR' | 'DE'; 
  category: 'Cantonal Policies' | 'National Regulations' | 'Compliance Requirements' | 'Updates & News' | 'Official Downloads';
}


export enum LeadMainStatus {
  NEW = 'New', 
  PROCESSING = 'Processing', 
  PARENT_ACTION_REQUIRED = 'Parent Action Required', 
  CLOSED_ENROLLED = 'Closed - Enrolled', 
  CLOSED_OTHER = 'Closed - Other', 
}

export enum FoundationLeadResponseStatus {
  NOT_RESPONDED = 'Not Responded',
  INTERESTED = 'Interested', 
  NOT_INTERESTED = 'Not Interested',
  NEEDS_MORE_INFO = 'Needs More Info', 
  ENROLLED = 'Enrolled', 
}

export interface FoundationResponse {
  foundationId: string;
  foundationName: string;
  status: FoundationLeadResponseStatus;
  messageToParent?: string; 
  responseDate?: string;
}

export interface ParentLead {
  id: string;
  parentId: string; 
  canton: string;
  municipality: string;
  childAge: number; 
  desiredStartDate: string; 
  specialNeeds?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  submissionDate: string; 
  mainStatus: LeadMainStatus;
  assignedFoundations: string[]; 
  responses: FoundationResponse[]; 
}

export enum OrderRequestStatus {
    SUBMITTED = 'Submitted', // Renamed from NEW to Submitted for clarity
    VIEWED_BY_SUPPLIER = 'ViewedBySupplier', // New, if supplier opens it
    ACCEPTED = 'Accepted', // Supplier confirms they can fulfill
    DECLINED = 'Declined', // Supplier cannot fulfill
    PROCESSING = 'Processing', // Added for orders that are accepted but not yet shipped
    SHIPPED = 'Shipped', // New
    FULFILLED = 'Fulfilled', // Equivalent to Delivered/Completed
    CANCELLED = 'Cancelled' // By foundation or supplier
}

export interface OrderRequest { // This is now for single product info requests, not multi-item orders.
  id: string;
  foundationId: string; 
  foundationOrgId: string; 
  productId: string;
  productName: string;
  supplierId: string; 
  quantity: number;
  notes?: string;
  status: OrderRequestStatus;
  requestDate: string; 
  supplierResponseDate?: string;
  expectedDeliveryDate?: string; // New
  shippingAddress?: string; // New
}

export enum ServiceRequestStatus {
    NEW = 'New',
    IN_REVIEW = 'In Review',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected', // New
    SCHEDULED = 'Scheduled', // New: For appointments
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled'
}

export interface ServiceRequest { 
    id: string;
    foundationId: string;
    foundationOrgId: string;
    serviceId: string;
    serviceName: string;
    providerId: string; 
    preferredDate?: string; 
    notes?: string;
    status: ServiceRequestStatus;
    requestDate: string;
    providerResponseDate?: string;
    appointmentDate?: string; // New
    internalNotes?: string; // New
}


// For State Policy Alerts
export enum PolicyAlertType {
  CRITICAL = 'Critical',
  INFO = 'Info',
}

export interface PolicyAlert {
  id: string;
  title: string;
  message: string;
  type: PolicyAlertType;
  regionScope: 'All' | string; 
  isActive: boolean;
  creationDate: string; 
  displayStartDate?: string; 
  displayEndDate?: string; 
}

// For Content Upload Modal
export type UploadableContentType = 'e-learning' | 'hr' | 'policy' | 'service';
export type LanguageCode = 'EN' | 'FR' | 'DE';

export const ELEARNING_CATEGORIES = ['Child Safety', 'Positive Discipline', 'Pedagogy', 'First Aid', 'Curriculum', 'Operational Management', 'Special Needs Support', 'Other'] as const;
export type ELearningCategory = typeof ELEARNING_CATEGORIES[number];

export const HR_CATEGORIES = ['Staff Management', 'Child & Family Onboarding', 'Daily Operations & Compliance', 'Policy & Legal Documents', 'Training & Certification', 'Templates & Letters'] as const;
export type HRCategory = typeof HR_CATEGORIES[number];

export const POLICY_TYPES_ENUM = ['Regulation', 'Best-Practice', 'Guideline', 'Update', 'Communique'] as const;
export type PolicyTypeEnum = typeof POLICY_TYPES_ENUM[number];

export const POLICY_BROAD_CATEGORIES = ['Cantonal Policies', 'National Regulations', 'Compliance Requirements', 'Updates & News', 'Official Downloads'] as const;
export type PolicyBroadCategory = typeof POLICY_BROAD_CATEGORIES[number];

export const SWISS_CANTONS = ["Zürich", "Bern", "Luzern", "Uri", "Schwyz", "Obwalden", "Nidwalden", "Glarus", "Zug", "Fribourg", "Solothurn", "Basel-Stadt", "Basel-Landschaft", "Schaffhausen", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "St. Gallen", "Graubünden", "Aargau", "Thurgau", "Ticino", "Vaud", "Valais", "Neuchâtel", "Geneva", "Jura"] as const;
export type SwissCanton = typeof SWISS_CANTONS[number];

// Cart and Order Types
export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  supplierId: string;
  supplierName: string;
  imageUrl?: string;
  stockStatus?: StockStatus;
}

export interface LineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  foundationId: string; // User ID
  foundationOrgId: string; // Organization ID
  supplierId: string; // Supplier's Organization ID
  supplierName: string; // Supplier's Name
  items: LineItem[];
  totalAmount: number;
  notes?: string;
  status: OrderRequestStatus; // Reuse OrderRequestStatus: NEW, ACCEPTED, SHIPPED, FULFILLED, etc.
  requestDate: string; // ISO Date
  // Optional: shippingAddress, expectedDeliveryDate (can be added by supplier)
}

// Messaging System Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string; // Denormalized for display
  senderRole: UserRole; // Added for styling/context
  content: string;
  timestamp: string; // ISO Date string
  isRead?: boolean; // Optional, can be expanded later
}

export interface Conversation {
  id: string;
  participantIds: string[]; // Array of User IDs
  participantNames: { [userId: string]: string }; // Map UserID to Name
  participantRoles: { [userId: string]: UserRole }; // Map UserID to Role
  lastMessageSnippet?: string;
  lastMessageTimestamp?: string;
  lastMessageSenderId?: string;
  // unreadCount specifically for the current viewing user, managed in context
}

// For Notifications
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  link?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string; // ISO string
}

// Settings Page Types
export type PreferredContactMethod = 'Email' | 'Phone' | 'Platform Form';
export type AvgResponseType = '< 24 h' | '2–3 d' | 'Other';
export type DigestFrequency = 'Daily' | 'Weekly' | 'None';
export type ConsultationLength = '30 min' | '60 min';
export type SupportedLanguage = 'EN' | 'FR' | 'DE';

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'Percentage' | 'FixedAmount' | 'FreeMinutes';
  value: number; // Percentage value or fixed amount or minutes
  expiryDate: string; // ISO Date string
  status: 'Active' | 'Expired' | 'Used';
  description?: string; // e.g., for FREE30MIN
}

export interface TeamMember {
  id: string;
  email: string;
  role: 'Viewer' | 'Editor'; // Simplified for now
  status: 'Pending' | 'Active';
}

export interface BaseSettings {
  companyName: string;
  logoUrl?: string;
  coverImageUrl?: string;
  aboutText: string;
  vatNumber?: string;
  regionsServed: SwissCanton[];
  languagesSpoken: SupportedLanguage[];
  preferredContactMethod: PreferredContactMethod;
  avgResponseType: AvgResponseType;
  externalBookingLink?: string;
  directOrderLink?: string; // New field for direct order URL
  newRequestEmailToggle: boolean;
  digestRadio: DigestFrequency;
  promoRedemptionAlertsToggle: boolean;
  autoRespondToggle: boolean;
  promoCodes: PromoCode[];
  currentTier?: string; // e.g., 'Basic', 'Premium'
  nextInvoiceDate?: string; // ISO Date string
  stripePortalLink?: string; // Link to manage Stripe subscription
  timeZone: string; // e.g., 'Europe/Zurich'
  currency: 'CHF' | 'EUR';
  anonymisedBenchmarkDataOptIn: boolean;
  teamMembers?: TeamMember[];
  hidePubliclyToggle: boolean; // Label changes based on role
  gdprDataDeletionRequestMade: boolean;
}

export interface SupplierSettings extends BaseSettings {
  defaultMOQ?: number;
  packSize?: number;
  autoAcceptOrderQtyLimit?: number;
}

export interface ProviderSettings extends BaseSettings {
  calComLink?: string;
  deliveryTypeToggleRemote: boolean; // "Delivery type toggle: Remote"
  defaultConsultationLength?: ConsultationLength;
}

export type SettingsFormData = SupplierSettings | ProviderSettings;

// Signup Page Specific Types
export enum SignupRole {
  FOUNDATION = 'Foundation (Daycare)',
  SUPPLIER = 'Product Supplier',
  SERVICE_PROVIDER = 'Service Provider',
  PARENT = 'Parent',
}

export interface SignupFormData {
  organisationName: string;
  contactPerson: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  canton: SwissCanton | '';
  languagesSpoken: SupportedLanguage[];
  capacity?: number;
  category: string;
  serviceType: string;
  childAge?: number;
  childStartDate: string;
  termsAccepted: boolean;
}


// This was in constants.ts, moved here to be accessible from ParentLeadFormPage directly
// It's still available in constants.ts which exports it from here.
export const MOCK_PARENT_USER: User = {
  id: 'parentUser001',
  name: 'Sophie Dubois',
  email: 'sophie.d@example.com',
  role: UserRole.PARENT,
  avatarUrl: 'https://picsum.photos/seed/sophiedubois/100/100',
  status: 'Active',
  lastLogin: '2024-07-21T09:00:00Z',
  region: 'Geneva',
};