
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Message, Conversation, UserRole } from '../types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, ALL_USERS_MOCK } from '../constants';
import { useAppContext } from './AppContext';

interface MessagingContextType {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
  activeConversationId: string | null;
  setActiveConversationId: (conversationId: string | null) => void;
  loadUserConversations: () => void;
  loadMessagesForConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void; // Recipient is implicit from conversation
  startOrGetConversation: (recipientId: string, recipientName: string, recipientRole: UserRole) => string; // Returns conversationId
  getUnreadCountForConversation: (conversationId: string) => number;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAppContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const loadUserConversations = useCallback(() => {
    if (currentUser) {
      const userConvs = MOCK_CONVERSATIONS.filter(conv => conv.participantIds.includes(currentUser.id));
      setConversations(userConvs);
      // Preload messages for these conversations
      userConvs.forEach(conv => {
        const convMessages = MOCK_MESSAGES.filter(msg => msg.conversationId === conv.id).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setMessagesByConversation(prev => ({ ...prev, [conv.id]: convMessages }));
      });
    } else {
      setConversations([]);
      setMessagesByConversation({});
    }
  }, [currentUser]);

  useEffect(() => {
    loadUserConversations();
  }, [currentUser, loadUserConversations]);

  const loadMessagesForConversation = (conversationId: string) => {
    if (!messagesByConversation[conversationId]) {
      const convMessages = MOCK_MESSAGES.filter(msg => msg.conversationId === conversationId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessagesByConversation(prev => ({ ...prev, [conversationId]: convMessages }));
    }
    setActiveConversationId(conversationId);
    markConversationAsRead(conversationId);
  };
  
  const getUnreadCountForConversation = (conversationId: string): number => {
    if (!currentUser) return 0;
    const convMessages = messagesByConversation[conversationId] || MOCK_MESSAGES.filter(msg => msg.conversationId === conversationId);
    return convMessages.filter(msg => msg.senderId !== currentUser.id && !msg.isRead).length;
  };

  const markConversationAsRead = (conversationId: string) => {
     if (!currentUser) return;
    // Mock: Update local MOCK_MESSAGES and then state
    MOCK_MESSAGES.forEach(msg => {
      if (msg.conversationId === conversationId && msg.senderId !== currentUser.id) {
        msg.isRead = true;
      }
    });
    // Update state for UI
    setMessagesByConversation(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => 
        msg.senderId !== currentUser.id ? { ...msg, isRead: true } : msg
      )
    }));
    // Update conversation list to reflect unread count change (optional for this mock, can be complex)
     setConversations(prevConvs => prevConvs.map(c => {
        if (c.id === conversationId) {
            // This is a simplification. A real unread count would be stored per user per conversation.
            // For now, we'll just assume it gets cleared for the active user.
            return {...c}; // No direct unreadCount field on Conversation mock currently
        }
        return c;
    }));
  };


  const sendMessage = (conversationId: string, content: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      content,
      timestamp: new Date().toISOString(),
      isRead: false, // Sent by current user, so "read" by them
    };

    MOCK_MESSAGES.push(newMessage);
    setMessagesByConversation(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    }));

    // Update conversation's last message
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId
        ? { ...conv, lastMessageSnippet: content, lastMessageTimestamp: newMessage.timestamp, lastMessageSenderId: currentUser.id }
        : conv
    );
    // Also update the MOCK_CONVERSATIONS for persistence in mock
     const mockConvIndex = MOCK_CONVERSATIONS.findIndex(c => c.id === conversationId);
     if (mockConvIndex !== -1) {
         MOCK_CONVERSATIONS[mockConvIndex] = {
             ...MOCK_CONVERSATIONS[mockConvIndex],
             lastMessageSnippet: content,
             lastMessageTimestamp: newMessage.timestamp,
             lastMessageSenderId: currentUser.id,
         };
     }
    setConversations(updatedConversations);
  };

  const startOrGetConversation = (recipientId: string, recipientName: string, recipientRole: UserRole): string => {
    if (!currentUser) throw new Error("User not logged in");

    const participantIds = [currentUser.id, recipientId].sort();
    let conversation = MOCK_CONVERSATIONS.find(
      conv => conv.participantIds.length === 2 && conv.participantIds.every(pid => participantIds.includes(pid))
    );

    if (!conversation) {
      const newConversationId = `conv${Date.now()}`;
      conversation = {
        id: newConversationId,
        participantIds,
        participantNames: {
          [currentUser.id]: currentUser.name,
          [recipientId]: recipientName,
        },
        participantRoles: {
            [currentUser.id]: currentUser.role,
            [recipientId]: recipientRole,
        },
        lastMessageSnippet: 'Conversation started.',
        lastMessageTimestamp: new Date().toISOString(),
        lastMessageSenderId: currentUser.id, // System or current user
      };
      MOCK_CONVERSATIONS.push(conversation);
      setConversations(prev => [...prev, conversation!]);
      setMessagesByConversation(prev => ({ ...prev, [newConversationId]: [] })); // Initialize messages for new conv
    }
    
    setActiveConversationId(conversation.id);
    return conversation.id;
  };


  return (
    <MessagingContext.Provider value={{ 
        conversations, 
        messagesByConversation, 
        activeConversationId, 
        setActiveConversationId: loadMessagesForConversation, // This sets active ID and loads messages
        loadUserConversations, 
        loadMessagesForConversation, 
        sendMessage,
        startOrGetConversation,
        getUnreadCountForConversation
    }}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = (): MessagingContextType => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
