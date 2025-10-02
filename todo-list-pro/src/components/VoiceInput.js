import React, { useState, useRef } from 'react';
import { Button, message, Modal, Typography } from 'antd';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';

const { Text } = Typography;

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const recognitionRef = useRef(null);

  // 检查浏览器是否支持语音识别
  const isSpeechRecognitionSupported = () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  };

  // 初始化语音识别
  const initSpeechRecognition = () => {
    if (!isSpeechRecognitionSupported()) {
      message.error('您的浏览器不支持语音识别功能');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(prev => prev + transcript);
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (interimTranscript) {
        setTranscript(prev => prev + interimTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('语音识别错误:', event.error);
      message.error('语音识别出错: ' + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        setIsModalVisible(true);
      }
    };

    return recognition;
  };

  // 开始语音识别
  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('启动语音识别失败:', error);
        message.error('启动语音识别失败');
      }
    }
  };

  // 停止语音识别
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // 确认并应用识别结果
  const confirmTranscript = () => {
    if (transcript.trim() !== '') {
      onTranscript(transcript);
      message.success('语音输入成功');
    }
    setIsModalVisible(false);
    setTranscript('');
  };

  // 取消语音输入
  const cancelTranscript = () => {
    setIsModalVisible(false);
    setTranscript('');
  };

  return (
    <>
      <Button
        icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
        onClick={isListening ? stopListening : startListening}
        type={isListening ? "primary" : "default"}
        danger={isListening}
      >
        {isListening ? '停止语音输入' : '语音输入'}
      </Button>
      
      <Modal
        title="语音识别结果"
        visible={isModalVisible}
        onOk={confirmTranscript}
        onCancel={cancelTranscript}
        okText="确认"
        cancelText="取消"
      >
        <Text>请确认识别结果:</Text>
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          border: '1px solid #d9d9d9', 
          borderRadius: '4px',
          minHeight: '60px'
        }}>
          {transcript || '未识别到内容'}
        </div>
        <Text type="secondary" style={{ marginTop: '10px', display: 'block' }}>
          如果识别结果不准确，请重新语音输入
        </Text>
      </Modal>
      
      {!isSpeechRecognitionSupported() && (
        <Text type="warning" style={{ display: 'block', marginTop: '10px' }}>
          您的浏览器不支持语音识别功能，建议使用最新版Chrome浏览器
        </Text>
      )}
    </>
  );
};

export default VoiceInput;