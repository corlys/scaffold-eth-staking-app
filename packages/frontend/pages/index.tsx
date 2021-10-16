import { useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Box, Button, Divider, Heading, Text, Link } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import Loading from '../components/Modals/Loading'
import { ContractDocument } from '../models/Contract'
import { useContractFactory } from '../hooks'
import { Layout } from '../components/layout/Layout'
import { useColorMode } from '@chakra-ui/color-mode'

export interface IndexProps {
  contracts: ContractDocument[]
  api_url: string
}

const Home = (props: IndexProps): JSX.Element => {
  const [isLoading, setLoading] = useState(false)
  const { library } = useEthers()
  const stakeContract = useContractFactory()
  const { contracts, api_url } = props
  const router = useRouter()
  const { colorMode } = useColorMode()

  const deployContract = async () => {
    try {
      setLoading((prev) => {
        return !prev
      })
      const signer = library.getSigner()
      const deployedContract = await stakeContract.deploy(
        await signer.getAddress()
      )
      const contractAddress = deployedContract.address
      await deployedContract.deployTransaction.wait()
      if (contractAddress) {
        const saveAddress = {
          contractAddress,
          creator: await signer.getAddress(),
        }
        await fetch(`${api_url}contracts`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saveAddress),
        }).then(() => {
          setLoading((prev) => {
            return !prev
          })
          router.push(`/`)
        })
      }
    } catch (error) {}
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
      <Box
        maxWidth="container.sm"
        p="8"
        mt="8"
        bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
      >
        {contracts.map((cont) => (
          <>
            <Box>
              <NextLink
                key={cont.contractAddress}
                href={`/stake/${cont.contractAddress}`}
                passHref
              >
                <Link px="4" py="1">
                  <Text fontSize="lg">Address : {cont.contractAddress}</Text>
                </Link>
              </NextLink>
              <Text fontSize="lg">Creator : {cont.creator}</Text>
            </Box>
            <Divider my="8" borderColor="gray.400" />
          </>
        ))}
        <Loading isOpen={isLoading} onClose={() => undefined} />
      </Box>
      {/* <Box maxWidth="container.sm" p="8" mt="8" bg="gray.100">
        Test Event List
      </Box> */}
    </Layout>
  )
}

export default Home

export async function getServerSideProps() {
  const { API_URL } = process.env
  const res = await fetch(`${API_URL}contracts`)
  const contracts = await res.json()
  return {
    props: { contracts, api_url: API_URL },
  }
}
