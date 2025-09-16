
import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useEffect, useCallback } from 'react';
import { User, UserRole, ParentLead, LeadMainStatus, SupportedLanguage } from '../types'; // Added SupportedLanguage
import { 
  MOCK_FOUNDATION_USER, 
  MOCK_PARENT_LEADS,
  // MOCK_ADMIN_USER, // Retained for potential Admin role testing if distinct from SuperAdmin - REMOVED as it's not exported and not used
  MOCK_SUPER_ADMIN_USER,
  MOCK_SUPPLIER_USER,
  MOCK_SERVICE_PROVIDER_USER,
  MOCK_EDUCATOR_USER,
  MOCK_PARENT_USER
} from '../constants';
import i18n from '../i18n'; // Import i18n instance

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  leads: ParentLead[];
  setLeads: Dispatch<SetStateAction<ParentLead[]>>;
  submitParentLead: (leadData: Omit<ParentLead, 'id' | 'submissionDate' | 'mainStatus' | 'assignedFoundations' | 'responses' | 'parentId'>) => void;
  favoriteCandidateIds: string[];
  toggleFavoriteCandidate: (candidateId: string) => void;
  isCandidateFavorite: (candidateId: string) => boolean;
  language: SupportedLanguage;
  setLanguage: Dispatch<SetStateAction<SupportedLanguage>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Default to null, login page will handle initial user
  const [leads, setLeads] = useState<ParentLead[]>(MOCK_PARENT_LEADS);
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const detectedLng = i18n.language?.toUpperCase().split('-')[0];
    if (detectedLng === 'FR' || detectedLng === 'DE') {
      return detectedLng as SupportedLanguage;
    }
    return 'EN';
  });
  const [favoriteCandidateIds, setFavoriteCandidateIds] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem('favoriteCandidateIds');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // Update i18next language when context language changes
  useEffect(() => {
    const newLangCode = language.toLowerCase();
    if (i18n.language !== newLangCode) {
      i18n.changeLanguage(newLangCode);
    }
  }, [language]);

  // Update context language and document title when i18next language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const newSupportedLang = lng.toUpperCase().split('-')[0] as SupportedLanguage;
      if (['EN', 'FR', 'DE'].includes(newSupportedLang) && newSupportedLang !== language) {
        setLanguage(newSupportedLang);
      }
      document.documentElement.lang = lng.split('-')[0];
      document.title = i18n.t('appName');
    };

    i18n.on('languageChanged', handleLanguageChanged);
    
    if (i18n.isInitialized) {
        document.title = i18n.t('appName');
        document.documentElement.lang = i18n.language.split('-')[0];
    } else {
        i18n.on('initialized', (_options) => { 
             document.title = i18n.t('appName');
             document.documentElement.lang = i18n.language.split('-')[0];
             const detectedLngOnInit = i18n.language?.toUpperCase().split('-')[0] as SupportedLanguage;
             if (['EN', 'FR', 'DE'].includes(detectedLngOnInit) && detectedLngOnInit !== language) {
                setLanguage(detectedLngOnInit);
             }
        });
    }
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [language]);


  useEffect(() => {
    // SECURITY: The (window as any).switchUser function has been removed
    // as it poses a security risk by allowing arbitrary role switching
    // in a development or production environment.
    // Proper authentication and authorization should be handled by a backend.

    // Initial HTML lang attribute set
    document.documentElement.lang = language.toLowerCase();
  }, [language]); 

  const submitParentLead = useCallback((leadData: Omit<ParentLead, 'id' | 'submissionDate' | 'mainStatus' | 'assignedFoundations' | 'responses'| 'parentId'>) => {
    const newLead: ParentLead = {
      ...leadData,
      id: `lead${Date.now()}`,
      parentId: currentUser?.id || `anon${Date.now()}`, // Use actual parent ID if logged in
      submissionDate: new Date().toISOString(),
      mainStatus: LeadMainStatus.NEW,
      assignedFoundations: [], 
      responses: [],
    };
    setLeads(prevLeads => [newLead, ...prevLeads]);
  }, [currentUser]);

  const toggleFavoriteCandidate = useCallback((candidateId: string) => {
    setFavoriteCandidateIds(prev => {
      const newFavorites = prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId];
      localStorage.setItem('favoriteCandidateIds', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isCandidateFavorite = useCallback((candidateId: string): boolean => {
    return favoriteCandidateIds.includes(candidateId);
  }, [favoriteCandidateIds]);

  return (
    <AppContext.Provider value={{ 
        currentUser, 
        setCurrentUser, 
        leads, 
        setLeads, 
        submitParentLead,
        favoriteCandidateIds,
        toggleFavoriteCandidate,
        isCandidateFavorite,
        language, 
        setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
