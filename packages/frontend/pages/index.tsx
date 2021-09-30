import NextLink from 'next/link'
import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  Text,
  Link,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { dbConnect } from '../utils/connection'
import { ContractDocument } from '../models/Contract'
import { ethers, utils } from 'ethers'
import { useContractFactory } from '../hooks'
import { Layout } from '../components/layout/Layout'
import { Contract } from '@usedapp/core/node_modules/ethers'

export interface IndexProps {
  contracts: ContractDocument[]
  api_url: string
}

const Home = (props: IndexProps): JSX.Element => {
  const { library } = useEthers()
  const stakeContract = useContractFactory()
  const { contracts, api_url } = props
  const deployContract = async () => {
    // console.log(await stakeContract.deploy())
    try {
      const signer = library.getSigner()
      const deployedContract = await stakeContract.deploy(
        await signer.getAddress()
      ) //addressTujuan : address
      const contractAddress = deployedContract.address
      await deployedContract.deployTransaction.wait()
      // console.log(contractAddress)
      if (contractAddress) {
        const saveAddress = {
          contractAddress,
          creator: await signer.getAddress(),
        }
        console.log(saveAddress)
        const res = fetch(`${api_url}contracts`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saveAddress),
        })
      }
      // const saveAddress = await fetch(`${API_URL}contracts`)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Layout>
      <Heading as="h1" mb="12">
        Home
      </Heading>
      <Button
        as="a"
        size="lg"
        colorScheme="teal"
        variant="outline"
        target="_blank"
        rel="noopener noreferrer"
        onClick={deployContract}
      >
        Deploy Staking Contract
      </Button>
      <Box maxWidth="container.sm" p="8" mt="8" bg="gray.100">
        {contracts.map((cont) => (
          <>
            <Box key={cont.contractAddress}>
              <NextLink href={`/stake/${cont.contractAddress}`} passHref>
                <Link px="4" py="1">
                  <Text fontSize="lg">Address : {cont.contractAddress}</Text>
                </Link>
              </NextLink>
              <Text fontSize="lg">Creator : {cont.creator}</Text>
              {/* <Button mt="2" colorScheme="teal">
                  Fetch Balance
                </Button> */}
            </Box>
            <Divider my="8" borderColor="gray.400" />
          </>
        ))}
      </Box>
    </Layout>
  )
}

export default Home

export async function getServerSideProps() {
  const { API_URL } = process.env
  const res = await fetch(`${API_URL}contracts`)
  const contracts = await res.json()
  console.log(contracts, API_URL)
  return {
    props: { contracts, api_url: API_URL },
  }
}
