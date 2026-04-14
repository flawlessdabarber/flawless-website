import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { useBooking } from './BookingContext';
import { useCart } from './CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Speech Recognition setup
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AIContextType {
  isAIActive: boolean;
  setIsAIActive: (active: boolean) => void;
  isChatBoxOpen: boolean;
  setIsChatBoxOpen: (open: boolean) => void;
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  sendMessage: (text?: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  selectedEvent: string | null;
  setSelectedEvent: (event: string | null) => void;
  selectedProduct: string | null;
  setSelectedProduct: (product: string | null) => void;
  selectedMembership: string | null;
  setSelectedMembership: (membership: string | null) => void;
  selectedPodcast: string | null;
  setSelectedPodcast: (podcast: string | null) => void;
  selectedWork: string | null;
  setSelectedWork: (work: string | null) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const { state: bookingState, totalPrice } = useBooking();
  const { items: cartItems, totalPrice: cartTotal, addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAIActive, setIsAIActive] = useState(false);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Welcome to Flawless Da Barber. I am your AI Concierge. How can I assist you with booking, memberships, or our premium products today? Let me know if you need me to pull up the chat box.' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [language, setLanguage] = useState('en');
  
  // Site-wide selections
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null);
  const [selectedPodcast, setSelectedPodcast] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<string | null>(null);

  const hasGreeted = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const speakIdRef = useRef(0);

  const stopSpeaking = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // Source might already be stopped
      }
      currentSourceRef.current = null;
    }
  };

  useEffect(() => {
    if (isAIActive && !hasGreeted.current) {
      speak(messages[0].text);
      hasGreeted.current = true;
      setTimeout(() => {
        startListening();
      }, 3000);
    }
    
    if (!isAIActive) {
      stopSpeaking();
      stopListening();
      setIsChatBoxOpen(false);
    }
  }, [isAIActive]);

  const startListening = () => {
    if (recognition && !isListening && isAIActive) {
      try {
        stopSpeaking(); // Stop any current speech before listening
        recognition.start();
        setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          sendMessage(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
      } catch (e: any) {
        if (e.name === 'InvalidStateError' || (e.message && e.message.includes('already started'))) {
          setIsListening(true); // It is already listening
        } else {
          console.error("Speech recognition error:", e);
        }
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const sendMessage = async (text?: string, isSystem: boolean = false) => {
    if (!text?.trim()) return;
    
    if (!isSystem) {
      setMessages(prev => [...prev, { role: 'user', text }]);
    }

    try {
      const selectedServicesText = bookingState.selectedServices.length > 0 
        ? bookingState.selectedServices.map(s => s.title).join(', ') 
        : 'None selected yet';
      
      const cartText = cartItems.length > 0 
        ? cartItems.map(item => `${item.quantity}x ${item.name} (${item.size || 'N/A'}, ${item.color || 'N/A'})`).join(', ')
        : 'Empty';

      const getReservedTimes = (dateStr: string) => {
        const hash = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const reserved = [];
        if (hash % 2 === 0) reserved.push('10:00 AM');
        if (hash % 3 === 0) reserved.push('2:00 PM');
        if (hash % 4 === 0) reserved.push('4:00 PM');
        if (hash % 5 === 0) reserved.push('7:00 PM');
        return reserved;
      };
      
      const reservedTimesText = bookingState.date 
        ? getReservedTimes(bookingState.date).join(', ') || 'None'
        : 'Select a date to see reserved times';

      const siteContext = `
        User's Current Selections:
        - Services: ${selectedServicesText}
        - Total Price: $${totalPrice}
        - Location: ${bookingState.locationType}
        - Client Type: ${bookingState.clientType}
        - Age Group: ${bookingState.ageGroup}
        - Member ID: ${bookingState.memberId || 'N/A'}
        - Date: ${bookingState.date || 'Not selected'}
        - Time: ${bookingState.time || 'Not selected'}
        - Barber: ${bookingState.barber || 'Not selected'}
        - Reserved Times for Selected Date: ${reservedTimesText}
        - Mobile Address: ${bookingState.address || 'Not provided'}
        - Selected Event: ${selectedEvent || 'None'}
        - Selected Product: ${selectedProduct || 'None'}
        - Selected Membership: ${selectedMembership || 'None'}
        - Selected Podcast: ${selectedPodcast || 'None'}
        - Selected Work: ${selectedWork || 'None'}
        - Cart Items: ${cartText}
        - Cart Total (Products/Memberships/Events): $${cartTotal}
        - Booking Total (Services): $${totalPrice}
        - Final Checkout Total: $${cartTotal + totalPrice}
        - Current Page: ${location.pathname}
      `;

      const aiConfig = {
        systemInstruction: `You are the Flawless Da Barber AI Concierge. 
        You are synced with all sections of the website:
        - BOOKING: Help clients book hair/skin services (In-Store, Mobile Visit, Walk-in/Member). Explain pricing (Overtime, Sunday fees). Note: Hair Cuts, High Profile Clientele, Urban Style, and Hair Style are mutually exclusive base services.
        
        CRITICAL BOOKING RULES:
        1. You are aware of confirmed reservations. DO NOT double book any appointments. If a user requests a time that is in the "Reserved Times for Selected Date" list, inform them it is already taken by another client and suggest an available time.
        2. PRICING & FEES: The Overtime (OT fee) is ONE charge, and the Sunday Day Off Fee (DOF) is ANOTHER charge. These are added together with the services price to form ONE single total payment. Make sure the client understands this fee structure.
        3. OVERTIME FEE STRUCTURE: 
           - 10pm & 9am: $50 adult, $25 kids
           - 11pm & 8am: $100 adult, $50 kids
           - 12am & 7am: $200 adult, $100 kids
        4. MEMBER PRICING: If the client is a Member, Hair Cuts, Hair Styles, and Urban Styles are $0. A 6-character Member ID is generated and displayed.
        5. MOBILE VISITS: Mobile visits force the 'Walk-in' client type. Members cannot use member pricing for mobile visits. Mobile visit pricing: Adults (Hair Cuts $250, Hair Styles $300, Urban Style $450), Kids (Hair Cuts $150, Hair Styles $200, Urban Style $325).
        6. SELECT BARBER: The user can select a specific barber for their appointment. The available barbers are Flawless, Marcus, David, James, and Michael. If a barber is selected, confirm their availability.

        - EVENTS: Provide info on upcoming events like the Grooming Workshop or Summer Bash.
        - PODCAST: Talk about "FDB Live" and the YouTube Channel.
        - MEMBERSHIPS: Explain monthly plans (Kids, Adults, Corporate, Investment).
        - MERCHANDISE: Help with premium goods like Pomade, Elixir, or Tees.
        - CART: You are aware of the user's cart contents. If there are items in the cart, you can remind the user to checkout or ask if they need anything else.
        - BODY OF WORK: Explain our portfolio of precision fades, textured crops, and modern pompadours.
        - CALL TRANSFER: If a user asks to speak to a human or "transfer a call", simulate the transfer by saying "Connecting you to a live barber now..."
        
        ${siteContext}
        
        If the user has selected something (service, event, product, membership, podcast, work), acknowledge it immediately and enthusiastically. 
        If they are missing a date, time, or address (for mobile), gently remind them.
        Be professional, high-end, and to the point. Current language: ${language}.
        
        You have access to tools to control the website. Use them when the user asks you to do something or when you are talking about a specific section:
        - execute_website_action: Use this to scroll to sections, navigate to pages, select options, add to cart, or toggle the chat box.
        - If the user asks to hide or close the chat box, use execute_website_action with action="toggle_chat_box" and target="false". Let them know they can click the AI button to bring it back.
        - If you talk about a section (e.g., merchandise, booking, services, membership, podcast, events), use execute_website_action to scroll to it (action="scroll_to_section", target="section_id").
        - If the user asks to navigate to a page, use execute_website_action with action="navigate" and target="/path".
        - If the user asks to add a product to the cart, use action="add_to_cart" and target="product_id" with additional_info as a JSON string containing quantity, size, and color.
        - If the user asks to select an option, scroll a slider, or click a button, use action="click_element" and target="css_selector" (e.g., "button:contains('Hair')", ".next-slide-btn").
        - If the user asks to scroll a slider, use action="dispatch_event" and target="ai_action" with additional_info as a JSON string describing the action.`,
        tools: [{
          functionDeclarations: [
            {
              name: "execute_website_action",
              description: "Executes an action on the website based on the user's request. Use this to scroll, select options, navigate, add to cart, click elements, or toggle the chat box.",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  action: {
                    type: Type.STRING,
                    description: "The action to perform: 'scroll_to_section', 'navigate', 'toggle_chat_box', 'add_to_cart', 'click_element', 'dispatch_event'",
                  },
                  target: {
                    type: Type.STRING,
                    description: "The target of the action (e.g., section ID like 'merchandise', 'services', 'booking', path like '/cart', product ID, CSS selector, or 'false' for toggle_chat_box)",
                  },
                  additional_info: {
                    type: Type.STRING,
                    description: "Any additional info needed (e.g., JSON string for add_to_cart or dispatch_event)",
                  }
                },
                required: ["action", "target"]
              }
            }
          ]
        }]
      };

      const userText = isSystem ? `[SYSTEM NOTIFICATION: User just selected ${text}. Acknowledge this selection and guide them.]` : text;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userText,
        config: aiConfig,
      });

      let aiText = "I'm sorry, I couldn't process that.";
      
      if (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        if (call.name === "execute_website_action") {
          const args = call.args as any;
          if (args.action === 'scroll_to_section') {
            const el = document.getElementById(args.target);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else if (args.target !== location.pathname.substring(1)) {
              navigate(`/${args.target}`);
              setTimeout(() => {
                const newEl = document.getElementById(args.target);
                if (newEl) newEl.scrollIntoView({ behavior: 'smooth' });
              }, 500);
            }
          } else if (args.action === 'navigate') {
            navigate(args.target);
          } else if (args.action === 'toggle_chat_box') {
            if (args.target === 'false') {
              setIsChatBoxOpen(false);
            } else {
              setIsChatBoxOpen(true);
            }
          } else if (args.action === 'add_to_cart') {
            try {
              const info = JSON.parse(args.additional_info || '{}');
              addItem({
                id: args.target,
                name: args.target.replace('-', ' '), // Basic fallback name
                price: info.price || 0,
                category: info.category || 'Item',
                image: 'https://picsum.photos/seed/item/800/600',
                quantity: info.quantity || 1,
                size: info.size,
                color: info.color
              });
            } catch (e) {
              console.error("Failed to parse add_to_cart info", e);
            }
          } else if (args.action === 'click_element') {
            try {
              // Simple text-based selector support like "button:contains('Text')"
              if (args.target.includes(':contains(')) {
                const match = args.target.match(/(.*?):contains\(['"](.*?)['"]\)/);
                if (match) {
                  const tag = match[1] || '*';
                  const textMatch = match[2];
                  const elements = Array.from(document.querySelectorAll(tag));
                  const el = elements.find(e => (e as HTMLElement).innerText?.includes(textMatch) || (e as HTMLElement).textContent?.includes(textMatch));
                  if (el) (el as HTMLElement).click();
                }
              } else {
                const el = document.querySelector(args.target);
                if (el) (el as HTMLElement).click();
              }
            } catch (e) {
              console.error("Failed to click element", e);
            }
          } else if (args.action === 'dispatch_event') {
            window.dispatchEvent(new CustomEvent(args.target, { detail: args.additional_info }));
          }
          
          // Generate a response after the function call
          const followUp = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
              {
                role: 'user',
                parts: [{ text: userText }]
              },
              {
                role: 'model',
                parts: response.candidates?.[0]?.content?.parts || []
              },
              {
                role: 'user',
                parts: [{
                  functionResponse: {
                    name: call.name,
                    response: { result: "Action executed successfully" }
                  }
                }]
              }
            ],
            config: aiConfig,
          });
          aiText = followUp.text || "Action completed.";
        }
      } else {
        aiText = response.text || aiText;
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      
      if (isSpeaking && aiText.trim()) {
        speak(aiText);
      }
    } catch (error) {
      console.error("AI Error:", JSON.stringify(error));
    }
  };

  const speak = async (text: string) => {
    if (!text || !text.trim()) return;
    
    stopSpeaking(); // Stop any existing speech before starting new one
    const speakId = ++speakIdRef.current;
    
    try {
      // Aggressively clean text for TTS: keep only alphanumeric and basic punctuation
      const cleanText = text
        .replace(/[^a-zA-Z0-9\s.,?!'"-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      let response;
      let retries = 2;
      
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: cleanText.substring(0, 2000),
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
              },
            },
          });
          break;
        } catch (err: any) {
          const errorStr = JSON.stringify(err) + (err.message || '');
          if (errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('RESOURCE_EXHAUSTED')) {
            console.warn("TTS Quota exceeded. Audio will not play.");
            return; // Exit gracefully without retrying
          }
          retries--;
          if (retries === 0) throw err;
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (speakId !== speakIdRef.current || !response) return; // A newer speak call was made

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Int16Array(len / 2);
        for (let i = 0; i < len; i += 2) {
          bytes[i / 2] = (binaryString.charCodeAt(i + 1) << 8) | binaryString.charCodeAt(i);
        }
        
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
        }
        
        const audioContext = audioContextRef.current;
        const audioBuffer = audioContext.createBuffer(1, bytes.length, 24000);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < bytes.length; i++) {
          channelData[i] = bytes[i] / 32768;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        currentSourceRef.current = source;
        source.start();
        
        source.onended = () => {
          if (currentSourceRef.current === source) {
            currentSourceRef.current = null;
          }
          // Restart listening after speaking finishes
          if (isAIActive) {
            startListening();
          }
        };
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  // Auto-trigger AI response on selections if active
  useEffect(() => {
    if (isAIActive && selectedEvent) {
      sendMessage(selectedEvent, true);
    }
  }, [selectedEvent, isAIActive]);

  useEffect(() => {
    if (isAIActive && selectedProduct) {
      sendMessage(selectedProduct, true);
    }
  }, [selectedProduct, isAIActive]);

  useEffect(() => {
    if (isAIActive && selectedMembership) {
      sendMessage(selectedMembership, true);
    }
  }, [selectedMembership, isAIActive]);

  useEffect(() => {
    if (isAIActive && selectedPodcast) {
      sendMessage(selectedPodcast, true);
    }
  }, [selectedPodcast, isAIActive]);

  useEffect(() => {
    if (isAIActive && selectedWork) {
      sendMessage(selectedWork, true);
    }
  }, [selectedWork, isAIActive]);

  const prevServicesRef = useRef<string[]>([]);

  useEffect(() => {
    if (isAIActive) {
      const currentServices = bookingState.selectedServices.map(s => s.title);
      const prevServices = prevServicesRef.current;
      
      const added = currentServices.filter(s => !prevServices.includes(s));
      const removed = prevServices.filter(s => !currentServices.includes(s));
      
      if (added.length > 0) {
        sendMessage(`Added Service: ${added[0]}`, true);
      } else if (removed.length > 0) {
        sendMessage(`Removed Service: ${removed[0]}`, true);
      }
      
      prevServicesRef.current = currentServices;
    }
  }, [bookingState.selectedServices, isAIActive]);

  const prevCartItemsRef = useRef<any[]>([]);

  useEffect(() => {
    if (isAIActive) {
      const currentItems = cartItems;
      const prevItems = prevCartItemsRef.current;
      
      const added = currentItems.filter(item => !prevItems.some(p => p.id === item.id));
      const removed = prevItems.filter(item => !currentItems.some(c => c.id === item.id));
      
      if (added.length > 0) {
        sendMessage(`Added to Cart: ${added[0].name}`, true);
      } else if (removed.length > 0) {
        sendMessage(`Removed from Cart: ${removed[0].name}`, true);
      }
      
      prevCartItemsRef.current = currentItems;
    }
  }, [cartItems, isAIActive]);

  useEffect(() => {
    if (isAIActive && bookingState.locationType) {
      sendMessage(`Location: ${bookingState.locationType}`, true);
    }
  }, [bookingState.locationType, isAIActive]);

  useEffect(() => {
    if (isAIActive && bookingState.clientType) {
      sendMessage(`Client Type: ${bookingState.clientType}`, true);
    }
  }, [bookingState.clientType, isAIActive]);

  useEffect(() => {
    if (isAIActive && bookingState.date) {
      sendMessage(`Booking Date: ${bookingState.date}`, true);
    }
  }, [bookingState.date, isAIActive]);

  useEffect(() => {
    if (isAIActive && bookingState.time) {
      sendMessage(`Booking Time: ${bookingState.time}`, true);
    }
  }, [bookingState.time, isAIActive]);

  return (
    <AIContext.Provider value={{ 
      isAIActive, setIsAIActive, isChatBoxOpen, setIsChatBoxOpen, messages, isListening, isSpeaking, setIsSpeaking, 
      language, setLanguage, sendMessage, startListening, stopListening,
      selectedEvent, setSelectedEvent, selectedProduct, setSelectedProduct, selectedMembership, setSelectedMembership,
      selectedPodcast, setSelectedPodcast, selectedWork, setSelectedWork
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
