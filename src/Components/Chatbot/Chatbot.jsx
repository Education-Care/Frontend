// src/components/Chatbot/Chatbot.jsx

// Import các thư viện cần thiết từ React
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Import tệp CSS cho Chatbot
import './Chatbot.css';

// Định nghĩa đường dẫn đến các hình ảnh sử dụng trong Chatbot
const BOT_IMG = "/static/img/mhcicon.png"; // Hình ảnh Chatbot
const PERSON_IMG = "/static/img/person.png"; // Hình ảnh người dùng
const LOGO_EDUCARE = "/static/img/logoeducare.png"; // Logo EduCare

const Chatbot = () => {
  // Sử dụng useState để quản lý trạng thái mở/đóng Chatbot
  const [isOpen, setIsOpen] = useState(false);
  
  // Sử dụng useState để quản lý danh sách các tin nhắn
  const [messages, setMessages] = useState([
    {
      name: 'EduCare Bot', // Tên người gửi tin nhắn (Bot)
      img: BOT_IMG,        // Hình ảnh của Bot
      side: 'left',        // Vị trí hiển thị tin nhắn (left hoặc right)
      text: 'Welcome to EduCare, a safe and supportive space where you can share your thoughts and feelings without fear of judgement.', // Nội dung tin nhắn
      time: getCurrentTime(), // Thời gian gửi tin nhắn
    },
  ]);

  // Sử dụng useState để quản lý giá trị nhập của người dùng
  const [userInput, setUserInput] = useState('');
  
  // Sử dụng useState để kiểm tra xem Bot đã gửi lời chào hay chưa
  const [hasGreeted, setHasGreeted] = useState(false);
  
  // Sử dụng useRef để tạo một tham chiếu đến cuối danh sách tin nhắn (dùng để cuộn xuống)
  const chatEndRef = useRef(null);

  /**
   * Hàm lấy thời gian hiện tại dưới định dạng "Giờ:Phút"
   */
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // Trả về thời gian dưới dạng chuỗi, đảm bảo phút luôn có hai chữ số
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  /**
   * Hàm cập nhật thời gian của tất cả các tin nhắn
   * Sử dụng useCallback để đảm bảo hàm không bị tái tạo mỗi lần render
   */
  const updateMessageTimes = useCallback(() => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({ ...msg, time: getCurrentTime() }))
    );
  }, []);

  /**
   * useEffect để thiết lập một interval cập nhật thời gian mỗi phút
   * Dùng để cập nhật thời gian hiển thị trên từng tin nhắn
   */
  useEffect(() => {
    const timer = setInterval(() => {
      updateMessageTimes();
    }, 60000); // 60000ms = 1 phút

    // Dọn dẹp interval khi component bị unmount hoặc khi dependencies thay đổi
    return () => clearInterval(timer);
  }, [updateMessageTimes]);

  /**
   * useEffect để cuộn xuống cuối danh sách tin nhắn mỗi khi có tin nhắn mới hoặc khi mở Chatbot
   */
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  /**
   * Hàm chuyển đổi trạng thái mở/đóng Chatbot
   * Khi mở Chatbot lần đầu, Bot sẽ gửi một lời chào sau 1 giây
   */
  const toggleChat = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    // Nếu Chatbot đang được mở và Bot chưa gửi lời chào
    if (!isOpen && !hasGreeted) {
      setTimeout(() => {
        addBotMessage("Hi! How can I assist you today?"); // Thêm tin nhắn từ Bot
        setHasGreeted(true); // Đánh dấu đã gửi lời chào
      }, 1000); // Đợi 1 giây trước khi gửi lời chào
    }
  };

  /**
   * Hàm gửi tin nhắn của người dùng
   * Gửi tin nhắn tới API và nhận phản hồi từ Bot
   */
  const sendMessage = async () => {
    // Nếu không có nội dung tin nhắn, không thực hiện gì cả
    if (userInput.trim() === '') return;

    // Tạo đối tượng tin nhắn mới từ người dùng
    const newMessage = {
      name: 'You',             // Tên người gửi (Bạn)
      img: PERSON_IMG,        // Hình ảnh người dùng
      side: 'right',          // Vị trí hiển thị tin nhắn (right)
      text: userInput,        // Nội dung tin nhắn
      time: getCurrentTime(), // Thời gian gửi tin nhắn
    };

    // Thêm tin nhắn mới vào danh sách tin nhắn
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // Xóa nội dung trong ô nhập tin nhắn
    setUserInput('');

    try {
      // Gửi yêu cầu POST tới API Chatbot với nội dung tin nhắn người dùng
      const response = await fetch('/api/chat/', {  // Đảm bảo URL đúng
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userInput }),  // Sử dụng key 'text' chính xác trong body
      });

      // Kiểm tra phản hồi từ API
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Lấy dữ liệu phản hồi từ API
      const data = await response.json();

      // Tạo đối tượng tin nhắn mới từ Bot dựa trên phản hồi từ API
      const botMessage = {
        name: 'EduCare Bot', // Tên người gửi (Bot)
        img: BOT_IMG,        // Hình ảnh Bot
        side: 'left',        // Vị trí hiển thị tin nhắn (left)
        text: data.response || 'Sorry, there was an error processing your request.', // Nội dung tin nhắn
        time: getCurrentTime(), // Thời gian gửi tin nhắn
      };

      // Thêm tin nhắn từ Bot vào danh sách tin nhắn
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error:', error);
      // Tạo đối tượng tin nhắn lỗi từ Bot
      const errorMessage = {
        name: 'EduCare Bot', // Tên người gửi (Bot)
        img: BOT_IMG,        // Hình ảnh Bot
        side: 'left',        // Vị trí hiển thị tin nhắn (left)
        text: 'There was an error. Please try again later.', // Nội dung tin nhắn lỗi
        time: getCurrentTime(), // Thời gian gửi tin nhắn
      };
      // Thêm tin nhắn lỗi vào danh sách tin nhắn
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  /**
   * Hàm thêm tin nhắn từ Bot vào danh sách tin nhắn
   * @param {string} text - Nội dung tin nhắn từ Bot
   */
  const addBotMessage = (text) => {
    const botMessage = {
      name: 'EduCare Bot', // Tên người gửi (Bot)
      img: BOT_IMG,        // Hình ảnh Bot
      side: 'left',        // Vị trí hiển thị tin nhắn (left)
      text: text,          // Nội dung tin nhắn
      time: getCurrentTime(), // Thời gian gửi tin nhắn
    };
    // Thêm tin nhắn từ Bot vào danh sách tin nhắn
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  /**
   * Xử lý sự kiện nhấn phím Enter trong ô nhập tin nhắn
   * @param {object} e - Sự kiện phím
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn chặn hành vi mặc định (chuyển dòng)
      sendMessage();      // Gọi hàm gửi tin nhắn
    }
  };

  return (
    <div className="chatbot-container">
      {/* Hiển thị biểu tượng Chatbot khi Chatbot chưa mở */}
      {!isOpen && (
        <div className="chatbot-icon" onClick={toggleChat}>
          <img src={BOT_IMG} alt="Open Chat" className="chat-icon" height={70} width={70}  />
        </div>
      )}

      {/* Hiển thị hộp thoại Chatbot khi Chatbot mở */}
      {isOpen && (
        <div className="chatbox">
          {/* Phần header của Chatbot */}
          <div className="chatbox-header">
            <div className="main-title">
              <img src={LOGO_EDUCARE} alt="EduCare Logo" className="logo-educare" />
              EduCare Bot
            </div>
            {/* Nút đóng Chatbot */}
            <button className="chatbox-close-btn" onClick={toggleChat}>
              &#10005; {/* Biểu tượng "X" để đóng */}
            </button>
          </div>
          
          {/* Phần body của Chatbot, hiển thị các tin nhắn */}
          <div className="chatbox-body">
            {/* Duyệt qua danh sách tin nhắn và hiển thị từng tin nhắn */}
            {messages.map((msg, index) => (
              <div key={index} className={`msg ${msg.side}-msg`}>
                {/* Nếu tin nhắn từ Bot (left), hiển thị hình ảnh Bot bên trái */}
                {msg.side === 'left' && (
                  <div
                    className="msg-img"
                    style={{
                      backgroundImage: `url(${msg.img})`, // Đặt hình ảnh nền cho div
                    }}
                  ></div>
                )}
                
                {/* Bong bóng tin nhắn chứa nội dung và thông tin */}
                <div className="msg-bubble">
                  {/* Thông tin người gửi và thời gian */}
                  <div className="msg-info">
                    <span className="msg-info-name">{msg.name}</span> {/* Tên người gửi */}
                    <span className="msg-info-time">{msg.time}</span> {/* Thời gian gửi */}
                  </div>
                  {/* Nội dung tin nhắn */}
                  <div className="msg-text">{msg.text}</div>
                </div>
                
                {/* Nếu tin nhắn từ người dùng (right), hiển thị hình ảnh người dùng bên phải */}
                {msg.side === 'right' && (
                  <div
                    className="msg-img"
                    style={{
                      backgroundImage: `url(${msg.img})`, // Đặt hình ảnh nền cho div
                    }}
                  ></div>
                )}
              </div>
            ))}
            {/* Tham chiếu đến cuối danh sách tin nhắn để cuộn xuống */}
            <div ref={chatEndRef} />
          </div>
          
          {/* Phần nhập tin nhắn */}
          <form className="msger-inputarea" style={{ margin: "0px" }} onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
            {/* Ô nhập tin nhắn */}
            <input
              type="text"
              className="msger-input"
              value={userInput} // Giá trị hiện tại của ô nhập
              onChange={(e) => setUserInput(e.target.value)} // Cập nhật giá trị khi người dùng gõ
              onKeyDown={handleKeyPress} // Xử lý sự kiện khi người dùng nhấn phím
              placeholder="Type a message..." // Văn bản gợi ý trong ô nhập
            />
            {/* Nút gửi tin nhắn */}
            <button type="submit" className="msger-send-btn">
              &#9658; {/* Biểu tượng mũi tên gửi */}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// Xuất component Chatbot để sử dụng ở các phần khác của ứng dụng
export default Chatbot;
