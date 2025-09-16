
import React from 'react';
import { Conversation }
from '../../types';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (conversationId: string) => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, isActive, onSelect }) => {
  const { t } = useTranslation();
  const { currentUser } = useAppContext();
  const { getUnreadCountForConversation } = useMessaging();

  if (!currentUser) return null;

  const otherParticipantId = conversation.participantIds.find(id => id !== currentUser.id);
  const otherParticipantName = otherParticipantId ? conversation.participantNames[otherParticipantId] : t('messagesPage.unknownUser');
  const unreadCount = getUnreadCountForConversation(conversation.id);

  // Determine avatar: if group chat, use a generic group icon, else use other participant's avatar initials
  const avatarText = conversation.participantIds.length > 2 ? t('messagesPage.groupInitials') : otherParticipantName?.substring(0, 2).toUpperCase() || '??';
  const avatarColor = otherParticipantId ? `bg-swiss-teal` : 'bg-gray-400'; // Example color


  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`w-full text-left px-3 py-3.5 rounded-lg transition-colors duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-swiss-mint/50
        ${isActive ? 'bg-swiss-mint/10' : ''}`}
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${avatarColor} text-white flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0`}>
          {avatarText}
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-swiss-mint' : 'text-swiss-charcoal'}`}>
              {otherParticipantName}
            </h3>
            {conversation.lastMessageTimestamp && (
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(conversation.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 truncate pr-2">
              {conversation.lastMessageSenderId === currentUser.id ? t('messagesPage.youPrefix') : ''}
              {conversation.lastMessageSnippet || t('messagesPage.noMessagesYet')}
            </p>
            {unreadCount > 0 && (
              <span className="bg-swiss-coral text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ConversationListItem;
