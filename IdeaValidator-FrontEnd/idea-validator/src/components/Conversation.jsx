import { useEffect, useRef } from 'react';
import { useConversation } from '../context/ConversationContext';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import '../assets/App.css';

function Conversation() {
  const { activeConversation } = useConversation();
  const scrollRef = useRef(null);
  const prevLengthRef = useRef(0);

  // get active conversation and scroll to the most recent message
  useEffect(() => {
    const messages = activeConversation?.messages ?? [];

    if (messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    prevLengthRef.current = messages.length;
  }, [activeConversation]);

  const messages = activeConversation?.messages ?? [];

  return (
    <div className="conversation-container">
      <div className="conversation">
        {messages.length === 0 ? null : messages.map((msg, index) => {
          const rawHtml = DOMPurify.sanitize(marked.parse(msg.text));

          return (
            <p
              key={msg.id || index}
              className={msg.sender === 'user' ? 'user' : 'agent'}
              dangerouslySetInnerHTML={{ __html: rawHtml }}
            />
          );
        })}
        <div ref={scrollRef} />
      </div>
    </div>
  );
}

export default Conversation;
