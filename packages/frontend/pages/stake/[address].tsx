import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Box, Button, Divider, Heading, Input, Text } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import {
  // useBalance,
  // useDeadline,
  // useOwner,
  // useContractBalance,
  useContract,
} from '../../hooks/index'
import { ethers, utils } from 'ethers'
import React, { useReducer } from 'react'
// import { YourContract as CONTRACT_ADDRESS } from '../../artifacts/contracts/contractAddress'
// import StakeContract from '../artifacts/contracts/Staking.sol/Staking.json'
// import YourContract from '../artifacts/contracts/YourContract.sol/YourContract.json'
import { Layout } from '../../components/layout/Layout'
// import { YourContract as YourContractType } from '../types/typechain'
// import { Balance } from '../components/Balance'

/**
 * Constants & Helpers
 */

// const localProvider = new providers.StaticJsonRpcProvider(
//   'http://localhost:8545'
// )

export const ROPSTEN_CONTRACT_ADDRESS =
  '0x5023177c35a54c8Ad7447814C7d5cEF8165FfE1D'

/**
 * Prop Types
 */
type StateType = {
  greeting: string
  inputValue: string
  isLoading: boolean
  balance: string
  isStaker: boolean
  isOwner: boolean
  deadline: Date
}

type ActionType =
  | {
      type: 'SET_GREETING'
      greeting: StateType['greeting']
    }
  | {
      type: 'SET_INPUT_VALUE'
      inputValue: StateType['inputValue']
    }
  | {
      type: 'SET_LOADING'
      isLoading: StateType['isLoading']
    }
  | {
      type: 'SET_BALANCE'
      balance: StateType['balance']
    }
  | {
      type: 'SET_IS_STAKER'
      isStaker: StateType['isStaker']
    }
  | {
      type: 'SET_IS_OWNER'
      isOwner: StateType['isOwner']
    }
  | {
      type: 'SET_DEADLINE'
      deadline: StateType['deadline']
    }

/**
 * Component
 */
const initialState: StateType = {
  greeting: '',
  inputValue: '',
  balance: '',
  deadline: new Date(),
  isStaker: false,
  isLoading: false,
  isOwner: false,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    // Track the greeting from the blockchain
    case 'SET_GREETING':
      return {
        ...state,
        greeting: action.greeting,
      }
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.inputValue,
      }
    case 'SET_BALANCE':
      return {
        ...state,
        balance: action.balance,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case 'SET_IS_STAKER':
      return {
        ...state,
        isStaker: action.isStaker,
      }
    case 'SET_IS_OWNER':
      return {
        ...state,
        isOwner: action.isOwner,
      }
    case 'SET_DEADLINE':
      return {
        ...state,
        deadline: action.deadline,
      }
    default:
      throw new Error()
  }
}

