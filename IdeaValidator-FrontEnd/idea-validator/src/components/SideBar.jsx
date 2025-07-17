import { useState, useEffect } from 'react';
import { useConversation } from '../context/ConversationContext';
import '../assets/App.css';

function SideBar() {
  const [open, setOpen] = useState(true);
  const { conversations, setActiveId, createConversation } = useConversation();

  const handleNewConversation = () => {
    const last = conversations[conversations.length - 1];
  
    if (!last || last.title.trim() !== '') {
      const id = createConversation('');
      setActiveId(id);
    } else {
      setActiveId(last.id);
    }
  };


  return (
    <div className={open ? 'side-bar-container' : 'closed-side-bar-container'}>
 
        <>
          <div className='side-bar-actions'>
            {open && (
              <div className="centered">
                <button onClick={handleNewConversation} className="new-convo-button"
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
                  + New Idea
                </button>
              </div>
            )}
            <button
              className="side-bar-tab-button"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? '«' : '»'}
            </button>
          </div>

          
          {open && (
            [...conversations].reverse().map((conv) => (
              <p
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className="side-bar-item"
              >
                {conv.title ? conv.title + '...' : 'New Idea'}
              </p>
            ))      
          )}
        </>
      

    </div>
  );
}

export default SideBar;
