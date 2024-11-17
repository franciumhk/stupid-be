import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { BACKEND_URL } from '../types/config';

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string; // ISO string format
}

const LiveChat: React.FC<{ bottomPosition: number }> = ({ bottomPosition }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);


  const loadMessageHistory = useCallback(async () => {
    try {
      if (chatStarted) {
        const response = await fetch(`${BACKEND_URL}/api/py/conversations/${email}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const previousMessages = await response.json();
        if (Array.isArray(previousMessages)) {
          setMessages(previousMessages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp || new Date().toISOString()
          })));
        } else {
          console.warn('Received non-array message history:', previousMessages);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching previous messages:", error);
      setMessages([]);
    }
  }, [chatStarted]);

  useEffect(() => {
    loadMessageHistory();
  }, [loadMessageHistory]);

  const handleStartChat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Starting chat");
    setChatStarted(true);

    try {
      await loadMessageHistory();
    } catch (error) {
      console.error("Error loading message history:", error);
    }

    // Start new WebSocket connection
    const newWs = new WebSocket(`ws://localhost:8000/ws/chat/${email}`);

    newWs.onopen = () => {
      console.log('WebSocket connection established');
      setWs(newWs);
    };

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const messageWithTimestamp: ChatMessage = {
        ...data,
        timestamp: data.timestamp || new Date().toISOString()
      };
      setMessages(prevMessages => {
        if (Array.isArray(prevMessages)) {
          return [...prevMessages, messageWithTimestamp];
        } else {
          console.warn('prevMessages was not an array:', prevMessages);
          return [messageWithTimestamp];
        }
      });
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newWs.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && ws) {
      const newMessage: ChatMessage = {
        sender: name,
        content: message,
        timestamp: new Date().toISOString()
      };
      ws.send(JSON.stringify(newMessage));
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="position-fixed bottom-0 end-0 mb-3 me-3" style={{ zIndex: 1000 }}>
      {!isOpen ? (
        <div
          onClick={toggleChat}
          className="btn btn-lg btn-primary btn-lg-square"
          style={{
            position: 'fixed',
            right: '20px',
            bottom: `${bottomPosition}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            borderRadius: '4px'
          }}
        >
          <FontAwesomeIcon icon={faComment} />
        </div>
      ) : (
        <div className="card" style={{ width: '300px', height: '400px', position: 'fixed', right: '20px', bottom: '80px' }}>
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <span>Live Chat</span>
            <div>
              <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
            </div>
          </div>
          <div className="card-body d-flex flex-column" style={{ height: 'calc(100% - 56px)', overflowY: 'auto' }}>
            {!chatStarted ? (
              <Form onSubmit={handleStartChat}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit">Start Chat</Button>
              </Form>
            ) : (
              <>
                <div ref={chatWindowRef} className="flex-grow-1 overflow-auto mb-3">
                  {Array.isArray(messages) && messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === name ? 'text-end' : ''}`}>
                      <div>
                        <strong>{msg.sender}: </strong>
                        {msg.content}
                      </div>
                      <small className="text-muted">
                        {new Date(msg.timestamp).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
                <Form onSubmit={handleSendMessage}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                    />
                    <Button type="submit">Send</Button>
                  </InputGroup>
                </Form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
