import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import logo from '../../assets/img/logo.png'

const Logo: React.FC = () => {
  return (
    <StyledLogo to="/">
      <img src={logo} height="40" style={{ marginTop: -4 }} />
    </StyledLogo>
  )
}

const StyledLogo = styled(Link)`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0;
  min-height: 44px;
  min-width: 44px;
  padding: 0;
  text-decoration: none;
`

export default Logo
