import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';
import { LetterMessage } from '../chat/LetterMessage';
import { LetterInput } from '../chat/LetterInput';
import { TypingIndicator } from '../chat/TypingIndicator';
import { ChatSession } from '../../types/chat';

interface ChatPageProps {
  session: ChatSession;
  onSendMessage: (message: string) => void;
  onEndSession: () => void;
  onNewChat: () => void;
  isLoading: boolean;
  error: string | null;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  position: relative;
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const CounselorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.accent} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.white};
  box-shadow: ${theme.shadows.sm};
`;

const SessionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CounselorName = styled.h2`
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.black};
  margin: 0;
`;

const SessionStatus = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray.dark};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const OnlineIndicator = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.success};
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7); }
    70% { box-shadow: 0 0 0 6px rgba(39, 174, 96, 0); }
    100% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0); }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.lg} 0;
  
  // 커스텀 스크롤바
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: ${theme.borderRadius.md};
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const MessagesWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const ErrorMessage = styled(motion.div)`
  background: ${theme.colors.error};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  margin: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${theme.shadows.sm};
`;

const ErrorText = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
`;

const CloseErrorButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.lg};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxxl} ${theme.spacing.lg};
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.lg};
`;

const EmptyText = styled.p`
  font-size: ${theme.fontSizes.lg};
  margin-bottom: ${theme.spacing.sm};
  font-weight: 500;
`;

const EmptySubtext = styled.p`
  font-size: ${theme.fontSizes.md};
  opacity: 0.8;
  max-width: 400px;
  line-height: 1.6;
`;

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.3
    }
  }
};

export const ChatPage: React.FC<ChatPageProps> = ({
  session,
  onSendMessage,
  onEndSession,
  onNewChat,
  isLoading,
  error,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showError, setShowError] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // 새 메시지가 추가되면 스크롤을 맨 아래로
  useEffect(() => {
    if (session.messages.length !== lastMessageCount) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setLastMessageCount(session.messages.length);
    }
  }, [session.messages.length, lastMessageCount]);

  // 에러 표시 관리
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const getCounselorInfo = () => {
    const isMale = session.counselorGender === 'male';
    return {
      name: isMale ? '민수 상담사' : '지현 상담사',
      avatar: isMale ? '👨‍💼' : '👩‍💼',
      description: isMale 
        ? 'ISTP 전문 남성 상담사' 
        : 'ISTP 전문 여성 상담사'
    };
  };

  const counselorInfo = getCounselorInfo();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Container>
        <Header>
          <HeaderContent>
            <SessionInfo>
              <CounselorAvatar>
                {counselorInfo.avatar}
              </CounselorAvatar>
              <SessionDetails>
                <CounselorName>{counselorInfo.name}</CounselorName>
                <SessionStatus>
                  <OnlineIndicator />
                  {counselorInfo.description}
                </SessionStatus>
              </SessionDetails>
            </SessionInfo>
            
            <HeaderActions>
              <Button
                variant="outline"
                size="sm"
                onClick={onNewChat}
                disabled={isLoading}
              >
                새 대화
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onEndSession}
                disabled={isLoading}
              >
                상담 종료
              </Button>
            </HeaderActions>
          </HeaderContent>
        </Header>

        <MessagesContainer>
          <MessagesWrapper>
            <AnimatePresence>
              {showError && error && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ErrorText>{error}</ErrorText>
                  <CloseErrorButton onClick={() => setShowError(false)}>
                    ×
                  </CloseErrorButton>
                </ErrorMessage>
              )}
            </AnimatePresence>

            {session.messages.length === 0 ? (
              <EmptyState>
                <EmptyIcon>✉️</EmptyIcon>
                <EmptyText>편지로 마음을 나누어보세요</EmptyText>
                <EmptySubtext>
                  ISTP 유형의 특성을 이해하는 상담사가 
                  실용적이고 구체적인 조언을 편지로 전해드립니다.
                </EmptySubtext>
              </EmptyState>
            ) : (
              <>
                {session.messages.map((message, index) => (
                  <LetterMessage
                    key={`${message.sessionId}-${index}`}
                    message={message}
                    isNew={index === session.messages.length - 1 && message.isFromBot}
                  />
                ))}
                
                <AnimatePresence>
                  {isLoading && (
                    <TypingIndicator
                      counselorGender={session.counselorGender}
                      message="당신의 메시지를 읽고 답변을 준비하고 있어요..."
                    />
                  )}
                </AnimatePresence>
              </>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesWrapper>
        </MessagesContainer>

        <LetterInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </Container>
    </motion.div>
  );
};