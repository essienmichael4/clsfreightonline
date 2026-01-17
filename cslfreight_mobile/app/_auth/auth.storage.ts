import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

// Use SecureStore for native platforms, AsyncStorage for web
const isNative = Platform.OS !== 'web';

const setItem = async (key: string, value: string) => {
  if (isNative) {
    await SecureStore.setItemAsync(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

const getItem = async (key: string) => {
  if (isNative) {
    return await SecureStore.getItemAsync(key);
  } else {
    return await AsyncStorage.getItem(key);
  }
};

const removeItem = async (key: string) => {
  if (isNative) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};

export const saveTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  await setItem(ACCESS_TOKEN, accessToken);
  await setItem(REFRESH_TOKEN, refreshToken);
};

export const getAccessToken = async () =>
  getItem(ACCESS_TOKEN);

export const getRefreshToken = async () =>
  getItem(REFRESH_TOKEN);

export const clearTokens = async () => {
  await removeItem(ACCESS_TOKEN);
  await removeItem(REFRESH_TOKEN);
};
