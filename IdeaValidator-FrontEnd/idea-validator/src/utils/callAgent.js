export const callAgentAPI = async (message, allMessages, { onStart, onToken, onError, onDone }) => {
    if (onStart) onStart();

    let doneCalled = false;
    const controller = new AbortController();
    const signal = controller.signal;

    // abort task if takes > 60 seconds
    const timeoutId = setTimeout(() => {
      if (!doneCalled) {
        controller.abort();
        doneCalled = true;
      }
    }, 60000);


    try {
      const res = await fetch('http://localhost:8080/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversation: allMessages }),
        signal,
      });
  
      if (!res.body) throw new Error("No response body");
  
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
  
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        if (onToken) onToken(chunk);
      }
      
      if (!doneCalled) {
        doneCalled = true;
        clearTimeout(timeoutId);
        if (onDone) onDone();
      }
  

      return fullText;

    } catch (err) {
      clearTimeout(timeoutId);
      if (!doneCalled) {
        doneCalled = true;
      }
      console.error('Streaming error:', err);
      if (onError) setTimeout(() => onError(), 500)
      return `Failed to connect toserver: ${err.message}`;
    }
  };