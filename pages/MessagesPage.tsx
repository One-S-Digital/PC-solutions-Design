
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConversationList from '../components/messaging/ConversationList';
import ChatWindow from '../components/messaging/ChatWindow';
import { useMessaging } from '../contexts/MessagingContext';
import { InboxIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const MessagesPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    loadUserConversations
  } = useMessaging();
  const { conversationId: paramConversationId } = useParams<{ conversationId: string }>();

  useEffect(() => {
    loadUserConversations();
  }, [loadUserConversations]);

  useEffect(() => {
    if (paramConversationId && paramConversationId !== activeConversationId) {
      setActiveConversationId(paramConversationId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramConversationId, activeConversationId]); // activeConversationId added to dependencies

  return (
    <div className="flex flex-col h-[calc(100vh-5rem-4rem)]"> {/* Adjusted height assuming Navbar is ~5rem (h-20) & page p-8 -> approx 4rem bottom */}
      <h1 className="text-3xl font-bold text-swiss-charcoal mb-6 flex items-center">
        <ChatBubbleLeftEllipsisIcon className="w-8 h-8 mr-3 text-swiss-mint" />
        {t('sidebar.messages')}
      </h1>
      
      <div className="flex-grow flex border border-gray-200 rounded-lg shadow-soft overflow-hidden bg-white">
        {/* Conversation List Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-gray-50/50 flex flex-col">
          <ConversationList />
        </div>

        {/* Chat Window Main Area */}
        <div className="flex-grow flex flex-col">
          {activeConversationId ? (
            <ChatWindow />
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-10 bg-white">
              <InboxIcon className="w-20 h-20 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-swiss-charcoal">{t('messagesPage.noConversationSelectedTitle')}</h2>
              <p className="text-gray-500">{t('messagesPage.noConversationSelectedSubtitle')}</p>
              {conversations.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">{t('messagesPage.noConversationsYet')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
