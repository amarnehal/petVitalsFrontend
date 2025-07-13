import React from 'react'
import  RegisterPetAndUserComponent from '../components/RegisterPetAndUser'
import Container from '../components/container/Container'

const RegisterPetAndUserPage = () => {
  return (
    <div className='py-8'>
        <Container>
            <RegisterPetAndUserComponent/>
        </Container>
    </div>
  )
}

export default RegisterPetAndUserPage