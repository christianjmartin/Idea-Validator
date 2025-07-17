import { createContext, useContext, useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';

const ConversationContext = createContext();

export function ConversationProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('conversations');
    if (stored) {
      const parsed = JSON.parse(stored);
      setConversations(parsed);
      if (parsed.length > 0) {
        // on refresh, load the most recent conversation as active
        setActiveId(parsed[parsed.length - 1].id);
      }
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);


  const createConversation = (initialUserText) => {
    const id = uuidv4();
    const newConversation = {
      id,
      title: initialUserText.slice(0, 30),
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: uuidv4(),
          sender: 'user',
          text: initialUserText,
          timestamp: new Date().toISOString(),
        }
      ]
    };
    setConversations(prev => [...prev, newConversation]);
    setActiveId(id);
    return id;
  };

  // add message to the conversation
  const addMessageToActive = (sender, text) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeId
          ? {
              ...conv,
              title: conv.title || (sender === 'user' ? text.slice(0, 30) : conv.title),
              messages: [
                ...conv.messages,
                {
                  id: uuidv4(),
                  sender,
                  text,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : conv
      )
    );
  };
  
  // appends streamed token chunk to the most recent agent message
  const updateLastAgentMessage = (chunk) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeId
          ? {
              ...conv,
              messages: conv.messages.map((msg, idx) =>
                idx === conv.messages.length - 1 && msg.sender === 'agent'
                  ? { ...msg, text: msg.text + chunk }
                  : msg
              ),
            }
          : conv
      )
    );
  };

  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeConversation,
        addMessageToActive,
        createConversation,
        updateLastAgentMessage,
        setActiveId,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) throw new Error("useConversation must be in a Provider");
  return context;
}
