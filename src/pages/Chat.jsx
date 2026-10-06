import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { chatCompletion } from '../lib/nutriApi';
import './Chat.css';

const INITIAL_MESSAGES = [
    {
        id: 1,
        sender: 'bot',
        text: 'Halo! Aku TEMAN BALI. Kamu bisa bertanya tentang perencanaan masa depan, kesehatan reproduksi, batasan dan persetujuan, serta dampak pernikahan dini. Aku akan menjawab dengan informasi yang ramah remaja dan tanpa menghakimi.',
    }
];

const SUGGESTIONS = [
    'Apa dampak pernikahan dini bagi pendidikan dan masa depan?',
    'Bagaimana menjaga batasan diri dan menghadapi tekanan untuk seks bebas?',
    'Bagaimana menghadapi tekanan dari pasangan?',
    'Di mana mencari informasi kesehatan reproduksi yang tepercaya?'
];
const CHAT_REFERENCES = '\n\nReferensi:\n- Kemenkes RI, Informasi Kesehatan Remaja: https://ayosehat.kemkes.go.id/kategori-usia/remaja\n- WHO, Comprehensive sexuality education: https://www.who.int/news-room/fact-sheets/detail/comprehensive-sexuality-education\n- UU No. 16 Tahun 2019 tentang Perubahan atas UU Perkawinan: https://peraturan.bpk.go.id/Details/122740/uuno-16-tahun-2019';

    const withReferences = (text) => {
        const answer = String(text || '').trim();
        return answer.toLowerCase().includes('referensi:') ? answer : `${answer}${CHAT_REFERENCES}`;
    };

