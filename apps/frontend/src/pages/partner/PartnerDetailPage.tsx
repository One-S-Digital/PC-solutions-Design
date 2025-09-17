
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Organization, Product, Service, UserRole, StockStatus, ServiceRequest, ServiceRequestStatus } from 'packages/core/src/types';
import { MOCK_ORGANIZATIONS, MOCK_PRODUCTS, MOCK_SERVICES, STANDARD_INPUT_FIELD } from 'packages/core/src/constants';
import { useAppContext } from 'packages/contexts/src/AppContext';
import { useCart } from 'packages/contexts/src/CartContext';
import Card from 'packages/ui/src/components/Card';
import Button from 'packages/ui/src/components/Button';
import ServiceRequestModal from '../../components/marketplace/ServiceRequestModal';
import QuantityInput from 'packages/ui/src/components/QuantityInput';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, MapPinIcon, PlusCircleIcon, ListBulletIcon, ArrowTopRightOnSquareIcon, CogIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface ProductItemProps {
  product: Product;
  partner: Organization;
  isFoundationUser: boolean;
  onAddToCart: (product: Product, quantity: number, supplier: Organization) => void;
}

const ProductItemCard: React.FC<ProductItemProps> = ({ product, partner, isFoundationUser, onAddToCart }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  const getStockStatusColor = (status?: StockStatus) => {
    if (status === 'In Stock') return 'text-green-600';
    if (status === 'Low Stock') return 'text-orange-500';
    if (status === 'Out of Stock') return 'text-red-500';
    return 'text-gray-500';
  };
  
  const handleAddToCartClick = () => {
    if (product.stockStatus === 'Out of Stock') {
        alert(t('partnerDetailPage.productOutOfStock', {productName: product.title}));
        return;
    }
    onAddToCart(product, quantity, partner);
    alert(t('partnerDetailPage.productAddedToOrder', {quantity, productName: product.title}));
  };

  return (
    <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group hover:shadow-md transition-shadow">
      <img src={product.imageUrl || `https://picsum.photos/seed/${product.id}/100/100`} alt={product.title} className="w-full sm:w-24 h-24 object-cover rounded-md flex-shrink-0" />
      <div className="flex-grow">
        <h3 className="text-md font-semibold text-swiss-charcoal group-hover:text-swiss-mint">{product.title}</h3>
        <p className="text-xs text-gray-500">{product.category}</p>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center space-x-3 mt-1.5">
          {product.price && <p className="text-md font-semibold text-swiss-teal">CHF {product.price.toFixed(2)}</p>}
          {product.stockStatus && <p className={`text-xs font-medium ${getStockStatusColor(product.stockStatus)}`}>{t(`stockStatus.${product.stockStatus.replace(/\s+/g, '').toLowerCase()}`, product.stockStatus) as string}</p>}
        </div>
      </div>
      {isFoundationUser && (
        <div className="mt-2 sm:mt-0 sm:ml-auto flex flex-col items-end space-y-2 flex-shrink-0">
          <QuantityInput 
            quantity={quantity} 
            onQuantityChange={setQuantity}
            stockStatus={product.stockStatus}
          />
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={ShoppingCartIcon}
            onClick={handleAddToCartClick}
            disabled={product.stockStatus === 'Out of Stock'}
            className="w-full sm:w-auto"
          >
            {t('partnerDetailPage.addToOrderButton')}
          </Button>
        </div>
      )}
    </Card>
  );
};

const PartnerDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  const cart = useCart();
  
  const [partner, setPartner] = useState<Organization | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isServiceRequestModalOpen, setIsServiceRequestModalOpen] = useState(false);
  const [selectedServiceForRequest, setSelectedServiceForRequest] = useState<Service | null>(null);
  
  useEffect(() => {
    if (partnerId) {
      const foundPartner = MOCK_ORGANIZATIONS.find(org => org.id === partnerId);
      setPartner(foundPartner || null);
      if (foundPartner) {
        if (foundPartner.type === 'supplier') {
          setProducts(MOCK_PRODUCTS.filter(p => p.supplierId === partnerId));
        } else if (foundPartner.type === 'service_provider') {
          setServices(MOCK_SERVICES.filter(s => s.providerId === partnerId));
        }
      }
    }
  }, [partnerId]);
  
  const isFoundationUser = currentUser?.role === UserRole.FOUNDATION;

  const handleOpenServiceRequestModal = (service: Service) => {
    setSelectedServiceForRequest(service);
    setIsServiceRequestModalOpen(true);
  };

  const handleSubmitServiceRequest = (requestData: Omit<ServiceRequest, 'id' | 'requestDate' | 'status' | 'foundationId' | 'foundationOrgId' | 'providerId' | 'serviceName' | 'serviceId'>) => {
    // In a real app, this would call a context method or API
    console.log("New Service Request Submitted:", requestData);
    setIsServiceRequestModalOpen(false);
    alert(t('partnerDetailPage.requestSubmittedAlert', {serviceName: selectedServiceForRequest?.title}));
  };

  if (!partner) {
    return (
      <div className="p-6 text-center">
        <CogIcon className="w-12 h-12 mx-auto text-gray-400 animate-spin" />
        <p className="mt-4 text-gray-600">{t('partnerDetailPage.loadingPartnerDetails')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={ArrowLeftIcon}>
        {t('buttons.goBack')}
      </Button>

      <Card className="overflow-hidden">
        <div className="h-48 bg-gray-200 relative">
          <img src={partner.coverImageUrl || `https://picsum.photos/seed/${partner.id}Cover/1200/300`} alt={`${partner.name} cover`} className="w-full h-full object-cover" />
          <img src={partner.logoUrl || `https://picsum.photos/seed/${partner.id}/100/100`} alt={`${partner.name} logo`} className="absolute bottom-4 left-6 w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white" />
        </div>
        <div className="p-6 pt-14 sm:pt-6 sm:pl-36">
          <h1 className="text-3xl font-bold text-swiss-charcoal">{partner.name}</h1>
          <p className="text-gray-500">{partner.type === 'supplier' ? t('userRoles.Product Supplier') : t('userRoles.Service Provider')}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-3">{t('partnerDetailPage.contactInfoTitle')}</h2>
            <div className="space-y-2 text-sm text-gray-700">
              {partner.address && <p className="flex items-start"><MapPinIcon className="w-5 h-5 mr-2 mt-0.5 text-gray-400" /> {partner.address}</p>}
              {partner.phone && <p className="flex items-center"><PhoneIcon className="w-5 h-5 mr-2 text-gray-400" /> <a href={`tel:${partner.phone}`}>{partner.phone}</a></p>}
              {partner.email && <p className="flex items-center"><EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400" /> <a href={`mailto:${partner.email}`}>{partner.email}</a></p>}
              {partner.website && <p className="flex items-center"><GlobeAltIcon className="w-5 h-5 mr-2 text-gray-400" /> <a href={partner.website} target="_blank" rel="noreferrer">{partner.website}</a></p>}
            </div>
          </Card>
          {partner.description && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-swiss-charcoal mb-3">{t('partnerDetailPage.aboutTitle', { partnerName: partner.name })}</h2>
              <p className="text-sm text-gray-600">{partner.description}</p>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">
              {partner.type === 'supplier' ? t('sidebar.products') : t('sidebar.services')}
            </h2>
            {partner.type === 'supplier' && (
              products.length > 0 ? (
                <div className="space-y-4">
                  {products.map(product => <ProductItemCard key={product.id} product={product} partner={partner} isFoundationUser={isFoundationUser} onAddToCart={cart.addToCart} />)}
                </div>
              ) : <p>{t('partnerDetailPage.noProductsListed')}</p>
            )}
            {partner.type === 'service_provider' && (
              services.length > 0 ? (
                <div className="space-y-4">
                  {services.map(service => (
                    <Card key={service.id} className="p-4 flex">
                      <div className="flex-grow">
                        <h3 className="font-semibold">{service.title}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <Button onClick={() => handleOpenServiceRequestModal(service)}>{t('partnerDetailPage.requestServiceButton')}</Button>
                    </Card>
                  ))}
                </div>
              ) : <p>{t('partnerDetailPage.noServicesListed')}</p>
            )}
          </Card>
        </div>
      </div>
      
      <ServiceRequestModal
        isOpen={isServiceRequestModalOpen}
        onClose={() => setIsServiceRequestModalOpen(false)}
        service={selectedServiceForRequest}
        onSubmitRequest={handleSubmitServiceRequest}
      />
    </div>
  );
};

export default PartnerDetailPage;
