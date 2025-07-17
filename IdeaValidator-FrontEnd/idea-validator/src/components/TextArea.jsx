import { useState, useRef, useEffect } from 'react';
import { useConversation } from '../context/ConversationContext';
import { callAgentAPI } from '../utils/callAgent';
import '../assets/App.css';
import arrow from '../assets/arrow.png';

function TextArea() {
  const [text, setText] = useState('');
  const [firstResponseReady, setFirstResponseReady] = useState(null);
  const [btnEnabled, setBtnEnabled] = useState(true);
  const textareaRef = useRef(null);

  const { createConversation, addMessageToActive, updateLastAgentMessage, activeConversation } = useConversation();

  const callAgentHelper = async (prompt, fullConversation) => {
    await callAgentAPI(prompt, fullConversation, {
      onStart: () => addMessageToActive('agent', ''),
      onToken: (chunk) => updateLastAgentMessage(chunk),
      onError: () => {
        setBtnEnabled(true); 
        updateLastAgentMessage('<span style="color: red;"> There was an error connecting to the assistant.</span>')
      },
      onDone: () => setBtnEnabled(true),
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnEnabled(false);
    const textFinal = text.trim();
    setText('');
    if (!textFinal) {
      setBtnEnabled(true);
      return
    };

    if (!activeConversation) {
      const id = createConversation(textFinal);
      // triggers useeffect, where now conversation will be active and usable 
      setFirstResponseReady({ text: textFinal, id });
    } 
    else {
      addMessageToActive('user', textFinal);
      await callAgentHelper(textFinal, activeConversation);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 2000) {
      window.alert("You've reached the character limit, please shorten your prompt");
      return;
    }
    setText(value);
  };


  // make sure create conversation settles and conversation is active started before first call 
  useEffect(() => {
    if (firstResponseReady && activeConversation?.id === firstResponseReady.id) {
      const textToSend = firstResponseReady.text;
      setFirstResponseReady(null); 

      const streamInitial = async () => {
        await callAgentHelper(textToSend, activeConversation);
      };
      streamInitial();
    }
  }, [activeConversation, firstResponseReady]);

  return (
    <div className="idea-page-container">
      <p className="description-container">
        Enter your business, app, tech, startup, or product idea and let us help you see where it fits!
      </p>
      <div className="text-area-container" onClick={() => textareaRef.current?.focus()}>
        <form onSubmit={handleSubmit} className="idea-form">
          <textarea
            ref={textareaRef}
            placeholder="Enter an idea..."
            className="text-area"
            name="idea"
            value={text}
            onChange={(handleChange)}
          />
          <button
            type="submit"
            className="submit-button"
            disabled={!btnEnabled}
            style={{
              cursor: btnEnabled ? 'pointer' : 'default',
              transform: btnEnabled ? undefined : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              if (btnEnabled) e.currentTarget.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              if (btnEnabled) e.currentTarget.style.transform = 'scale(1)';
            }}
            >
            <img
              className="submit-button-image"
              src={arrow}
              alt="submit button"
              style={{ opacity: btnEnabled ? 1 : 0.3 }}
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default TextArea;
