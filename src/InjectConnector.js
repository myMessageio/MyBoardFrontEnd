import { InjectedConnector } from '@web3-react/injected-connector'
import { InjectedchainIds,activeChainIds } from './Web3Api/env'
export const injected = new InjectedConnector({
  supportedChainIds:activeChainIds,
})
//97,80001,