import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { Gender } from '../../types/chat';

interface TypingIndicatorProps {
  counselorGender: Gender;
  message?: string;
}

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const IndicatorContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  margin-bottom: ${theme.spacing.lg};
  padding: 0 ${theme.spacing.md};
`;

const IndicatorWrapper = styled.div`
  max-width: 70%;
  min-width: 300px;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 90%;
    min-width: 250px;
  }
`;

const TypingLetter = styled.div`
  background: ${theme.colors.letter.background};
  border: 2px solid ${theme.colors.letter.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.letter};
  position: relative;
  animation: ${pulse} 2s ease-in-out infinite;
  
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

const TypingHeader = styled.div`
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

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.accent} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.white};
  font-weight: 600;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const SenderName = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.letter.text};
`;

const StatusText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.primary};
  font-weight: 500;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const TypingContent = styled.div`
  padding: ${theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const TypingAnimation = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.primary};
  animation: ${bounce} 1.4s ease-in-out infinite;
  
  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
`;

const TypingText = styled.span`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.letter.text};
  font-style: italic;
`;

const ThoughtBubble = styled.div`
  background: rgba(107, 115, 255, 0.1);
  border: 1px solid rgba(107, 115, 255, 0.2);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: ${theme.spacing.md};
    width: 12px;
    height: 12px;
    background: rgba(107, 115, 255, 0.1);
    border: 1px solid rgba(107, 115, 255, 0.2);
    border-bottom: none;
    border-right: none;
    transform: rotate(45deg);
  }
`;

const ThoughtText = styled.p`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.primary};
  margin: 0;
  line-height: 1.5;
  font-style: italic;
`;

const ProcessingBar = styled.div`
  margin-top: ${theme.spacing.md};
  height: 4px;
  background: ${theme.colors.gray.light};
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;
  position: relative;
`;

const ProcessingFill = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg, 
    ${theme.colors.primary}, 
    ${theme.colors.secondary}, 
    ${theme.colors.primary}
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s linear infinite;
  border-radius: ${theme.borderRadius.sm};
`;

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  counselorGender, 
  message = "답변을 작성하고 있어요..." 
}) => {
  const getSenderName = () => {
    return counselorGender === Gender.MALE ? '민수 상담사' : '지현 상담사';
  };

  const getSenderAvatar = () => {
    return counselorGender === Gender.MALE ? '👨‍💼' : '👩‍💼';
  };

  const thoughtMessages = [
    "당신의 ISTP 특성을 고려해서...",
    "실용적인 해결책을 찾고 있어요...",
    "구체적인 방법을 생각해보고 있어요...",
    "논리적으로 분석해보고 있어요...",
  ];

  const randomThought = thoughtMessages[Math.floor(Math.random() * thoughtMessages.length)];

  return (
    <IndicatorContainer
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <IndicatorWrapper>
        <TypingLetter>
          <TypingHeader>
            <SenderInfo>
              <Avatar>
                {getSenderAvatar()}
              </Avatar>
              <SenderName>{getSenderName()}</SenderName>
            </SenderInfo>
            <StatusText>✍️ 작성 중...</StatusText>
          </TypingHeader>
          
          <TypingContent>
            <TypingAnimation>
              <TypingDots>
                <Dot />
                <Dot />
                <Dot />
              </TypingDots>
              <TypingText>{message}</TypingText>
            </TypingAnimation>
            
            <ThoughtBubble>
              <ThoughtText>💭 {randomThought}</ThoughtText>
            </ThoughtBubble>
            
            <ProcessingBar>
              <ProcessingFill />
            </ProcessingBar>
          </TypingContent>
        </TypingLetter>
      </IndicatorWrapper>
    </IndicatorContainer>
  );
};