function HomeIndex(): JSX.Element {
  const router = useRouter()
  const { address } = router.query
  const [state, dispatch] = useReducer(reducer, initialState)
  const { library } = useEthers()
  const stakeContract = useContract(address as string)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [threshold, setThreshold] = useState(0)

  // const isLocalChain =
  //   chainId === ChainId.Localhost || chainId === ChainId.Hardhat

  // const CONTRACT_ADDRESS =
  //   chainId === ChainId.Ropsten
  //     ? ROPSTEN_CONTRACT_ADDRESS
  //     : LOCAL_CONTRACT_ADDRESS

  // Use the localProvider as the signer to send ETH to our wallet
  // const { sendTransaction } = useSendTransaction({
  //   signer: localProvider.getSigner(),
  // })

  // // call the smart contract, read the current greeting value
  // async function fetchContractGreeting() {
  //   if (library) {
  //     const contract = new ethers.Contract(
  //       CONTRACT_ADDRESS,
  //       YourContract.abi,
  //       library
  //     ) as YourContractType
  //     try {
  //       const data = await contract.greeting()
  //       dispatch({ type: 'SET_GREETING', greeting: data })
  //     } catch (err) {
  //       // eslint-disable-next-line no-console
  //       console.log('Error: ', err)
  //     }
  //   }
  // }

  // // call the smart contract, send an update
  // async function setContractGreeting() {
  //   if (!state.inputValue) return
  //   if (library) {
  //     dispatch({
  //       type: 'SET_LOADING',
  //       isLoading: true,
  //     })
  //     const signer = library.getSigner()
  //     const contract = new ethers.Contract(
  //       CONTRACT_ADDRESS,
  //       YourContract.abi,
  //       signer
  //     ) as YourContractType
  //     const transaction = await contract.setGreeting(state.inputValue)
  //     await transaction.wait()
  //     fetchContractGreeting()
  //     dispatch({
  //       type: 'SET_LOADING',
  //       isLoading: false,
  //     })
  //   }
  // }

  const stakeFund = async () => {
    if (!state.inputValue) return
    if (library) {
      dispatch({
        type: 'SET_LOADING',
        isLoading: true,
      })

      const transaction = await stakeContract.stake({
        value: utils.parseEther(state.inputValue),
      })
      await transaction.wait()
      fetchContractBalance()
      // TODO: input value not returning to empty
      dispatch({
        type: 'SET_INPUT_VALUE',
        inputValue: '',
      })
      dispatch({
        type: 'SET_LOADING',
        isLoading: false,
      })
    }
  }

  const executeStake = async () => {
    if (library) {
      dispatch({
        type: 'SET_LOADING',
        isLoading: true,
      })
      const transaction = await stakeContract.execute()
      await transaction.wait()
      fetchContractBalance()
      fetchDeadline()
      dispatch({
        type: 'SET_LOADING',
        isLoading: false,
      })
    }
  }

  const withdraw = async () => {
    if (library) {
      dispatch({ type: 'SET_LOADING', isLoading: true })
      // const signer = library.getSigner()
      // const contract = new ethers.Contract(
      //   CONTRACT_ADDRESS,
      //   StakeContract.abi,
      //   signer
      // ) as StakeContractType
      const transaction = await stakeContract.withdraw()
      await transaction.wait()
      fetchContractBalance()
      dispatch({
        type: 'SET_LOADING',
        isLoading: false,
      })
    }
  }

  const fetchContractBalance = async () => {
    if (library) {
      const data = await stakeContract.getContractBalance()
      // console.log(data.toString())
      dispatch({
        type: 'SET_BALANCE',
        balance: ethers.utils.formatEther(data),
      })
    }
  }

  const fetchThreshold = async () => {
    if (library) {
      const data = await stakeContract.threshold()
      const temp = utils.formatEther(data.toString())
      // console.log(temp)
      setThreshold(parseFloat(temp))
      // console.log('HIT', data)
      // setThreshold(utils.parseEther(data.toString()).toNumber())
    }
  }

  const checkIfStaker = async () => {
    if (library) {
      const signer = library.getSigner()

      const data = await stakeContract.balance(await signer.getAddress())
      // console.log(data.toString())
      dispatch({
        type: 'SET_IS_STAKER',
        isStaker: !data.isZero(),
      })
    }
  }

  const checkIfOwner = async () => {
    if (library) {
      const signer = library.getSigner()
      const data = await stakeContract.owner()
      // console.log(data)
      // console.log(await signer.getAddress())
      // console.log(data == (await signer.getAddress()))
      dispatch({
        type: 'SET_IS_OWNER',
        isOwner: (await signer.getAddress()) == data,
      })
      // console.log(state.isOwner)
    }
  }

  const fetchDeadline = async () => {
    if (library) {
      const data = await stakeContract.deadline()
      // console.log('HIT DEADLINE')
      dispatch({
        type: 'SET_DEADLINE',
        deadline: new Date(data.toNumber() * 1000),
      })
    }
  }

  // function sendFunds(): void {
  //   sendTransaction({
  //     to: account,
  //     value: utils.parseEther('0.1'),
  //   })
  // }

  useEffect(() => {
    checkIfStaker()
  }, [state.balance])

  useEffect(() => {
    const target = new Date(state.deadline)
    const interval = setInterval(() => {
      const now = new Date()
      const difference = target.getTime() - now.getTime()
      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      setDays(d)
      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      setHours(h)
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      setMinutes(m)
      const s = Math.floor((difference % (1000 * 60)) / 1000)
      setSeconds(s)
    }, 1000)
    return () => clearInterval(interval)
  }, [state.deadline])

  useEffect(() => {
    // console.log(library.getSigner())
    checkIfOwner()
    fetchContractBalance()
    fetchDeadline()
    fetchThreshold()
    // console.log(state.isStaker, state.balance)
    // console.log('HIT USEEFFECT')
  }, [library])

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Staking Page
      </Heading>
      <Button
        as="a"
        size="lg"
        colorScheme="teal"
        variant="outline"
        href="https://github.com/austintgriffith/scaffold-eth/tree/nextjs-typescript"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get the source code!
      </Button>
      <Text mt="8" fontSize="xl">
        This page only works on the ROPSTEN Testnet
      </Text>
      <Box maxWidth="container.sm" p="8" mt="8" bg="gray.100">
        <Text fontSize="xl">Contract Address: {address}</Text>
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <Text fontSize="lg">Balance: {state.balance}</Text>
          <Text fontSize="lg">Threshold/Goal: {threshold}</Text>
          {/* <Button mt="2" colorScheme="teal" onClick={fetchContractBalance}>
            Fetch Balance
          </Button> */}
        </Box>
        <Divider my="8" borderColor="gray.400" />
        <Box>
          {seconds >= 0 ? (
            <>
              <Text fontSize="lg">Days: {days}</Text>
              <Text fontSize="lg">Hours: {hours}</Text>
              <Text fontSize="lg">Minutes: {minutes}</Text>
              <Text fontSize="lg">Seconds: {seconds}</Text>
            </>
          ) : (
            <Text fontSize="lg">Deadline Has Been Reached</Text>
          )}
        </Box>
        {/* <Box>
          <Text fontSize="lg">Greeting: {state.greeting}</Text>
          <Button mt="2" colorScheme="teal" onClick={fetchContractGreeting}>
            Fetch Greeting
          </Button>
        </Box> */}
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <Input
            bg="white"
            type="text"
            placeholder="Stake Your Ether Here!"
            onChange={(e) => {
              dispatch({
                type: 'SET_INPUT_VALUE',
                inputValue: e.target.value,
              })
            }}
          />
          <Button
            mt="2"
            colorScheme="teal"
            isLoading={state.isLoading}
            onClick={stakeFund}
            isDisabled={seconds <= 0}
          >
            Stake
          </Button>
        </Box>
        <Divider my="8" borderColor="gray.400" />
        <Text mb="4">Withdraw Your Fund</Text>
        <Button
          colorScheme="teal"
          onClick={withdraw}
          isDisabled={
            seconds <= 0 && parseFloat(state.balance) > 0 ? false : true
          } //
        >
          Withdraw
        </Button>
        <Divider my="8" borderColor="gray.400" />
        <Text mb="4">Execute Stake</Text>
        <Button
          colorScheme="teal"
          onClick={executeStake}
          // isDisabled={!state.isOwner} //true
          // isDisabled={parseFloat(state.balance) <= threshold} //false
          // isDisabled={
          //   !state.isOwner &&
          //   parseFloat(state.balance) <= threshold &&
          //   seconds <= 0
          // }
          isDisabled={
            state.isOwner &&
            seconds >= 0 &&
            parseFloat(state.balance) >= threshold
              ? false
              : true
          }
        >
          Execute
        </Button>
        {/* <Divider my="8" borderColor="gray.400" />
        <Text mb="4">This button only works on a Local Chain.</Text>
        <Button
          colorScheme="teal"
          onClick={sendFunds}
          isDisabled={!isLocalChain}
        >
          Send Funds From Local Hardhat Chain
        </Button> */}
      </Box>
    </Layout>
  )
}

// // This function gets called at build time on server-side.
// // It won't be called on client-side, so you can even do
// // direct database queries. See the "Technical details" section.
// export async function getStaticProps() {
//   // Call an external API endpoint to get posts.
//   // You can use any data fetching library
//   const res = await fetch('https://.../posts')
//   const posts = await res.json()

//   // By returning { props: { posts } }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       posts,
//     },
//   }
// }

export default HomeIndex
