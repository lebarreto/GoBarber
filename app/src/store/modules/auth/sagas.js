import { all, takeLatest, call, put } from 'redux-saga/effects';
import { Alert } from 'react-native';
import api from '../../../services/api';
import { signInSuccess, signFailure } from './action';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (user.provider) {
      Alert.alert('Login error', "User can't be a provider.");
      return;
    }

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    yield put(signInSuccess(token, user));
  } catch (error) {
    Alert.alert('Error ', 'Authentication fails, check your information.');
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'user', {
      name,
      email,
      password,
    });
  } catch (error) {
    Alert.alert('Register error', 'Register fails, check your information.');
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) {
    return;
  }

  const { token } = payload.auth;
  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
