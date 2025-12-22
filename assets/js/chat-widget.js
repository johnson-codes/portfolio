/**
 * Chat Widget JavaScript
 * A modern, responsive chat widget for Johnson's Portfolio
 */

class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.autoResponses = {
            greeting: [
                "Hi! I'm Johnson. How can I help you today?",
                "Hello! Thanks for visiting my portfolio. What can I do for you?",
                "Hey there! I'd love to hear from you. How can I assist?"
            ],
            services: [
                "I offer digital marketing strategy, SEO optimization, social media management, and web development services. Which area interests you most?",
                "My services include marketing automation, content strategy, PPC campaigns, and full-stack development. What project do you have in mind?"
            ],
            portfolio: [
                "Thanks for your interest in my work! You can explore my projects in the Projects section above. Is there a specific type of project you'd like to know more about?",
                "I've worked on various marketing campaigns, web applications, and automation tools. Check out my portfolio above or let me know what specific work you'd like to discuss!"
            ],
            contact: [
                "I'm not available right now, but please write me an email HERE[johnsonmarketer@outlook.com] and I will get back to you as soon as possible during working hours PST. 📧",
                "Currently offline, but I'd love to connect! Please send me an email HERE[johnsonmarketer@outlook.com] and I'll respond within 24 hours during business days."
            ],
            default: [
                "I'm currently away, but I'd love to hear from you! Please send me an email HERE[johnsonmarketer@outlook.com] and I'll get back to you soon.",
                "Thanks for reaching out! I'm not available at the moment, but feel free to email me HERE[johnsonmarketer@outlook.com] and I'll respond as quickly as possible."
            ]
        };
        
        this.quickActions = [
            { text: "👋 Say Hello", action: "greeting" },
            { text: "💼 My Services", action: "services" },
            { text: "🚀 View Projects", action: "portfolio" },
            { text: "📧 Contact Me", action: "contact" }
        ];
        
        this.init();
    }
    
    init() {
        this.createWidget();
        this.attachEventListeners();
        this.showWelcomeMessage();
        
        // Auto-expand button on first visit
        if (!localStorage.getItem('chatWidgetSeen')) {
            setTimeout(() => {
                this.expandButton();
                localStorage.setItem('chatWidgetSeen', 'true');
            }, 2000);
        }
    }
    
    createWidget() {
        const widgetHTML = `
            <div class="chat-widget" id="chatWidget">
                <button class="chat-toggle-btn" id="chatToggleBtn">
                    <i class="fas fa-comment" id="chatIcon"></i>
                    <span class="chat-toggle-text">Chat</span>
                </button>
                
                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <div class="chat-header-content">
                            <div class="chat-avatar">
                                <img src="https://firebasestorage.googleapis.com/v0/b/visual-c5ee2.firebasestorage.app/o/files%2F1766294351931_12222.png?alt=media&token=29c01df2-c92b-4641-b3d2-5e0ae38856ff" alt="Johnson" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                            </div>
                            <div class="chat-header-info">
                                <h4>Chat with Johnson</h4>
                                <p>I'll get back to you soon!</p>
                            </div>
                        </div>
                        <button class="chat-close-btn" id="chatCloseBtn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="chat-quick-actions" id="quickActions"></div>
                    </div>
                    
                    <div class="chat-input">
                        <div class="chat-input-wrapper">
                            <input type="text" class="chat-input-field" id="chatInput" placeholder="Type your message..." maxlength="500">
                            <button class="chat-send-btn" id="chatSendBtn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        this.initializeElements();
    }
    
    initializeElements() {
        this.toggleBtn = document.getElementById('chatToggleBtn');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSendBtn');
        this.closeBtn = document.getElementById('chatCloseBtn');
        this.quickActions = document.getElementById('quickActions');
        this.chatIcon = document.getElementById('chatIcon');
        
        // Ensure icon element exists
        if (!this.chatIcon) {
            this.chatIcon = this.toggleBtn.querySelector('i');
        }
    }
    
    attachEventListeners() {
        // Toggle chat window
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Input validation
        this.chatInput.addEventListener('input', () => {
            const hasText = this.chatInput.value.trim().length > 0;
            this.sendBtn.disabled = !hasText;
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!document.getElementById('chatWidget').contains(e.target) && this.isOpen) {
                this.closeChat();
            }
        });
        
        // Prevent closing when clicking inside chat window
        this.chatWindow.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    expandButton() {
        this.toggleBtn.classList.add('expanded');
        this.toggleBtn.classList.add('pulse');
        
        setTimeout(() => {
            this.toggleBtn.classList.remove('expanded');
            this.toggleBtn.classList.remove('pulse');
        }, 4000);
    }
    
    showWelcomeMessage() {
        // Add welcome message and quick actions
        const welcomeMessage = {
            type: 'bot',
            text: "Hi! I'm Johnson. How can I help you today?",
            timestamp: new Date()
        };
        
        this.messages.push(welcomeMessage);
        this.renderQuickActions();
    }
    
    renderQuickActions() {
        const actionsHTML = this.quickActions.map(action => 
            `<button class="quick-action-btn" data-action="${action.action}">${action.text}</button>`
        ).join('');
        
        this.quickActions.innerHTML = actionsHTML;
        
        // Attach click events to quick actions
        this.quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            }
        });
    }
    
    handleQuickAction(action) {
        // Send user message
        const userMessage = this.quickActions.find(qa => qa.action === action).text;
        this.addMessage('user', userMessage);
        
        // Generate bot response
        setTimeout(() => {
            const responses = this.autoResponses[action] || this.autoResponses.default;
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage('bot', response);
        }, 1000);
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        this.chatWindow.classList.add('opening');
        this.chatWindow.classList.add('open');
        
        // Update icon - try multiple methods
        this.updateToggleIcon('fas fa-times');
        
        this.toggleBtn.classList.remove('has-notification');
        
        // Focus input
        setTimeout(() => {
            this.chatInput.focus();
            this.scrollToBottom();
        }, 300);
        
        // Remove opening animation class
        setTimeout(() => {
            this.chatWindow.classList.remove('opening');
        }, 300);
    }
    
    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.add('closing');
        
        // Update icon - try multiple methods
        this.updateToggleIcon('fas fa-comment');
        
        setTimeout(() => {
            this.chatWindow.classList.remove('open', 'closing');
        }, 300);
    }
    
    updateToggleIcon(iconClass) {
        // Method 1: Use stored reference
        if (this.chatIcon) {
            this.chatIcon.className = iconClass;
        }
        
        // Method 2: Query by ID (fallback)
        const iconById = document.getElementById('chatIcon');
        if (iconById) {
            iconById.className = iconClass;
        }
        
        // Method 3: Query within button (double fallback)
        const iconInButton = this.toggleBtn ? this.toggleBtn.querySelector('i') : null;
        if (iconInButton) {
            iconInButton.className = iconClass;
        }
        
        // Method 4: Global query (final fallback)
        const iconGlobal = document.querySelector('#chatToggleBtn i');
        if (iconGlobal) {
            iconGlobal.className = iconClass;
        }
    }
    
    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage('user', message);
        this.chatInput.value = '';
        this.sendBtn.disabled = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate auto response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAutoResponse(message);
            this.addMessage('bot', response);
        }, 1500);
    }
    
    addMessage(type, text) {
        const message = {
            type,
            text,
            timestamp: new Date()
        };
        
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
        
        // Add notification if chat is closed
        if (!this.isOpen && type === 'bot') {
            this.toggleBtn.classList.add('has-notification');
        }
    }
    
    renderMessage(message) {
        const messageTime = message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const messageHTML = `
            <div class="message ${message.type}">
                <div class="message-bubble">
                    ${this.formatMessage(message.text)}
                </div>
            </div>
        `;
        
        // Insert before quick actions
        this.quickActions.insertAdjacentHTML('beforebegin', messageHTML);
    }
    
    formatMessage(text) {
        // Convert HERE[email] pattern to clickable links
        const hereEmailRegex = /HERE\[([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\]/gi;
        text = text.replace(hereEmailRegex, '<a href="mailto:$1" style="color: #5bc0de; text-decoration: underline; font-weight: 500;">HERE</a>');
        
        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        text = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Convert standalone email links (but not ones already in mailto links)
        const emailRegex = /(?<!mailto:)\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        text = text.replace(emailRegex, '<a href="mailto:$&">$&</a>');
        
        return text;
    }
    
    generateAutoResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Simple keyword matching for auto responses
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return this.getRandomResponse('greeting');
        } else if (message.includes('service') || message.includes('work') || message.includes('hire')) {
            return this.getRandomResponse('services');
        } else if (message.includes('portfolio') || message.includes('project') || message.includes('example')) {
            return this.getRandomResponse('portfolio');
        } else if (message.includes('contact') || message.includes('email') || message.includes('reach')) {
            return this.getRandomResponse('contact');
        } else {
            return this.getRandomResponse('default');
        }
    }
    
    getRandomResponse(category) {
        const responses = this.autoResponses[category] || this.autoResponses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const typingHTML = `
            <div class="typing-indicator" id="typingIndicator">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.quickActions.insertAdjacentHTML('beforebegin', typingHTML);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
        this.isTyping = false;
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    // Public API methods
    addNotification() {
        if (!this.isOpen) {
            this.toggleBtn.classList.add('has-notification', 'pulse');
            setTimeout(() => {
                this.toggleBtn.classList.remove('pulse');
            }, 2000);
        }
    }
    
    sendBotMessage(message) {
        this.addMessage('bot', message);
    }
    
    clearHistory() {
        this.messages = [];
        const messageElements = this.chatMessages.querySelectorAll('.message, .typing-indicator');
        messageElements.forEach(el => el.remove());
        this.showWelcomeMessage();
    }
}

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if chat widget should be loaded
    if (typeof window.disableChatWidget === 'undefined' || !window.disableChatWidget) {
        window.chatWidget = new ChatWidget();
        
        // Add to global scope for external access
        window.ChatWidget = ChatWidget;
        
        // Expose utility functions
        window.showChatNotification = () => window.chatWidget.addNotification();
        window.sendChatMessage = (message) => window.chatWidget.sendBotMessage(message);
        window.clearChatHistory = () => window.chatWidget.clearHistory();
    }
});

// Handle page navigation (for SPAs)
window.addEventListener('popstate', () => {
    if (window.chatWidget && window.chatWidget.isOpen) {
        window.chatWidget.closeChat();
    }
});