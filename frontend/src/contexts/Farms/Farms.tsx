import React, { useState } from 'react'

import { useWallet } from 'use-wallet'
import useYam from '../../hooks/useYam'

import { getFarms } from '../../farm/utils'

import Context from './context'

const Farms: React.FC = ({ children }) => {
  const [unharvested] = useState(0)

  const yam = useYam()
  const { account } = useWallet()

  const farms = getFarms(yam)

  return (
    <Context.Provider
      value={{
        farms,
        unharvested,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Farms
