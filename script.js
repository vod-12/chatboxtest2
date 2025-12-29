const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Send message on Enter (Shift+Enter for new line)
userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input and reset height
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Disable send button while processing
    sendBtn.disabled = true;
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    try {
        console.log('Sending message:', message);
        
        // Send request to server
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: message })
        });
        
        console.log('Response status:', response.status);
        console.log('Response content-type:', response.headers.get('content-type'));
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
            console.log('Response data:', data);
        } else {
            // If not JSON, read as text
            const text = await response.text();
            console.log('Response text:', text);
            data = { error: 'Server error', details: text };
        }
        
        // Remove typing indicator
        typingIndicator.remove();
        
        if (!response.ok) {
            // Show the actual error from the API
            addMessage(`Error: ${data.error || 'Unknown error'}${data.details ? '\n\n' + data.details : ''}`, 'assistant');
            return;
        }
        
        // Add AI response
        if (data.response) {
            addMessage(data.response, 'assistant');
        } else {
            addMessage('Error: No response received from AI', 'assistant');
        }
        
    } catch (error) {
        console.error('Error details:', error);
        typingIndicator.remove();
        addMessage(`Sorry, I encountered an error: ${error.message}`, 'assistant');
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Parse and format the text with code blocks
    const formattedContent = formatMessageWithCode(text);
    contentDiv.innerHTML = formattedContent;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Add copy buttons to all code blocks
    const codeBlocks = contentDiv.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        addCopyButton(block.parentElement);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
}

function formatMessageWithCode(text) {
    // Replace code blocks with proper HTML
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
        const lang = language || 'text';
        const escapedCode = escapeHtml(code.trim());
        return `<pre><code class="language-${lang}">${escapedCode}</code></pre>`;
    });
    
    // Replace inline code
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Replace line breaks with <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addCopyButton(preElement) {
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerHTML = '📋 Copy';
    button.onclick = () => {
        const code = preElement.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            button.innerHTML = '✅ Copied!';
            setTimeout(() => {
                button.innerHTML = '📋 Copy';
            }, 2000);
        });
    };
    preElement.style.position = 'relative';
    preElement.appendChild(button);
}

function addTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    
    contentDiv.appendChild(typingDiv);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
}

// Focus input on load
userInput.focus();
