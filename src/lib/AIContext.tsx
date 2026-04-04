import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { useBooking } from './BookingContext';
import { useCart } from './CartContext';

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
  const { items: cartItems, totalPrice: cartTotal } = useCart();
  const [isAIActive, setIsAIActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Welcome to Flawless Da Barber. I am your AI Concierge. How can I assist you with booking, memberships, or our premium products today?' }
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
      } catch (e) {
        console.error("Speech recognition error:", e);
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
        - Reserved Times for Selected Date: ${reservedTimesText}
        - Mobile Address: ${bookingState.address || 'Not provided'}
        - Selected Event: ${selectedEvent || 'None'}
        - Selected Product: ${selectedProduct || 'None'}
        - Selected Membership: ${selectedMembership || 'None'}
        - Selected Podcast: ${selectedPodcast || 'None'}
        - Selected Work: ${selectedWork || 'None'}
        - Cart Items: ${cartText}
        - Cart Total: $${cartTotal}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: isSystem ? `[SYSTEM NOTIFICATION: User just selected ${text}. Acknowledge this selection and guide them.]` : text,
        config: {
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
          Be professional, high-end, and helpful. Current language: ${language}.`,
        },
      });

      const aiText = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      
      if (isSpeaking) {
        speak(aiText);
      }
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  const speak = async (text: string) => {
    stopSpeaking(); // Stop any existing speech before starting new one
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

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

  useEffect(() => {
    if (isAIActive && bookingState.selectedServices.length > 0) {
      const lastService = bookingState.selectedServices[bookingState.selectedServices.length - 1].title;
      sendMessage(`Service: ${lastService}`, true);
    }
  }, [bookingState.selectedServices.length, isAIActive]);

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
      isAIActive, setIsAIActive, messages, isListening, isSpeaking, setIsSpeaking, 
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
