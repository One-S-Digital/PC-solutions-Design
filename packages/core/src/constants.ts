

import { UserRole, User, Product, Service, JobListing, CandidateProfile, Partner, HRDocument, Course, PolicyDocument, ParentLead, Organization, PolicyAlert, PolicyAlertType, ServiceRequest, OrderRequest, Order, Message, Conversation, AppNotification, SupplierSettings, ProviderSettings, Application, PricingPlan, ContentModerationItem, SystemMetric, LogEntry, SecurityAlert, PlatformSettings, SWISS_CANTONS } from './types';

export const APP_NAME = "Pro Crèche Solutions";

const COMMON_INPUT_CLASSES_BASE = "block w-full bg-white placeholder-gray-400 shadow-sm border border-gray-300 rounded-button focus:outline-none focus:ring-1 focus:ring-swiss-mint focus:border-swiss-mint";
const COMMON_INPUT_CLASSES_PADDING_DEFAULT = "px-3 py-2";
const COMMON_INPUT_CLASSES_PADDING_ICON = "pl-10 pr-3 py-2";

export const STANDARD_INPUT_FIELD = `${COMMON_INPUT_CLASSES_BASE} ${COMMON_INPUT_CLASSES_PADDING_DEFAULT}`;
export const ICON_INPUT_FIELD = `${COMMON_INPUT_CLASSES_BASE} ${COMMON_INPUT_CLASSES_PADDING_ICON}`;

// Mock Data
export const MOCK_FOUNDATION_ORG_KINDERWELT: Organization = { id: 'orgKinderwelt123', name: 'Crèche KinderWelt (Vaud)', type: 'foundation', region: 'Vaud' };
export const MOCK_SUPPLIER_ORGANIZATION: Organization = { id: 'orgEcoGoodsGlobal', name: 'EcoGoods Global Supplies', type: 'supplier', region: 'Zürich' };
export const MOCK_SERVICE_PROVIDER_ORGANIZATION: Organization = { id: 'orgProCleanSolutions', name: 'ProClean Solutions GmbH', type: 'service_provider', region: 'Geneva' };

export const MOCK_FOUNDATION_USER: User = { id: 'userFoundation123', name: 'Astrid L.', email: 'astrid.l@example-foundation.com', role: UserRole.FOUNDATION, orgId: 'orgKinderwelt123', orgName: 'Crèche KinderWelt (Vaud)', avatarUrl: 'https://picsum.photos/seed/astrid/100/100' };
export const MOCK_PARENT_USER: User = { id: 'parentUser001', name: 'Sophie Dubois', email: 'sophie.d@example.com', role: UserRole.PARENT, avatarUrl: 'https://picsum.photos/seed/sophiedubois/100/100' };
export const MOCK_SUPER_ADMIN_USER: User = { id: 'adminPCS001', name: 'PCS Super Admin', email: 'superadmin@example-pcs.com', role: UserRole.SUPER_ADMIN, avatarUrl: 'https://picsum.photos/seed/adminpcs/100/100' };
export const MOCK_SUPPLIER_USER: User = { id: 'supplierUser001', name: 'Max W.', email: 'max.w@example-supplier.com', role: UserRole.PRODUCT_SUPPLIER, orgId: 'orgEcoGoodsGlobal', orgName: 'EcoGoods Global Supplies', avatarUrl: 'https://picsum.photos/seed/maxweber/100/100' };
export const MOCK_SERVICE_PROVIDER_USER: User = { id: 'serviceProviderUser001', name: 'Lena A.', email: 'lena.a@example-provider.com', role: UserRole.SERVICE_PROVIDER, orgId: 'orgProCleanSolutions', orgName: 'ProClean Solutions GmbH', avatarUrl: 'https://picsum.photos/seed/lenaalthaus/100/100' };
export const MOCK_EDUCATOR_USER: User = { id: 'educatorUser001', name: 'Tom F.', email: 'tom.f@example-edu.com', role: UserRole.EDUCATOR, avatarUrl: 'https://picsum.photos/seed/tomfischer/100/100' };

export const ALL_USERS_MOCK: User[] = [ MOCK_FOUNDATION_USER, MOCK_PARENT_USER, MOCK_SUPER_ADMIN_USER, MOCK_SUPPLIER_USER, MOCK_SERVICE_PROVIDER_USER, MOCK_EDUCATOR_USER ];
export const MOCK_ORGANIZATIONS: Organization[] = [ MOCK_FOUNDATION_ORG_KINDERWELT, MOCK_SUPPLIER_ORGANIZATION, MOCK_SERVICE_PROVIDER_ORGANIZATION ];

// Initialize other mock data arrays as empty. They will be populated by the application's interactions.
export const MOCK_PRODUCTS: Product[] = [];
export const MOCK_SERVICES: Service[] = [];
export const MOCK_JOB_LISTINGS: JobListing[] = [];
export const MOCK_CANDIDATE_PROFILES: CandidateProfile[] = [];
export const MOCK_PARTNERS: Partner[] = [];
export const MOCK_HR_DOCS: HRDocument[] = [];
export const MOCK_COURSES: Course[] = [];
export const MOCK_POLICY_DOCS: PolicyDocument[] = [];
export const MOCK_POLICY_ALERTS: PolicyAlert[] = [];
export const MOCK_PARENT_LEADS: ParentLead[] = [];
export const MOCK_ORDERS: Order[] = [];
// FIX: Add missing export
export const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [];
export const MOCK_APPLICATIONS: Application[] = [];
export const MOCK_CONVERSATIONS: Conversation[] = [];
export const MOCK_MESSAGES: Message[] = [];
export const MOCK_PRICING_PLANS: PricingPlan[] = [];
export const MOCK_CONTENT_QUEUE: ContentModerationItem[] = [];
export const MOCK_SYSTEM_METRICS: SystemMetric[] = [];
export const MOCK_LOG_ENTRIES: LogEntry[] = [];
export const MOCK_SECURITY_ALERTS: SecurityAlert[] = [];
export const MOCK_PLATFORM_SETTINGS: PlatformSettings = { platformName: "Pro Crèche Solutions", metadataDescription: "A centralized digital ecosystem for childcare in Switzerland.", logoUrl: "", faviconUrl: "" };
export const MOCK_SUPPLIER_SETTINGS: SupplierSettings = {} as SupplierSettings;
export const MOCK_PROVIDER_SETTINGS: ProviderSettings = {} as ProviderSettings;
export const COUNTRIES_FOR_POLICIES = ['Switzerland', 'France', 'Germany'] as const;
export const REGIONS_BY_COUNTRY = {
    'Switzerland': [...SWISS_CANTONS],
    'France': ['Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté'],
    'Germany': ['Baden-Württemberg', 'Bavaria']
};
