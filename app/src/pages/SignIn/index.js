import React, { useRef, useState } from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  SignLink,
  SignLinkText,
} from './styles';
import Background from '~/components/Background';
import logo from '~/assets/logo.png';
import { signInRequest } from '~/store/modules/auth/action';

export default function SignIn({ navigation }) {
  const dispatch = useDispatch();
  const passwordRef = useRef();

  const [emails, setEmails] = useState('');
  const [password, setPassword] = useState('');

  const loading = useSelector(state => state.auth.loading);

  function handleSubmit() {
    console.tron.log(emails, 'email');
    dispatch(signInRequest(emails, password));
  }

  return (
    <Background>
      <Container>
        <Image source={logo} />

        <Form>
          <FormInput
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Your e-mail"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={emails}
            onChangeText={setEmails}
          />
          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Your secret password"
            ref={passwordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
          />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Sign in
          </SubmitButton>
        </Form>

        <SignLink onPress={() => navigation.navigate('SignUp')}>
          <SignLinkText>Create an account</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}
