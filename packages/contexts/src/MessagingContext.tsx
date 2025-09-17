

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
// FIX: Update import paths for monorepo structure
import { Message, Conversation, UserRole, User } from 'packages/core/src/types';
// FIX: Update import paths for monorepo structure
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, ALL_USERS_MOCK } from 'packages/core/src/constants';
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
  startConversation: (participants: {id: string, name: string, role: UserRole}[], groupName?: string) => string;
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
      isRead: true, // Sent by current user, so "read" by them
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

    // Simulate a reply after a short delay
    setTimeout(() => {
      const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
      if (!conversation) return;
      const otherParticipants = conversation.participantIds.filter(id => id !== currentUser.id);
      if (otherParticipants.length > 0) {
        const replierId = otherParticipants[0]; // Just pick the first other person to reply
        const replier = ALL_USERS_MOCK.find(u => u.id === replierId);
        if (replier) {
            const replyContent = `This is a simulated reply to: "${content}"`;
            const replyMessage: Message = {
                id: `msg${Date.now() + 1}`,
                conversationId,
                senderId: replier.id,
                senderName: replier.name,
                senderRole: replier.role,
                content: replyContent,
                timestamp: new Date().toISOString(),
                isRead: conversationId === activeConversationId, // Mark as read if user is watching
            };
            MOCK_MESSAGES.push(replyMessage);
            setMessagesByConversation(prev => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), replyMessage].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
            }));
            
            // Also update conversation list with new last message
            const updatedConvosWithReply = MOCK_CONVERSATIONS.map(conv =>
                conv.id === conversationId
                    ? { ...conv, lastMessageSnippet: replyContent, lastMessageTimestamp: replyMessage.timestamp, lastMessageSenderId: replier.id }
                    : conv
            );
            setConversations(updatedConvosWithReply);
            const mockConvIndexReply = MOCK_CONVERSATIONS.findIndex(c => c.id === conversationId);
            if (mockConvIndexReply !== -1) {
                MOCK_CONVERSATIONS[mockConvIndexReply] = {
                    ...MOCK_CONVERSATIONS[mockConvIndexReply],
                    lastMessageSnippet: replyContent,
                    lastMessageTimestamp: replyMessage.timestamp,
                    lastMessageSenderId: replier.id,
                };
            }
        }
      }
    }, 1500); // Wait 1.5 seconds
  };
  
  const startOrGetConversation = (recipientId: string, recipientName: string, recipientRole: UserRole): string => {
    if (!currentUser) throw new Error("No current user to start a conversation");

    // Find existing 1-on-1 conversation
    const existingConv = MOCK_CONVERSATIONS.find(conv => 
      conv.participantIds.length === 2 &&
      conv.participantIds.includes(currentUser.id) &&
      conv.participantIds.includes(recipientId)
    );

    if (existingConv) {
      return existingConv.id;
    }

    // Create a new conversation
    const newConversation: Conversation = {
      id: `conv_${currentUser.id}_${recipientId}_${Date.now()}`,
      participantIds: [currentUser.id, recipientId],
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
      lastMessageSenderId: currentUser.id,
    };

    MOCK_CONVERSATIONS.push(newConversation);
    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  };
  
  const startConversation = (participants: {id: string, name: string, role: UserRole}[], groupName?: string): string => {
    if (!currentUser) throw new Error("No current user to start a conversation");
    
    const allParticipants = [...participants, {id: currentUser.id, name: currentUser.name, role: currentUser.role}];
    
    const newConversation: Conversation = {
        id: `conv_group_${Date.now()}`,
        name: groupName || allParticipants.map(p => p.name).join(', '),
        participantIds: allParticipants.map(p => p.id),
        participantNames: allParticipants.reduce((acc, p) => ({...acc, [p.id]: p.name}), {}),
        participantRoles: allParticipants.reduce((acc, p) => ({...acc, [p.id]: p.role}), {}),
        lastMessageTimestamp: new Date().toISOString(),
    };
    
    MOCK_CONVERSATIONS.push(newConversation);
    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  };

  // FIX: Added missing return statement for the provider
  return (
    <MessagingContext.Provider value={{
      conversations,
      messagesByConversation,
      activeConversationId,
      setActiveConversationId,
      loadUserConversations,
      loadMessagesForConversation,
      sendMessage,
      startOrGetConversation,
      startConversation,
      getUnreadCountForConversation,
    }}>
      {children}
    </MessagingContext.Provider>
  );
};

// FIX: Added export for useMessaging hook
export const useMessaging = (): MessagingContextType => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
