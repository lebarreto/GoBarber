import { all, takeLatest, call, put } from 'redux-saga/effects';
import { Alert } from 'react-native';

import api from '../../../services/api';
import { updateProfileSuccess, updateProfileFailure } from './action';

export function* updateProfile({ payload }) {
  try {
    const { name, email, ...rest } = payload.data;

    const profile = Object.assign(
      { name, email },
      rest.oldPassword ? rest : {}
    );

    const response = yield call(api.put, 'user', profile);
    Alert.alert('Success', 'Profile updated with success!');

    yield put(updateProfileSuccess(response.data));
  } catch (error) {
    Alert.alert(
      'Error ',
      'Failure in updating profile, verify your information!'
    );
    yield put(updateProfileFailure());
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
