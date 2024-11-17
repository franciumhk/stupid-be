"use client";

import "../globals.css";
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import { BACKEND_URL } from "../types/config";

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string; // ISO string format
}

interface UserChat {
  email: string;
  messages: ChatMessage[];
}

const AdminLiveChat: React.FC = () => {
  const [activeChats, setActiveChats] = useState<UserChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const fetchLatestChats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/py/latest-chats?limit=10`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const latestChats = await response.json();
      return latestChats;
    } catch (error) {
      console.error('Error fetching latest chats:', error);
      return [];
    }
  };

  const fetchConversationHistory = async (email: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/py/conversations/${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const history = await response.json();
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error(`Error fetching conversation history for ${email}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const initializeChats = async () => {
      const latestChats = await fetchLatestChats();
      setActiveChats(latestChats);
    };

    initializeChats();

    const newWs = new WebSocket('ws://localhost:8000/ws/admin');

    newWs.onopen = () => {
      console.log('Admin WebSocket connected');
    };

    newWs.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message in admin:", data);
      if (data.type === 'message') {
        setActiveChats(prevChats => {
          const chatIndex = prevChats.findIndex(chat => chat.email === data.client);
          if (chatIndex !== -1) {
            const updatedChats = [...prevChats];
            updatedChats[chatIndex] = {
              ...updatedChats[chatIndex],
              messages: [...updatedChats[chatIndex].messages, { sender: data.sender, content: data.content, timestamp: new Date().toISOString() }]
            };
            // Move this chat to the top of the list
            const [updatedChat] = updatedChats.splice(chatIndex, 1);
            return [updatedChat, ...updatedChats];
          } else {
            // Fetch conversation history for new chat
            fetchConversationHistory(data.client).then(history => {
              setActiveChats(prevChats => [
                {
                  email: data.client,
                  messages: [
                    ...history,
                    { sender: data.sender, content: data.content, timestamp: new Date().toISOString() }
                  ]
                },
                ...prevChats.slice(0, 9) // Keep only the 10 most recent chats
              ]);
            });
            return prevChats;
          }
        });
      }
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(newWs);

    return () => {
      if (newWs) {
        newWs.close();
      }
    };
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [selectedChat, activeChats]);

  useEffect(() => {
    console.log('Active chats:', activeChats);
  }, [activeChats]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && ws && selectedChat) {
      const newMessage = { sender: 'Admin', content: message, timestamp: new Date().toISOString() };
      ws.send(JSON.stringify({ type: 'admin_message', client: selectedChat, content: message }));
      setActiveChats(prevChats => {
        const chatIndex = prevChats.findIndex(chat => chat.email === selectedChat);
        if (chatIndex !== -1) {
          const updatedChats = [...prevChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            messages: [...updatedChats[chatIndex].messages, newMessage]
          };
          return updatedChats;
        }
        return prevChats;
      });
      setMessage('');
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup>
            {activeChats
              .sort((a, b) => {
                const lastMessageA = a.messages[a.messages.length - 1];
                const lastMessageB = b.messages[b.messages.length - 1];
                return new Date(lastMessageB.timestamp).getTime() - new Date(lastMessageA.timestamp).getTime();
              })
              .map((chat) => (
                <ListGroup.Item
                  key={chat.email}
                  action
                  active={chat.email === selectedChat}
                  onClick={() => setSelectedChat(chat.email)}
                >
                  {chat.email}
                  <small className="text-muted d-block">
                    Last message: {new Date(chat.messages[chat.messages.length - 1].timestamp).toLocaleString()}
                  </small>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Col>
        <Col md={9}>
          {selectedChat ? (
            <>
              <h2>Chat with {selectedChat}</h2>
              <div ref={chatWindowRef} style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                {activeChats.find(chat => chat.email === selectedChat)?.messages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.sender === 'Admin' ? 'text-end' : ''}`}>
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
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your response..."
                  />
                </Form.Group>
                <Button type="submit" className="mt-2">Send</Button>
              </Form>
            </>
          ) : (
            <p>No active chat</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLiveChat;
