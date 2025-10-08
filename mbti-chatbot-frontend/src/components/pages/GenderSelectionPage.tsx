import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Gender } from '../../types/chat';

interface GenderSelectionPageProps {
  onSelectGender: (gender: Gender) => void;
  onGoBack: () => void;
  isConnecting: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${theme.spacing.xl};
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  position: relative;
  overflow: hidden;
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: ${theme.spacing.xl};
  left: ${theme.spacing.xl};
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.round};
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.lg};
  cursor: pointer;
  transition: ${theme.transitions.normal};
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xxl};
  max-width: 800px;
  text-align: center;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing.lg};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
`;

const Subtitle = styled(motion.p)`
  font-size: ${theme.fontSizes.lg};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing.xl};
  max-width: 600px;
  line-height: 1.6;
`;

const GenderOptionsContainer = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing.xxl};
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.xl};
  }
`;

const GenderOption = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.xxl};
  background: rgba(255, 255, 255, 0.15);
  border-radius: ${theme.borderRadius.xl};
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: ${theme.transitions.normal};
  min-width: 280px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-5px);
  }
`;

const Avatar = styled.div<{ $gender: Gender }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ $gender }) => 
    $gender === Gender.MALE 
      ? `linear-gradient(135deg, ${theme.colors.male.primary} 0%, ${theme.colors.male.secondary} 100%)`
      : `linear-gradient(135deg, ${theme.colors.female.primary} 0%, ${theme.colors.female.secondary} 100%)`
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  box-shadow: ${theme.shadows.lg};
  transition: ${theme.transitions.normal};
`;

const GenderLabel = styled.h3`
  font-size: ${theme.fontSizes.xl};
  font-weight: 600;
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing.sm};
`;

const GenderDescription = styled.p`
  font-size: ${theme.fontSizes.md};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
  z-index: 10;
`;

const LoadingText = styled.div`
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.lg};
  text-align: center;
`;

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const optionVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

export const GenderSelectionPage: React.FC<GenderSelectionPageProps> = ({ 
  onSelectGender, 
  onGoBack, 
  isConnecting 
}) => {
  const genderOptions = [
    {
      gender: Gender.MALE,
      label: '남성 상담사',
      description: '차분하고 논리적인 접근으로\n실용적인 조언을 제공합니다',
      emoji: '👨‍💼',
    },
    {
      gender: Gender.FEMALE,
      label: '여성 상담사',
      description: '따뜻하면서도 분석적인 시각으로\n구체적인 해결책을 제시합니다',
      emoji: '👩‍💼',
    },
  ];

  return (
    <Container>
      <BackButton
        onClick={onGoBack}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={isConnecting}
      >
        ←
      </BackButton>
      
      <ContentWrapper
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div>
          <Title variants={itemVariants}>
            상담사를 선택해주세요
          </Title>
          <Subtitle variants={itemVariants}>
            ISTP 유형의 특성을 잘 이해하는 전문 상담사와 함께 
            편안한 대화를 나누어보세요
          </Subtitle>
        </div>
        
        <GenderOptionsContainer variants={itemVariants}>
          {genderOptions.map((option) => (
            <GenderOption
              key={option.gender}
              variants={optionVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={() => !isConnecting && onSelectGender(option.gender)}
            >
              <Avatar $gender={option.gender}>
                {option.emoji}
              </Avatar>
              <div>
                <GenderLabel>{option.label}</GenderLabel>
                <GenderDescription>
                  {option.description.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < option.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </GenderDescription>
                <Button
                  variant="outline"
                  disabled={isConnecting}
                >
                  선택하기
                </Button>
              </div>
            </GenderOption>
          ))}
        </GenderOptionsContainer>
      </ContentWrapper>
      
      {isConnecting && (
        <LoadingOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner size="lg" />
          <LoadingText>
            상담 준비 중입니다...<br />
            잠시만 기다려주세요 ✨
          </LoadingText>
        </LoadingOverlay>
      )}
    </Container>
  );
};