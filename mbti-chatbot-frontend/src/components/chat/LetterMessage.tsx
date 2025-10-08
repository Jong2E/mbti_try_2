import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { ChatMessage } from '../../types/chat';

interface LetterMessageProps {
  message: ChatMessage;
  isNew?: boolean;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) rotateX(-10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
`;

const letterFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-2px) rotate(0.5deg);
  }
  75% {
    transform: translateY(1px) rotate(-0.5deg);
  }
`;

const LetterContainer = styled(motion.div)<{ $isFromBot: boolean }>`
  display: flex;
  justify-content: ${({ $isFromBot }) => $isFromBot ? 'flex-start' : 'flex-end'};
  margin-bottom: ${theme.spacing.lg};
  padding: 0 ${theme.spacing.md};
`;

const LetterWrapper = styled.div<{ $isFromBot: boolean; $isNew: boolean }>`
  max-width: 70%;
  min-width: 300px;
  perspective: 1000px;
  animation: ${({ $isNew }) => $isNew ? fadeIn : 'none'} 0.8s ease-out;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 90%;
    min-width: 250px;
  }
`;

const Letter = styled.div<{ $isFromBot: boolean }>`
  background: ${theme.colors.letter.background};
  border: 2px solid ${theme.colors.letter.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.letter};
  position: relative;
  transform-style: preserve-3d;
  transition: ${theme.transitions.normal};
  animation: ${letterFloat} 4s ease-in-out infinite;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.3);
  }
  
  // 편지 종이 텍스처 효과
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, transparent 79px, rgba(255, 192, 203, 0.3) 81px, transparent 82px),
      linear-gradient(rgba(200, 200, 200, 0.1) 1px, transparent 1px);
    background-size: 80px 100%, 100% 20px;
    border-radius: ${theme.borderRadius.lg};
    pointer-events: none;
  }
`;

const LetterHeader = styled.div<{ $isFromBot: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.sm};
  border-bottom: 1px dashed ${theme.colors.letter.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SenderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Avatar = styled.div<{ $isFromBot: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $isFromBot }) => 
    $isFromBot 
      ? `linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.accent} 100%)`
      : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.white};
  font-weight: 600;
`;

const SenderName = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.letter.text};
`;

const Timestamp = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray.dark};
  font-style: italic;
`;

const LetterContent = styled.div`
  padding: ${theme.spacing.lg};
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.md};
  line-height: 1.8;
  color: ${theme.colors.letter.text};
  position: relative;
  z-index: 1;
  
  // 손글씨 느낌의 스타일
  letter-spacing: 0.5px;
  word-spacing: 1px;
`;

const TypingEffect = styled.span<{ $isVisible: boolean }>`
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const LetterFooter = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  display: flex;
  justify-content: flex-end;
  border-top: 1px dashed ${theme.colors.letter.border};
`;

const Signature = styled.div<{ $isFromBot: boolean }>`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray.dark};
  font-style: italic;
  
  &::before {
    content: '- ';
  }
`;

const letterVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.8, 
    rotateY: -15,
    z: -50 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotateY: 0,
    z: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.8
    }
  }
};

export const LetterMessage: React.FC<LetterMessageProps> = ({ message, isNew = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  
  // 봇 메시지의 경우 타이핑 효과 적용
  useEffect(() => {
    if (message.isFromBot && isNew) {
      setShowContent(false);
      const timer = setTimeout(() => {
        setShowContent(true);
        
        // 타이핑 효과
        let index = 0;
        const text = message.message;
        const typingTimer = setInterval(() => {
          if (index <= text.length) {
            setDisplayedText(text.substring(0, index));
            index++;
          } else {
            clearInterval(typingTimer);
          }
        }, 30); // 타이핑 속도
        
        return () => clearInterval(typingTimer);
      }, 500); // 편지가 나타난 후 0.5초 후 타이핑 시작
      
      return () => clearTimeout(timer);
    } else {
      setDisplayedText(message.message);
      setShowContent(true);
    }
  }, [message.message, message.isFromBot, isNew]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  const getSenderName = () => {
    if (message.isFromBot) {
      return message.counselorGender === 'male' ? '민수 상담사' : '지현 상담사';
    }
    return '당신';
  };

  const getSenderAvatar = () => {
    if (message.isFromBot) {
      return message.counselorGender === 'male' ? '👨‍💼' : '👩‍💼';
    }
    return '😊';
  };

  const getSignature = () => {
    if (message.isFromBot) {
      return message.counselorGender === 'male' ? '민수 드림' : '지현 드림';
    }
    return '감사합니다';
  };

  return (
    <LetterContainer $isFromBot={message.isFromBot}>
      <LetterWrapper $isFromBot={message.isFromBot} $isNew={isNew}>
        <motion.div
          variants={isNew ? letterVariants : undefined}
          initial={isNew ? "initial" : undefined}
          animate={isNew ? "animate" : undefined}
        >
          <Letter $isFromBot={message.isFromBot}>
            <LetterHeader $isFromBot={message.isFromBot}>
              <SenderInfo>
                <Avatar $isFromBot={message.isFromBot}>
                  {getSenderAvatar()}
                </Avatar>
                <SenderName>{getSenderName()}</SenderName>
              </SenderInfo>
              <Timestamp>{formatTime(message.timestamp)}</Timestamp>
            </LetterHeader>
            
            <LetterContent>
              <TypingEffect $isVisible={showContent}>
                {displayedText}
              </TypingEffect>
              {message.isFromBot && showContent && displayedText.length < message.message.length && (
                <span style={{ animation: 'blink 1s infinite' }}>|</span>
              )}
            </LetterContent>
            
            <LetterFooter>
              <Signature $isFromBot={message.isFromBot}>
                {getSignature()}
              </Signature>
            </LetterFooter>
          </Letter>
        </motion.div>
      </LetterWrapper>
    </LetterContainer>
  );
};

// 깜빡이는 커서 애니메이션
const blinkKeyframes = `
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

// 전역 스타일에 추가
const style = document.createElement('style');
style.textContent = blinkKeyframes;
document.head.appendChild(style);