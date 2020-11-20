import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import logo from '../../assets/img/logo.png'

const Logo: React.FC = () => {
  return (
    <StyledLogo to="/">
      <img src={logo} height="40" style={{ marginTop: -4 }} />
      <strong>LTO</strong> Liquidity Mining
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
  font-size: 1.6em;
  color: #fff;
  font-weight: 100;
  
  img {
    margin-right: 12px;
  }
  strong {
    margin-right: 8px;
    font-weight: 500;
  }
`

export default Logo
