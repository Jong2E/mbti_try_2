import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Nanum+Pen+Script&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
  }
  
  body {
    font-family: ${theme.fonts.primary};
    background-color: ${theme.colors.background};
    color: ${theme.colors.black};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100vh;
  }
  
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: transparent;
    transition: ${theme.transitions.normal};
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
  
  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
    background: transparent;
  }
  
  a {
    text-decoration: none;
    color: inherit;
    transition: ${theme.transitions.fast};
  }
  
  ul, ol {
    list-style: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  // 커스텀 스크롤바
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${theme.colors.gray.light};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray.medium};
    border-radius: ${theme.borderRadius.md};
    
    &:hover {
      background: ${theme.colors.gray.dark};
    }
  }
  
  // 선택 영역 스타일
  ::selection {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
  }
  
  // 포커스 아웃라인 개선
  :focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
  
  // 애니메이션 감소 설정을 존중
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;