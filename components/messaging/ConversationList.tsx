
import React, { useEffect } from 'react';
import { useMessaging } from '../../contexts/MessagingContext';
import ConversationListItem from './ConversationListItem';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ICON_INPUT_FIELD } from '../../constants';
import { useTranslation } from 'react-i18next';

const ConversationList: React.FC = () => {
  const { t } = useTranslation();
  const { conversations, activeConversationId, setActiveConversationId, loadUserConversations } = useMessaging();
  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    loadUserConversations();
  }, [loadUserConversations]);

  const filteredConversations = conversations
    .filter(conv => {
        const participantNames = Object.values(conv.participantNames).join(' ').toLowerCase();
        return participantNames.includes(searchTerm.toLowerCase()) ||
               (conv.lastMessageSnippet && conv.lastMessageSnippet.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => new Date(b.lastMessageTimestamp || 0).getTime() - new Date(a.lastMessageTimestamp || 0).getTime());


  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t('messagesPage.searchPlaceholder')}
              className={`${ICON_INPUT_FIELD} w-full text-sm`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label={t('messagesPage.searchPlaceholder')}
            />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">{t('messagesPage.noConversationsFound')}</p>
        )}
        {filteredConversations.map(conv => (
          <ConversationListItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeConversationId}
            onSelect={setActiveConversationId}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
