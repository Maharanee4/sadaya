import { useState, useRef, useEffect } from 'react';
import { Recycle, Send } from 'lucide-react';
import { chatCompletion } from '../lib/nutriApi';
import './Chat.css';

const INITIAL_MESSAGES = [
    {
        id: 1,
        sender: 'bot',
        text: 'Halo! Aku TEMAN BALI, chatbot edukasi lingkungan. Tanyakan tentang perbedaan sampah organik, nonorganik, dan residu, cara memilah, atau kebiasaan mengurangi sampah. Jangan kirim data pribadi ya.',
    }
];

const SUGGESTIONS = [
    'Apa perbedaan sampah organik, nonorganik, dan residu?',
    'Kulit pisang dan bungkus jajanan dipilah bagaimana?',
    'Apa dampak jika sampah tidak dipilah?',
    'Bagaimana cara mengurangi sampah plastik di sekolah?'
];
const CHAT_REFERENCES = '\n\nSumber untuk dibaca:\n- SIPSN — Sistem Informasi Pengelolaan Sampah Nasional: https://sipsn.menlhk.go.id/\n- SIMBA — Sistem Informasi Manajemen Bank Sampah: https://simba.menlhk.go.id/';

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
                    const isOldTopicChat = userData.chatHistory?.[0]?.text?.includes('perencanaan masa depan')
                        || userData.chatHistory?.[0]?.text?.includes('Travel Health Nursing');
                    if (userData.chatHistory && userData.chatHistory.length > 0 && !isOldTopicChat) {
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
                                text: `Halo ${username}! Aku TEMAN BALI, chatbot edukasi lingkungan. Tanyakan tentang jenis sampah, cara memilah, dan kebiasaan mengurangi sampah. Jangan kirim data pribadi ya.`,
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
            const formattedHistory = history.slice(-10).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));

            formattedHistory.push({
                role: 'user',
                content: userText
            });

            const systemPrompt = "Kamu adalah TEMAN BALI, chatbot edukasi lingkungan untuk siswa. Jawab dengan bahasa Indonesia sederhana, ramah, tidak menghakimi, dan 3-6 kalimat. Fokus pada perbedaan sampah organik, nonorganik, dan residu; langkah aman memilah; dampak sampah tercampur; pengurangan, penggunaan kembali, dan daur ulang; serta kebiasaan menjaga kebersihan lingkungan sekolah dan rumah. Jelaskan bahwa penerimaan bahan daur ulang dan jenis tempat sampah bisa berbeda menurut fasilitas setempat. Untuk baterai, lampu, elektronik, bahan kimia, atau benda berbahaya, sarankan untuk tidak membongkar dan tanyakan jalur pengumpulan khusus kepada guru atau petugas. Jangan membuat klaim angka atau kebijakan lokal yang tidak pasti. Jangan meminta atau menyebarkan data pribadi. Jika pertanyaan di luar topik, arahkan kembali dengan sopan.";

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
            console.warn('AI chat unavailable; using local waste-sorting guidance.', error);
            return withReferences(getLocalResponseFallback(userText));
        }
    };

    const getLocalResponseFallback = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes('organik') || lower.includes('sisa makanan') || lower.includes('kulit buah') || lower.includes('daun')) {
            return 'Sampah organik berasal dari sisa makhluk hidup dan umumnya mudah terurai, contohnya sisa buah, sayur, makanan, dan daun. Pisahkan dari bungkusnya supaya lebih mudah dikelola atau dijadikan kompos bila tersedia. Ikuti aturan tempat sampah di sekolahmu.';
        }
        if (lower.includes('nonorganik') || lower.includes('plastik') || lower.includes('botol') || lower.includes('kaleng') || lower.includes('kertas')) {
            return 'Botol plastik, kaleng, kaca, dan kertas bersih adalah contoh bahan nonorganik yang mungkin dapat digunakan kembali atau didaur ulang. Kosongkan dan keringkan kemasan, lalu periksa apakah bank sampah atau fasilitas setempat menerimanya. Kemasan yang sangat kotor atau berbahan campuran bisa perlu penanganan berbeda.';
        }
        if (lower.includes('residu') || lower.includes('tisu')) {
            return 'Residu adalah sisa yang tidak dapat digunakan kembali atau belum diterima untuk didaur ulang oleh fasilitas di sekitarmu. Tisu kotor sering menjadi contoh residu. Jenis pastinya dapat berbeda menurut aturan setempat, jadi periksa label tempat sampah dan tanyakan kepada guru atau petugas.';
        }
        if (lower.includes('dampak') || lower.includes('tercampur') || lower.includes('tidak dipilah')) {
            return 'Jika sampah tercampur, sisa makanan dan cairan dapat mengotori bahan yang sebenarnya bisa digunakan kembali atau didaur ulang. Pemilahan ulang jadi lebih sulit, dan sampah yang tercecer dapat mengganggu kebersihan lingkungan atau menyumbat saluran air. Memilah dari sumbernya membantu pengelolaan, bersama fasilitas yang tersedia.';
        }
        if (lower.includes('baterai') || lower.includes('elektronik') || lower.includes('lampu')) {
            return 'Baterai, lampu, dan barang elektronik perlu penanganan khusus. Jangan dibongkar atau dicampur ke wadah sampah biasa. Simpan dengan aman, lalu tanyakan kepada guru atau petugas kebersihan tentang jalur pengumpulan yang tersedia.';
        }
        return 'Aku bisa membantu menjelaskan jenis sampah, cara memilah, dampak sampah tercampur, dan kebiasaan mengurangi sampah. Ceritakan bendanya tanpa mencantumkan nama, alamat, sekolah, atau data pribadi lainnya; kalau ragu, ikuti label wadah dan tanyakan kepada guru atau petugas.';
    };

    const handleSend = async (textToSend = inputText) => {
        const safeText = String(textToSend || '').trim().slice(0, 500);
        if (!safeText || isTyping) return;
        
        playSendSound();

        const currentHistory = [...messages];

        const newMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: safeText
        };

        const updatedMessagesWithUser = [...currentHistory, newMessage];
        setMessages(updatedMessagesWithUser);
        saveMessagesToLocal(updatedMessagesWithUser);

        setInputText('');
        setIsTyping(true);

        const aiText = await getAiResponse(safeText, currentHistory);

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
                    <div className="chat-logo-mini"><Recycle size={21} aria-hidden="true" /></div>
                        <div className="chat-header-text">
                        <h2>TEMAN BALI</h2>
                        <p>Teman belajar memilah sampah</p>
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
                            placeholder="Tanya cara memilah sampah..."
                            maxLength={500}
                            aria-label="Tulis pertanyaan tentang sampah"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        className={`send-btn ${inputText.trim() ? 'active' : ''}`}
                        onClick={() => handleSend()}
                        disabled={!inputText.trim() || isTyping}
                        aria-label="Kirim pertanyaan"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
