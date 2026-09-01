import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { isFirebaseAuthEmulatorEnabled } from '@/lib/firebase/emulator'

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
    throw new Error('Firebase phone auth is not configured. Check NEXT_PUBLIC_FIREBASE_* environment variables.')
  }

  // Debug: Log the config being used (remove in production)
  console.log('Firebase config:', {
    apiKey: config.apiKey?.slice(0, 10) + '...',
    authDomain: config.authDomain,
    projectId: config.projectId,
    appId: config.appId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
  })

  const existingApps = getApps()
  let app
  
  if (existingApps.length > 0) {
    app = getApp()
    // Verify the existing app has the correct config
    const existingConfig = app.options
    if (existingConfig.apiKey !== config.apiKey || 
        existingConfig.projectId !== config.projectId || 
        existingConfig.appId !== config.appId) {
      console.warn('Firebase app config mismatch, reinitializing with new config')
      app = initializeApp(config, 'phone-auth')
    }
  } else {
    app = initializeApp(config)
  }
  
  const auth = getAuth(app)

  // Debug: Verify auth instance
  console.log('Firebase auth instance:', {
    appName: auth.app.name,
    appOptions: {
      apiKey: auth.app.options.apiKey?.slice(0, 10) + '...',
      projectId: auth.app.options.projectId,
      appId: auth.app.options.appId,
    }
  })

  if (isFirebaseAuthEmulatorEnabled() && !authEmulatorConnected) {
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL || 'http://127.0.0.1:9099', {
      disableWarnings: true,
    })
    authEmulatorConnected = true
  }

  return auth
}
