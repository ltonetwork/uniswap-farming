import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { Link } from 'react-router-dom'

interface ButtonProps {
  children?: React.ReactNode,
  disabled?: boolean,
  menuButton?: boolean,
  href?: string,
  onClick?: () => void,
  size?: 'xs' | 'sm' | 'md' | 'lg',
  text?: string,
  to?: string,
  variant?: 'default' | 'secondary' | 'tertiary',
  backgroundColor?: string,
  border?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  menuButton = false,
  href,
  onClick,
  size,
  text,
  to,
  variant,
  backgroundColor,
  border= false
}) => {
  const { color, spacing } = useContext(ThemeContext)

  let buttonColor: string
  let background: string
  switch (variant) {
    case 'tertiary':
        buttonColor = color.purple[100]
      break
    case 'secondary':
      buttonColor = color.white
      break
    case 'default':
    default:
      buttonColor = color.primary.main
  }

  let boxShadow: string
  let buttonSize: number
  let buttonPadding: number
  let fontSize: number
  let minHeight: number = 45
  switch (size) {
    case 'xs':
      minHeight = 36
    case 'sm':
      boxShadow = `4px 4px 8px ${color.grey[300]},
        -8px -8px 16px ${color.grey[100]}FF;`
      buttonPadding = spacing[3]
      buttonSize = 36
      fontSize = 14
      break
    case 'lg':
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px ${color.grey[100]}ff;`
      buttonPadding = spacing[4]
      buttonSize = 72
      fontSize = 16
      break
    case 'md':
    default:
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px -2px ${color.grey[100]}ff;`

      buttonPadding = spacing[4]
      buttonSize = 45
      fontSize = 16
  }

  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>
    } else if (href) {
      return <StyledExternalLink href={href} target="__blank">{text}</StyledExternalLink>
    } else {
      return text
    }
  }, [href, text, to])

  return (
    <StyledButton
      boxShadow={boxShadow}
      color={buttonColor}
      menuButton={menuButton}
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      padding={buttonPadding}
      size={buttonSize}
      backgroundColor={backgroundColor}
      border={border}
      variant={variant}
      minHeight={minHeight}
    >
      {children}
      {ButtonChild}
    </StyledButton>
  )
}

interface StyledButtonProps {
  boxShadow: string,
  color: string,
  disabled?: boolean,
  menuButton?: boolean
  fontSize: number,
  padding: number,
  size: number,
  backgroundColor: string,
  border: boolean,
  variant: string,
  minHeight: number
}

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;  
  background: ${props => props.backgroundColor || 
        (!props.disabled && props.menuButton ? props.theme.color.whiteOpacity : 
        (!props.disabled ? props.color : props.theme.color.white)
    )};
  min-height: ${props => props.minHeight}px;
  border: ${props => (props.disabled && `1px solid ${props.theme.color.grey[100]}`) || props.border ? `1px solid ${props.theme.color.grey[400]}` : '0'};
  border-radius: 4px;
  text-transform: capitalize;
  color: ${props => (props.disabled && `${props.theme.color.grey[300]}`) 
    || (props.variant === 'secondary' && props.theme.color.grey[700] 
    || (props.variant === 'tertiary' || props.backgroundColor || props.menuButton) && `${props.theme.color.white}`)
  };
  cursor: pointer;
  display: flex;
  font-size: ${props => props.fontSize}px;
  font-weight: 700;
  height: ${props => props.size}px;
  justify-content: center;
  outline: none;
  padding-left: ${props => props.padding}px;
  padding-right: ${props => props.padding}px;
  pointer-events: ${props => !props.disabled ? undefined : 'none'};
  width: 100%;
  &:hover {
    background-color: ${props => props.backgroundColor ? `${props.backgroundColor}aa` : 
        (props.variant === 'secondary' ? props.theme.color.grey[200] : (props.color && `${props.color}99` || props.theme.color.grey[400]))
    };
    color: ${props => props.color && ((props.menuButton || props.backgroundColor || props.variant === 'tertiary') ? props.theme.color.white : props.theme.color.grey[800])}
  }
`

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${props => -props.theme.spacing[4]}px;
  padding: 0 ${props => props.theme.spacing[4]}px;
  text-decoration: none;
`

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${props => -props.theme.spacing[4]}px;
  padding: 0 ${props => props.theme.spacing[4]}px;
  text-decoration: none;
`

export default Button
