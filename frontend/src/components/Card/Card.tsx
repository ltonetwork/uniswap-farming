import React from 'react'
import styled from 'styled-components'

const Card: React.FC = ({ children }) => (
  <StyledCard>
    {children}
  </StyledCard>
)

const StyledCard = styled.div`
  background: ${props => props.theme.color.white};
  border: 1px solid ${props => props.theme.color.grey[100]}ff;
  border-radius: 6px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
}  display: flex;
  flex: 1;
  flex-direction: column;
`

export default Card
