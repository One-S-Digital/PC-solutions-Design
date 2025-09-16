
import React, { useState, useEffect, useRef } from 'react';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAppContext } from '../../contexts/AppContext';
import MessageBubble from './MessageBubble';
import Button from '../ui/Button';
import { PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const ChatWindow: React.FC = () => {
  const { t } = useTranslation();
  const { activeConversationId, messagesByConversation, sendMessage, conversations } = useMessaging();
  const { currentUser } = useAppContext();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversationId ? messagesByConversation[activeConversationId] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeConversationId) {
      sendMessage(activeConversationId, newMessage.trim());
      setNewMessage('');
    }
  };

  if (!activeConversationId || !activeConversation) {
    return (
        <div className="flex-grow flex items-center justify-center text-gray-400">
            {t('messagesPage.selectConversationToView')}
        </div>
    );
  }

  const otherParticipantId = activeConversation.participantIds.find(id => id !== currentUser?.id);
  const otherParticipantName = otherParticipantId ? activeConversation.participantNames[otherParticipantId] : t('messagesPage.conversationFallbackTitle');


  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center space-x-3 sticky top-0 bg-white z-10">
        <UserCircleIcon className="w-8 h-8 text-gray-400" /> {/* Placeholder avatar */}
        <h2 className="text-lg font-semibold text-swiss-charcoal">{otherParticipantName}</h2>
        {/* Add online status or other info if available */}
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-1">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('messagesPage.typeMessagePlaceholder')}
            className="flex-grow p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-swiss-mint focus:border-transparent outline-none text-sm shadow-sm"
            autoFocus
            aria-label={t('messagesPage.typeMessagePlaceholder')}
          />
          <Button type="submit" variant="primary" size="md" className="!p-2.5" aria-label={t('buttons.sendMessage')}>
            <PaperAirplaneIcon className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
