CHATBOT AI GEMINI - MENTOR DIGITAL MARKETING

Mentor yang bantu kamu jadi pintar Digital Marketing

Di dalam Proyek ChatBot ini ada endpoint: 
http://localhost:3000/api/chat 
yang berfungsi untuk berinteraksi dengan AI, memproses fitur obrolan interaktif (Chatbot Multi-turn)

Konfigurasinya:

temperature: 0.7: Mengatur tingkat kreativitas dan keunikan variasi jawaban AI. 
Nilai 0.7 memberikan hasil yang seimbang, membuat respons terasa natural seperti manusia tanpa menjadi terlalu kaku atau melantur.

topP: 0.9: Mengatur penyaringan kata (nucleus sampling). 
Nilai 0.9 membatasi AI agar hanya memilih kata dari 90% kelompok kata yang paling masuk akal, memastikan kalimat yang dihasilkan tetap logis dan mudah dipahami.

systemInstruction: Menetapkan instruksi dasar atau panduan yang mengunci peran, batasan, dan kepribadian permanen AI. 
Aturan di dalamnya wajib dipatuhi oleh chatbot sepanjang sesi obrolan tanpa bisa diinterupsi oleh pengguna
