import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'secondary':
      return css`
        background-color: ${theme.colors.gray.light};
        color: ${theme.colors.black};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.gray.medium};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}20;
        }
      `;
    default: // primary
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary};
        }
      `;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.fontSizes.sm};
        min-height: 36px;
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing.lg} ${theme.spacing.xl};
        font-size: ${theme.fontSizes.lg};
        min-height: 56px;
      `;
    default: // md
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.fontSizes.md};
        min-height: 48px;
      `;
  }
};

const StyledButton = styled.button<{
  $variant: string;
  $size: string;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.lg};
  font-weight: 500;
  transition: ${theme.transitions.normal};
  box-shadow: ${theme.shadows.sm};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  
  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}
  
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: none;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ButtonContent = styled.span<{ $isLoading: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  opacity: ${({ $isLoading }) => ($isLoading ? 0 : 1)};
  transition: opacity ${theme.transitions.fast};
`;

const LoadingContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button',
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
    >
      <ButtonContent $isLoading={isLoading}>
        {children}
      </ButtonContent>
      {isLoading && (
        <LoadingContainer>
          <LoadingSpinner size="sm" />
        </LoadingContainer>
      )}
    </StyledButton>
  );
};