import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@heroui/react";
import React from "react";
import logo from '../../assets/authnavbarlogo.png';
import { useNavigate } from "react-router-dom";
  
  export default function Popup({Quiz_id}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const navigate= useNavigate()
    const redirect=()=>{
        localStorage.setItem('redirectAfterLogin', `/student/quiz/${Quiz_id}`);
        navigate('/Auth/login');
    }
    return (
      <>
        <Button  className="bg-blue-600 text-white py-6 px-8 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 font-medium flex items-center shadow-lg" onPress={onOpen} >
            Start Quiz
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </Button>
        <Modal
          backdrop="opaque"
          classNames={{
            backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
          }}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Authentication Required</ModalHeader>
                <ModalBody>
                    <img src={logo} alt="Logo" className="w-48 h-13 m-auto" loading='lazy'/>
                    <p className="text-xl">
                        Before you can start the quiz, we need to verify your identity.
                        This ensures that your progress is saved and that you can access your results later.
                    </p>
                    <p className="text-lg">
                        If you already have an account, please log in. Otherwise, you can create a new account.
                        It's quick and easy!
                    </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose} >
                    Cancel
                  </Button>
                  <Button color="primary" onPress={redirect}>
                    Login / Signup
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  