import React from 'react'
import styled from 'styled-components'

interface ModalTitleProps {
  text?: string
}

const ModalTitle: React.FC<ModalTitleProps> = ({ text }) => (
  <StyledModalTitle>
    {text}
  </StyledModalTitle>
)

const StyledModalTitle = styled.div`
  align-items: center;
  color: ${props => props.theme.color.grey[800]};
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 80px;
  justify-content: center;
`

export default ModalTitle
