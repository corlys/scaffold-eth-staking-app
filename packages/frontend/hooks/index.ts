import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useContractCall, useEthers, getChainName } from '@usedapp/core'
import StakeContract from '../artifacts/contracts/Staking.sol/Staking.json'
import { YourContract } from '../artifacts/contracts/contractAddress'
import { Staking as StakeContractType } from '../types/typechain'

const contractInterface = new ethers.utils.Interface(StakeContract.abi)

export function useBalance(args0: string) {
  const [balance]: any =
    useContractCall({
      abi: contractInterface,
      address: YourContract,
      method: 'balance',
      args: [args0],
    }) ?? []
  return balance
}

export function useContractBalance() {
  const [contractBalance]: any =
    useContractCall({
      abi: contractInterface,
      address: YourContract,
      method: 'getContractBalance',
      args: [],
    }) ?? []
  return contractBalance
}

export function useDeadline() {
  const [deadline] =
    useContractCall({
      abi: contractInterface,
      address: YourContract,
      method: 'count',
      args: [],
    }) ?? []
  return deadline
}

export function useOwner() {
  const [owner] =
    useContractCall({
      abi: contractInterface,
      address: YourContract,
      method: 'owner',
      args: [],
    }) ?? []
  return owner
}

export function useContract(contractAddress: string) {
  const { chainId, library } = useEthers()
  const contract = useMemo(() => {
    if (!chainId) {
      console.log('No ChainId')
      return null
    }
    console.log('chainId %s', chainId)
    const chainName =
      getChainName(chainId).toLowerCase() === 'hardhat'
        ? 'localhost'
        : getChainName(chainId).toLowerCase()
    // console.log('chainName:', chainName)
    // if (!contracts[chainName]) {
    //   console.log(
    //     `Unsupported chain, make sure you are connected to a supported network ${Object.keys(
    //       contracts
    //     )}`
    //   );
    //   return null;
    // }

    return new ethers.Contract(
      contractAddress,
      StakeContract.abi,
      library.getSigner()
    ) as StakeContractType
  }, [chainId, library])
  return contract
}

export function useContractFactory() {
  const { chainId, library } = useEthers()
  // console.log(chainId, library)
  const contract = useMemo(() => {
    if (!chainId) {
      console.log('No ChainId')
      return null
    }
    // console.log('chainId %s', chainId)
    const chainName =
      getChainName(chainId).toLowerCase() === 'hardhat'
        ? 'localhost'
        : getChainName(chainId).toLowerCase()
    // console.log('chainName:', chainName)
    // if (!contracts[chainName]) {
    //   console.log(
    //     `Unsupported chain, make sure you are connected to a supported network ${Object.keys(
    //       contracts
    //     )}`
    //   );
    //   return null;
    // }
    return new ethers.ContractFactory(
      StakeContract.abi,
      StakeContract.bytecode,
      library.getSigner()
    )
  }, [chainId, library])
  return contract
}
