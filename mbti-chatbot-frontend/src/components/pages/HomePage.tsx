import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';

interface HomePageProps {
  onStartChat: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${theme.spacing.xl};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(-30px, -30px) rotate(120deg); }
    66% { transform: translate(30px, -20px) rotate(240deg); }
  }
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xxl};
  max-width: 600px;
  text-align: center;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 700;
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing.lg};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
`;

const Subtitle = styled(motion.h2)`
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing.md};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const Description = styled(motion.p)`
  font-size: ${theme.fontSizes.lg};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: ${theme.spacing.xl};
`;

const FeatureList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  color: rgba(255, 255, 255, 0.9);
  font-size: ${theme.fontSizes.md};
`;

const FeatureIcon = styled.span`
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.sm};
`;

const StartButton = styled(motion.div)`
  margin-top: ${theme.spacing.lg};
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

const featureVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

export const HomePage: React.FC<HomePageProps> = ({ onStartChat }) => {
  const features = [
    { icon: '🧠', text: 'ISTP 유형 전문 상담' },
    { icon: '💬', text: '12초 딜레이로 자연스러운 대화' },
    { icon: '✉️', text: '편지 형식의 따뜻한 소통' },
    { icon: '🎯', text: '실용적이고 구체적인 조언' },
  ];

  return (
    <Container>
      <BackgroundElements />
      <ContentWrapper
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div>
          <Title variants={itemVariants}>
            ISTP 마음 도우미
          </Title>
          <Subtitle variants={itemVariants}>
            만능재주꾼을 위한 전문 상담 서비스
          </Subtitle>
        </div>
        
        <Description variants={itemVariants}>
          논리적이고 실용적인 ISTP 유형의 특성을 이해하고, 
          당신만의 방식으로 문제를 해결할 수 있도록 도와드립니다.
        </Description>
        
        <FeatureList variants={itemVariants}>
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              variants={featureVariants}
              custom={index}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <span>{feature.text}</span>
            </FeatureItem>
          ))}
        </FeatureList>
        
        <StartButton
          variants={buttonVariants}
          whileHover="hover"
        >
          <Button
            size="lg"
            onClick={onStartChat}
          >
            상담 시작하기 →
          </Button>
        </StartButton>
      </ContentWrapper>
    </Container>
  );
};