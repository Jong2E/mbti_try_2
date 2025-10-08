import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';

interface LetterInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const InputContainer = styled.div`
  position: sticky;
  bottom: 0;
  background: ${theme.colors.background};
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.gray.light};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const LetterForm = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  background: ${theme.colors.letter.background};
  border: 2px solid ${theme.colors.letter.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.letter};
  position: relative;
  
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
    z-index: 0;
  }
`;

const LetterHeader = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.sm};
  border-bottom: 1px dashed ${theme.colors.letter.border};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  position: relative;
  z-index: 1;
`;

const ToLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.letter.text};
  font-family: ${theme.fonts.secondary};
`;

const RecipientName = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.primary};
  font-weight: 600;
  font-family: ${theme.fonts.secondary};
`;

const TextAreaWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  max-height: 300px;
  padding: ${theme.spacing.lg};
  border: none;
  background: transparent;
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.md};
  line-height: 1.8;
  color: ${theme.colors.letter.text};
  resize: vertical;
  
  // 손글씨 느낌의 스타일
  letter-spacing: 0.5px;
  word-spacing: 1px;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${theme.colors.gray.medium};
    font-style: italic;
  }
  
  // 스크롤바 스타일
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray.light};
    border-radius: ${theme.borderRadius.sm};
  }
`;

const LetterFooter = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-top: 1px dashed ${theme.colors.letter.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const WordCount = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.gray.dark};
  font-style: italic;
`;

const SendButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const CharacterLimit = styled.span<{ $isOverLimit: boolean }>`
  font-size: ${theme.fontSizes.xs};
  color: ${({ $isOverLimit }) => 
    $isOverLimit ? theme.colors.error : theme.colors.gray.dark
  };
  font-weight: ${({ $isOverLimit }) => $isOverLimit ? '600' : '400'};
`;

const formVariants = {
  initial: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.6
    }
  },
  focus: {
    scale: 1.02,
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: 0.2
    }
  }
};

export const LetterInput: React.FC<LetterInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const MAX_LENGTH = 500;
  const isOverLimit = message.length > MAX_LENGTH;
  const canSend = message.trim().length > 0 && !isOverLimit && !isLoading && !disabled;

  useEffect(() => {
    // 자동 높이 조절
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSend) {
      onSendMessage(message.trim());
      setMessage('');
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <InputContainer>
      <motion.form 
        onSubmit={handleSubmit}
        variants={formVariants}
        initial="initial"
        animate="animate"
        whileFocus="focus"
      >
        <LetterForm
          animate={isFocused ? "focus" : "animate"}
        >
          <LetterHeader>
            <ToLabel>To:</ToLabel>
            <RecipientName>ISTP 상담사님</RecipientName>
          </LetterHeader>
          
          <TextAreaWrapper>
            <StyledTextArea
              ref={textAreaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                disabled 
                  ? "답변을 기다리는 중입니다..." 
                  : "마음속 이야기를 편지로 써보세요...\n\n예: 요즘 새로운 프로젝트를 시작했는데 어디서부터 손을 대야 할지 막막해요. ISTP인 제가 효율적으로 접근하는 방법이 있을까요?"
              }
              disabled={disabled || isLoading}
              maxLength={MAX_LENGTH + 50} // 약간의 여유 공간
            />
          </TextAreaWrapper>
          
          <LetterFooter>
            <WordCount>
              {message.length > 0 && (
                <>글자 수: {message.length}자</>
              )}
            </WordCount>
            
            <SendButtonWrapper>
              <CharacterLimit $isOverLimit={isOverLimit}>
                {MAX_LENGTH - message.length >= 0 
                  ? `${MAX_LENGTH - message.length}자 남음`
                  : `${message.length - MAX_LENGTH}자 초과`
                }
              </CharacterLimit>
              
              <Button
                type="submit"
                disabled={!canSend}
                isLoading={isLoading}
                size="sm"
              >
                {isLoading ? '답변 대기 중...' : '편지 보내기 ✉️'}
              </Button>
            </SendButtonWrapper>
          </LetterFooter>
        </LetterForm>
      </motion.form>
    </InputContainer>
  );
};