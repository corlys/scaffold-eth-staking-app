import { useState, useRef, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import {
  Box,
  Button,
  Divider,
  Heading,
  Text,
  Link,
  // useToast,
  // UseToastOptions,
  // Alert,
  // AlertTitle,
  // AlertDescription,
  // chakra,
  // Spinner,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
// import { dbConnect } from '../utils/connection'
import Loading from '../components/Modals/Loading'
import { ContractDocument } from '../models/Contract'
// import { ethers, utils } from 'ethers'
import { useContractFactory } from '../hooks'
import { Layout } from '../components/layout/Layout'
// import { Contract } from '@usedapp/core/node_modules/ethers'

export interface IndexProps {
  contracts: ContractDocument[]
  api_url: string
}

interface IToastAsyncProps {
  title?: ReactNode
  description?: ReactNode
  id?: string | number
}

// const ToastAsync = ({
//   title = 'Loading...',
//   description,
//   id,
// }: IToastAsyncProps) => (
//   <Alert
//     status="info"
//     variant="left-accent"
//     id={id?.toString()}
//     alignItems="start"
//     borderRadius="md"
//     boxShadow="lg"
//     paddingEnd={8}
//     textAlign="start"
//     width="auto"
//   >
//     <Spinner marginRight="4" />
//     <chakra.div flex="1">
//       <AlertTitle>{title}</AlertTitle>
//       {description && (
//         <AlertDescription display="block">{description}</AlertDescription>
//       )}
//     </chakra.div>
//   </Alert>
// )

const Home = (props: IndexProps): JSX.Element => {
  const [isLoading, setLoading] = useState(false)
  const { library } = useEthers()
  const stakeContract = useContractFactory()
  const { contracts, api_url } = props
  const router = useRouter()
  // const toast = useToast()
  // const toastRef = useRef<string | number | undefined>()
  // const toastOptions: UseToastOptions = {
  //   title: 'Deploying Party',
  //   position: 'top-left',
  // }

  // useEffect(() => {
  //   console.log('isLoading di useEffect', isLoading)
  //   if (isLoading) {
  //     console.log('Masuk Open', isLoading)
  //     toastRef.current = toast({
  //       render: () => <ToastAsync {...toastOptions} />,
  //       ...toastOptions,
  //     })
  //   } else if (!isLoading && toastRef.current) {
  //     console.log('Masuk Close', isLoading)
  //     toast.close(toastRef.current)
  //   }
  // }, [isLoading, toast, toastOptions])

  const deployContract = async () => {
    // console.log(await stakeContract.deploy())
    try {
      // console.log('sebelum deploy contract', isLoading)
      setLoading((prev) => {
        // console.log('rubah isLoading di setLoading', prev)
        return !prev
      })
      // console.log('awal deploy contract', isLoading)
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
        // console.log(saveAddress)
        await fetch(`${api_url}contracts`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saveAddress),
        }).then(() => {
          // console.log(res)
          // console.log('akhir deploy contract', isLoading)
          setLoading((prev) => {
            // console.log('rubah isLoading di setLoading', prev)
            return !prev
          })
          router.push(`/`)
        })
      }
      // const saveAddress = await fetch(`${API_URL}contracts`)
    } catch (error) {
      // console.log(error)
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
              {/* <Button mt="2" colorScheme="teal">
                  Fetch Balance
                </Button> */}
            </Box>
            <Divider my="8" borderColor="gray.400" />
          </>
        ))}
        <Loading isOpen={isLoading} onClose={() => {}} />
      </Box>
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
