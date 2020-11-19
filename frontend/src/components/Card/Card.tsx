import React from 'react'
import styled from 'styled-components'

interface CardProps {
  children?: React.ReactNode,
  flat?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  flat
}) => (

  <StyledCard flat={flat}>
    {children}
  </StyledCard>
)

interface StyledCardProps {
  flat: boolean
}

const StyledCard = styled.div<StyledCardProps>`
  background: ${props => props.theme.color.white};
  border: 1px solid ${props => props.flat ? '#eee' : props.theme.color.grey[100] + 'ff'};
  border-radius: 6px;
  ${props => props.flat ? '' : 'box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);'}
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default Card