const Chat = () => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Load chat history from localStorage on mount
    useEffect(() => {
        const username = localStorage.getItem('moodify_currentUser');
        if (username) {
            const userKey = `moodify_data_${username}`;
            try {
                const savedData = localStorage.getItem(userKey);
                if (savedData) {
                    const userData = JSON.parse(savedData);
                    const isLegacyTravelChat = userData.chatHistory?.[0]?.text?.includes('Travel Health Nursing');
                    if (userData.chatHistory && userData.chatHistory.length > 0 && !isLegacyTravelChat) {
                        const migratedHistory = userData.chatHistory.map((message, index) => (
                            index === 0 && message.sender === 'bot'
                                ? { ...message, text: message.text.replaceAll('Konsul Remaja Pintar', 'TEMAN BALI') }
                                : message
                        ));
                        setMessages(migratedHistory);
                        if (migratedHistory[0].text !== userData.chatHistory[0].text) {
                            userData.chatHistory = migratedHistory;
                            localStorage.setItem(userKey, JSON.stringify(userData));
                        }
                    } else {
                        // Custom initial greeting with username
                        const personalizedGreeting = [
                            {
                                id: 1,
                                sender: 'bot',
                                text: `Halo ${username}! Aku TEMAN BALI. Kamu bisa bertanya tentang perencanaan masa depan, kesehatan reproduksi, batasan dan persetujuan, serta dampak pernikahan dini. Aku akan menjawab dengan informasi yang ramah remaja dan tanpa menghakimi.`,
                            }
                        ];
                        setMessages(personalizedGreeting);
                        userData.chatHistory = personalizedGreeting;
                        localStorage.setItem(userKey, JSON.stringify(userData));
                    }
                }
            } catch (e) {
                console.error("Error loading chat history:", e);
            }
        }
    }, []);

    // Helper to save messages to localStorage
    const saveMessagesToLocal = (newMessages) => {
        const username = localStorage.getItem('moodify_currentUser');
        if (username) {
            const userKey = `moodify_data_${username}`;
            try {
                const savedData = localStorage.getItem(userKey);
                if (savedData) {
                    const userData = JSON.parse(savedData);
                    userData.chatHistory = newMessages;
                    localStorage.setItem(userKey, JSON.stringify(userData));
                }
            } catch (e) {
                console.error("Error saving chat history:", e);
            }
        }
    };

    const playSendSound = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    const getAiResponse = async (userText, history) => {
        try {
            const formattedHistory = history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));

            formattedHistory.push({
                role: 'user',
                content: userText
            });

            const systemPrompt = "Kamu adalah TEMAN BALI, pendamping informasi yang ramah, akurat, tidak menghakimi, dan menggunakan bahasa Indonesia yang mudah dipahami remaja. Fokus konsultasi: perencanaan masa depan, pernikahan dini dan dampaknya pada pendidikan, kesehatan, hak serta pilihan hidup; kesehatan reproduksi; persetujuan, batasan diri, tekanan pasangan, dan pencegahan risiko aktivitas seksual. Jawab sekitar 3-6 kalimat, ringkas tetapi jelas. Gunakan bahasa yang sesuai usia; jangan memberi konten erotis, deskripsi seksual eksplisit, atau instruksi seksual eksplisit. Jangan mempermalukan, menakut-nakuti, menyalahkan, atau memaksa pengguna. Berikan informasi kesehatan umum berdasarkan sumber tepercaya, jangan mendiagnosis atau meresepkan. Jika pengguna mengalami paksaan, kekerasan, eksploitasi, atau merasa tidak aman, validasi bahwa itu bukan salahnya dan sarankan menghubungi orang dewasa tepercaya, tenaga kesehatan, atau layanan perlindungan setempat; prioritaskan keselamatan segera. Untuk pertanyaan hukum atau medis yang spesifik, jelaskan batas kepastian dan arahkan ke tenaga profesional/sumber resmi terkini. Jangan membuat klaim hukum atau medis yang tidak dapat dipastikan. Gunakan paling banyak satu emoji. Jika pertanyaan di luar topik, jawab singkat lalu arahkan kembali dengan sopan.";

            const data = await chatCompletion({
                messages: [
                    { role: "system", content: systemPrompt },
                    ...formattedHistory
                ],
                max_tokens: 800,
                temperature: 0.7
            });
            return withReferences(data.content?.trim() || getLocalResponseFallback(userText));
        } catch (error) {
            console.warn('AI chat unavailable; using local youth education guidance.', error);
            return withReferences(getLocalResponseFallback(userText));
        }
    };

    const getLocalResponseFallback = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes('pernikahan dini') || lower.includes('kawin muda') || lower.includes('nikah muda')) {
            return "Pernikahan dini dapat membawa tanggung jawab besar dan berisiko membatasi kelanjutan pendidikan, kesehatan, perlindungan, serta pilihan masa depan. Setiap remaja berhak mendapat informasi dan dukungan tanpa tekanan. Jika kamu atau temanmu sedang didesak menikah, bicarakan dengan orang dewasa tepercaya, guru/konselor, tenaga kesehatan, atau layanan perlindungan anak setempat.";
        }
        if (lower.includes('seks') || lower.includes('hubungan intim') || lower.includes('persetujuan') || lower.includes('consent')) {
            return "Kamu berhak menetapkan batasan untuk tubuh dan hubunganmu. Persetujuan harus diberikan dengan bebas, tanpa tekanan atau ancaman, dan bisa ditarik kapan saja. Memilih menunda aktivitas seksual adalah pilihan yang wajar; bila ada paksaan atau kamu merasa tidak aman, cari bantuan orang dewasa tepercaya atau tenaga kesehatan. Untuk informasi pribadi tentang kesehatan reproduksi, gunakan layanan kesehatan yang tepercaya dan ramah remaja.";
        }
        if (lower.includes('reproduksi') || lower.includes('haid') || lower.includes('menstruasi') || lower.includes('kehamilan') || lower.includes('ims')) {
            return "Pertanyaan tentang kesehatan reproduksi itu wajar dan kamu berhak mendapat informasi yang benar tanpa dihakimi. Untuk saran yang sesuai kondisimu, bicaralah dengan tenaga kesehatan atau layanan ramah remaja; hindari memakai obat atau mengikuti saran dari sumber yang tidak jelas. Jika pertanyaanmu menyangkut paksaan atau keselamatan, ceritakan kepada orang dewasa tepercaya.";
        }
        return "Aku bisa membantu membahas perencanaan masa depan, dampak pernikahan dini, kesehatan reproduksi, persetujuan, dan cara menghadapi tekanan dengan aman. Ceritakan pertanyaanmu secukupnya—kamu tidak perlu membagikan nama atau detail pribadi.";
    };

    const handleSend = async (textToSend = inputText) => {
        if (!textToSend.trim()) return;
        
        playSendSound();

        const currentHistory = [...messages];

        const newMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: textToSend
        };

        const updatedMessagesWithUser = [...currentHistory, newMessage];
        setMessages(updatedMessagesWithUser);
        saveMessagesToLocal(updatedMessagesWithUser);

        setInputText('');
        setIsTyping(true);

        const aiText = await getAiResponse(textToSend, currentHistory);

        const botResponse = {
            id: updatedMessagesWithUser.length + 1,
            sender: 'bot',
            text: aiText
        };

        const finalUpdatedMessages = [...updatedMessagesWithUser, botResponse];
        setMessages(finalUpdatedMessages);
        saveMessagesToLocal(finalUpdatedMessages);

        setIsTyping(false);
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <div className="chat-header-left">
                    <div className="chat-logo-mini">🎒</div>
                        <div className="chat-header-text">
                        <h2>TEMAN BALI</h2>
                        <p>Pernikahan dini, seks bebas, dan kesehatan reproduksi</p>
                    </div>
                </div>
            </header>

            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                        {msg.sender === 'bot' && (
                            <div className="message-avatar">🤖</div>
                        )}
                        <div className={`message-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                            {msg.text.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    {i !== msg.text.split('\n').length - 1 && <br />}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="message-wrapper bot">
                        <div className="message-avatar">🤖</div>
                        <div className="message-bubble bubble-bot typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-wrapper">
                <div className="suggestions-container">
                    {SUGGESTIONS.map((suggestion, idx) => (
                        <button
                            key={idx}
                            className="suggestion-chip"
                            onClick={() => handleSend(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                <div className="input-bar">
                    <input
                        type="text"
                        placeholder="Tanya seputar kesehatan dan masa depan remaja..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        className={`send-btn ${inputText.trim() ? 'active' : ''}`}
                        onClick={() => handleSend()}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
