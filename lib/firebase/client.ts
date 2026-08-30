import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

let authEmulatorConnected = false

function getFirebaseClientConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null
  }

  return {
    apiKey,
    authDomain,
    projectId,
    appId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  }
}

export function isFirebaseClientConfigured(): boolean {
  return getFirebaseClientConfig() !== null
}

export function getFirebaseAuth() {
  const config = getFirebaseClientConfig()

  if (!config) {
    throw new Error('Firebase phone auth is not configured.')
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config)
  const auth = getAuth(app)

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH_EMULATOR === 'true' && !authEmulatorConnected) {
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL || 'http://127.0.0.1:9099', {
      disableWarnings: true,
    })
    authEmulatorConnected = true
  }

  return auth
}
