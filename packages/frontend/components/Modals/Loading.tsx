import React from 'react'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  // Progress,
  // Text,
} from '@chakra-ui/react'

const Loading: React.FC<Omit<ModalProps, 'children' | 'closeOnOverlayClick'>> =
  (props) => {
    return (
      <Modal {...props} closeOnOverlayClick={false} {...props}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Wait Your Transaction is being Mined</ModalHeader>
          <ModalBody pb={6}></ModalBody>
        </ModalContent>
      </Modal>
    )
  }

export default Loading
