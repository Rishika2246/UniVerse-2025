import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, Paperclip, Smile, Search, Reply, Edit3, Trash2,
  Download, Users, Settings, X,
  Image as ImageIcon, FileText, Film, Music, Archive
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  sender: {
    id: string;
    fullName: string;
    email: string;
  };
  content: string;
  messageType: 'text' | 'file' | 'image' | 'video' | 'audio';
  attachments?: Attachment[];
  reactions?: Reaction[];
  replies?: Message[];
  replyToId?: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

interface Reaction {
  id: string;
  emoji: string;
  user: {
    id: string;
    fullName: string;
  };
}

interface OnlineUser {
  id: string;
  fullName: string;
  lastSeen: string;
}

interface EnhancedClassroomChatProps {
  classroomId: string;
  currentUser: {
    id: string;
    fullName: string;
    email: string;
  };
}

const EnhancedClassroomChat = ({
  classroomId,
  currentUser
}: EnhancedClassroomChatProps) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers] = useState([]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);
  
  const API_BASE_URL = 'http://localhost:3001/api';

  // Emoji options
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥', '👏', '💯'];

  useEffect(() => {
    loadMessages();
    loadOnlineUsers();
    
    // Set up polling for new messages (in production, use WebSocket)
    const interval = setInterval(() => {
      loadMessages();
      loadOnlineUsers();
    }, 3000);

    return () => clearInterval(interval);
  }, [classroomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/classroom-chat/${classroomId}/messages`);
      const result = await response.json();
      
      if (result.success) {
        setMessages(result.data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/classroom-chat/${classroomId}/online-users`);
      const result = await response.json();
      
      if (result.success) {
        setOnlineUsers(result.data.onlineUsers);
      }
    } catch (error) {
      console.error('Error loading online users:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    try {
      const formData = new FormData();
      formData.append('content', newMessage);
      formData.append('senderId', currentUser.id);
      
      if (replyingTo) {
        formData.append('replyToId', replyingTo.id);
      }

      selectedFiles.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await fetch(`${API_BASE_URL}/classroom-chat/${classroomId}/messages`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setMessages(prev => [...prev, result.data.message]);
        setNewMessage('');
        setSelectedFiles([]);
        setReplyingTo(null);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classroom-chat/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, userId: currentUser.id })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update message reactions in state
        setMessages((prev) => prev.map((msg) => {
          if (msg.id === messageId) {
            const existingReactionIndex = msg.reactions?.findIndex((r) => 
              r.emoji === emoji && r.user.id === currentUser.id
            );
            
            if (result.data.action === 'added') {
              return {
                ...msg,
                reactions: [...(msg.reactions || []), result.data.reaction]
              };
            } else {
              return {
                ...msg,
                reactions: msg.reactions?.filter((_, index) => index !== existingReactionIndex) || []
              };
            }
          }
          return msg;
        }));
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/classroom-chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/classroom-chat/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent, userId: currentUser.id })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessages((prev) => prev.map((msg) => 
          msg.id === messageId ? result.data.message : msg
        ));
        setEditingMessage(null);
      }
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleFileSelect = (files) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      return file && file.size && file.size <= 25 * 1024 * 1024;
    });
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <Film className="w-4 h-4" />;
    if (fileType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="w-4 h-4" />;
    if (fileType.includes('zip') || fileType.includes('compressed')) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editingMessage) {
        editMessage(editingMessage.id, newMessage);
      } else {
        sendMessage();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Compact Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-gray-900 text-sm">
              {onlineUsers.length}
            </span>
          </div>
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="truncate max-w-20">{typingUsers[0]} typing...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1 rounded transition-colors ${
              showSearch ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 border-b border-gray-200 bg-gray-50"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply Banner */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Reply className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Replying to {replyingTo.sender.fullName}
                </p>
                <p className="text-sm text-blue-700 truncate max-w-md">
                  {replyingTo.content}
                </p>
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 hover:bg-blue-200 rounded"
            >
              <X className="w-4 h-4 text-blue-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentUser={currentUser}
            onReply={setReplyingTo}
            onEdit={setEditingMessage}
            onDelete={deleteMessage}
            onReaction={handleReaction}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Files Preview */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-3 border-t border-gray-200 bg-gray-50"
          >
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white p-2 rounded-lg border"
                >
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => removeSelectedFile(index)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Paperclip className="w-4 h-4 text-gray-600" />
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={messageInputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={editingMessage ? 'Edit message...' : 'Type your message...'}
              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={1}
              style={{ minHeight: '36px', maxHeight: '80px' }}
            />
            
            {/* Emoji Button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            >
              <Smile className="w-4 h-4 text-gray-600" />
            </button>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  <div className="grid grid-cols-4 gap-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setNewMessage((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-sm"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Send Button */}
          <button
            onClick={editingMessage ? () => editMessage(editingMessage.id, newMessage) : sendMessage}
            disabled={!newMessage.trim() && selectedFiles.length === 0}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Mode Banner */}
        {editingMessage && (
          <div className="flex items-center justify-between mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-center gap-2 text-xs text-yellow-800">
              <Edit3 className="w-3 h-3" />
              <span>Editing message</span>
            </div>
            <button
              onClick={() => {
                setEditingMessage(null);
                setNewMessage('');
              }}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
      />
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, currentUser, onReply, onEdit, onDelete, onReaction }) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const isOwn = message.senderId === currentUser.id;
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">
          {getInitials(message.sender.fullName)}
        </span>
      </div>

      {/* Message Content */}
      <div className={`max-w-md ${isOwn ? 'items-end' : ''}`}>
        {/* Sender Name & Time */}
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-900">
            {isOwn ? 'You' : message.sender.fullName}
          </span>
          <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
          {message.isEdited && (
            <span className="text-xs text-gray-400">(edited)</span>
          )}
        </div>

        {/* Reply Context */}
        {message.replyToId && (
          <div className="mb-2 p-2 bg-gray-100 rounded border-l-2 border-blue-500">
            <p className="text-xs text-gray-600">Replying to a message</p>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative group p-3 rounded-2xl ${
            isOwn
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Message Content */}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 p-2 bg-white bg-opacity-20 rounded-lg"
                >
                  <FileText className="w-4 h-4" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                    <p className="text-xs opacity-75">
                      {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <a
                    href={`http://localhost:3001${attachment.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Message Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute top-0 flex gap-1 ${
                  isOwn ? 'right-full mr-2' : 'left-full ml-2'
                }`}
              >
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Smile className="w-3 h-3 text-gray-600" />
                </button>
                <button
                  onClick={() => onReply(message)}
                  className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Reply className="w-3 h-3 text-gray-600" />
                </button>
                {isOwn && (
                  <>
                    <button
                      onClick={() => onEdit(message)}
                      className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
                    >
                      <Edit3 className="w-3 h-3 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onDelete(message.id)}
                      className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reaction Picker */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-full mt-2 flex gap-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg ${
                  isOwn ? 'right-0' : 'left-0'
                }`}
              >
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReaction(message.id, emoji);
                      setShowReactions(false);
                    }}
                    className="p-1 hover:bg-gray-100 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(
              message.reactions.reduce((acc, reaction) => {
                acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                return acc;
              }, {})
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReaction(message.id, emoji)}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs"
              >
                <span>{emoji}</span>
                <span className="text-gray-600">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Replies */}
        {message.replies && message.replies.length > 0 && (
          <div className="mt-2 ml-4 space-y-2">
            {message.replies.map((reply) => (
              <div key={reply.id} className="p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{reply.sender.fullName}</span>
                  <span className="text-xs text-gray-500">{formatTime(reply.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedClassroomChat;