import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    ButtonGroup,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    IconButton,
    FocusLock,
    Box,
    useDisclosure
  } from '@chakra-ui/react'

  import { EditIcon } from '@chakra-ui/icons'


  interface Props {
    annotation: any;
    onSubmit: any;
    onChange: any
  }

const TextInput = React.forwardRef((props, ref) => {
    return (
        <FormControl>
            <FormLabel>Label</FormLabel>
            <Input {...props} />
        </FormControl>
    )
});

const Form = ({ firstFieldRef, onCancel}:any) => {
    return (
      <Stack spacing={4}>
        <TextInput
            ref={firstFieldRef}
        />
        <TextInput/>
        <ButtonGroup display='flex' justifyContent='flex-end'>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button isDisabled colorScheme='teal'>
            Save
          </Button>
        </ButtonGroup>
      </Stack>
    )
  }

export function ChakraRenderEditor(props: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
  
    return (
        <>
        <Drawer
          isOpen={true}
          placement='right'
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Enter your annotation please</DrawerHeader>
  
  
            <DrawerBody>
            <form
              id='my-form'
              onSubmit={(e) => {
                e.preventDefault()
                props.onSubmit()
                console.log('submitted')
              }}
            >
              <Input placeholder='Type here...' />
              </form>
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme='blue'>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
}
