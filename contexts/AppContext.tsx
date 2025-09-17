
import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useEffect, useCallback } from 'react';
// FIX: Update import paths for monorepo structure
import { User, UserRole, ParentLead, LeadMainStatus, SupportedLanguage, SignupFormData, SignupRole, JobListing, Application, ApplicationStatus, DocumentItem, PlatformSettings } from 'packages/core/src/types'; 
// FIX: Update import paths for monorepo structure
import { 
  ALL_USERS_MOCK,
  MOCK_PARENT_LEADS,
  MOCK_APPLICATIONS,
  MOCK_JOB_LISTINGS,
  MOCK_CANDIDATE_PROFILES,
  MOCK_PLATFORM_SETTINGS
} from 'packages/core/src/constants';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  signup: (formData: SignupFormData, role: SignupRole) => Promise<{ success: boolean; message?: string }>;
  leads: ParentLead[];
  setLeads: Dispatch<SetStateAction<ParentLead[]>>;
  submitParentLead: (leadData: Omit<ParentLead, 'id' | 'submissionDate' | 'mainStatus' | 'assignedFoundations' | 'responses' | 'parentId'>) => void;
  favoriteCandidateIds: string[];
  toggleFavoriteCandidate: (candidateId: string) => void;
  isCandidateFavorite: (candidateId: string) => boolean;
  language: SupportedLanguage;
  setLanguage: Dispatch<SetStateAction<SupportedLanguage>>;
  applications: Application[];
  applyForJob: (job: JobListing) => { success: boolean, message: string };
  userFiles: DocumentItem[];
  addUserFile: (file: File) => void;
  deleteUserFile: (fileId: string) => void;
  renameUserFile: (fileId: string, newName: string) => void;
  platformSettings: PlatformSettings;
  setPlatformSettings: Dispatch<SetStateAction<PlatformSettings>>;
  updateCurrentUserInfo: (updatedInfo: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// In-memory store for mock users, initialized with constants
const mockUserStore = [...ALL_USERS_MOCK];

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<ParentLead[]>(MOCK_PARENT_LEADS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [userFiles, setUserFiles] = useState<DocumentItem[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(MOCK_PLATFORM_SETTINGS);
  // FIX: Simplified language state, removing direct dependency on i18n instance from shared context
  const [language, setLanguage] = useState<SupportedLanguage>('EN');
  const [favoriteCandidateIds, setFavoriteCandidateIds] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem('favoriteCandidateIds');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    if(currentUser?.role === UserRole.EDUCATOR) {
        // Find the full candidate profile to get their documents
        const profile = MOCK_CANDIDATE_PROFILES.find(p => p.email === currentUser.email);
        if(profile) {
            setUserFiles(profile.documents);
        }
    } else {
        setUserFiles([]);
    }
  }, [currentUser]);


  const login = async (email: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise(resolve => {
      setTimeout(() => { // Simulate network delay
        const user = mockUserStore.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          setCurrentUser(user);
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'Invalid credentials. Please try again.' });
        }
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signup = async (formData: SignupFormData, role: SignupRole): Promise<{ success: boolean; message?: string }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (mockUserStore.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
                resolve({ success: false, message: 'An account with this email already exists.' });
                return;
            }

            const newUser: User = {
                id: `user_${Date.now()}`,
                name: formData.contactPerson,
                email: formData.email,
                role: role as unknown as UserRole, // Map SignupRole to UserRole
                orgName: formData.organisationName,
                orgId: formData.organisationName ? `org_${Date.now()}` : undefined,
                avatarUrl: `https://ui-avatars.com/api/?name=${formData.contactPerson.replace(' ', '+')}&background=random`,
                status: 'Active',
                lastLogin: new Date().toISOString(),
                region: formData.canton || undefined,
            };
            
            mockUserStore.push(newUser);
            setCurrentUser(newUser);
            resolve({ success: true });
        }, 500);
    });
  };


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

  const applyForJob = useCallback((job: JobListing): { success: boolean, message: string } => {
    if (!currentUser || currentUser.role !== UserRole.EDUCATOR) {
        return { success: false, message: 'Only educators can apply for jobs.'};
    }

    const alreadyApplied = applications.some(app => app.jobId === job.id && app.educatorId === currentUser.id);
    if (alreadyApplied) {
        return { success: false, message: `You have already applied for "${job.title}".`};
    }

    const newApplication: Application = {
        id: `app_${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        foundationName: job.foundationName,
        educatorId: currentUser.id,
        educatorName: currentUser.name,
        status: ApplicationStatus.NEW,
        applicationDate: new Date().toISOString(),
    };
    
    setApplications(prev => [newApplication, ...prev]);

    // Update the applicationsReceived count in the mock data
    const jobInList = MOCK_JOB_LISTINGS.find(j => j.id === job.id);
    if (jobInList) {
        jobInList.applicationsReceived += 1;
    }
    
    return { success: true, message: `Successfully applied for "${job.title}"!`};
  }, [currentUser, applications]);

  const addUserFile = useCallback((file: File) => {
    const newFile: DocumentItem = {
        id: `file_${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file), // Mock URL
        type: 'Other', // Could try to determine from file.type
        uploadDate: new Date().toISOString(),
        size: file.size,
    };
    setUserFiles(prev => [...prev, newFile]);
  }, []);

  const deleteUserFile = useCallback((fileId: string) => {
    setUserFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const renameUserFile = useCallback((fileId: string, newName: string) => {
    setUserFiles(prev => prev.map(f => f.id === fileId ? {...f, name: newName} : f));
  }, []);

  const updateCurrentUserInfo = useCallback((updatedInfo: Partial<User>) => {
    if (currentUser) {
        setCurrentUser(prevUser => prevUser ? { ...prevUser, ...updatedInfo } : null);
        // Also update the master list for mock persistence
        const userIndex = mockUserStore.findIndex(u => u.id === currentUser.id);
        if (userIndex > -1) {
            mockUserStore[userIndex] = { ...mockUserStore[userIndex], ...updatedInfo };
        }
    }
  }, [currentUser]);


  return (
    <AppContext.Provider value={{ 
        currentUser, 
        setCurrentUser, 
        login,
        logout,
        signup,
        leads, 
        setLeads, 
        submitParentLead,
        favoriteCandidateIds,
        toggleFavoriteCandidate,
        isCandidateFavorite,
        language, 
        setLanguage,
        applications,
        applyForJob,
        userFiles,
        addUserFile,
        deleteUserFile,
        renameUserFile,
        platformSettings,
        setPlatformSettings,
        updateCurrentUserInfo
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