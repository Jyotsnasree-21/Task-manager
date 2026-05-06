import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Button, Input } from '../components';
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  function validate(): boolean {
    let valid = true;
    if (!email.trim()) { setEmailError('Email is required'); valid = false; } else { setEmailError(''); }
    if (!password) { setPasswordError('Password is required'); valid = false; } else { setPasswordError(''); }
    return valid;
  }

  async function handleLogin() {
    if (!validate()) return;
    setGlobalError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setGlobalError(e.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }



  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../assets/images/onboarding-hero.png')}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.logoChip}>
              <Text style={styles.logoIcon}>✓</Text>
            </View>
            <Text style={styles.heroTitle}>TaskFlow</Text>
            <Text style={styles.heroSubtitle}>Role-Based Task Manager</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

          {globalError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{globalError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Email address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              error={emailError}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock"
              error={passwordError}
            />
            <Button label="Sign In" onPress={handleLogin} loading={loading} fullWidth size="lg" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { flexGrow: 1 },

  heroContainer: { height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  logoChip: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  logoIcon: { fontSize: 26, color: Colors.textInverse, fontWeight: '700' },
  heroTitle: { ...Typography.h1, color: Colors.textInverse },
  heroSubtitle: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.75)' },

  card: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Spacing.xl,
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    flex: 1,
    gap: Spacing.base,
    ...Shadow.lg,
  },
  cardTitle: { ...Typography.h2, color: Colors.text },
  cardSubtitle: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: -Spacing.sm },

  errorBanner: {
    backgroundColor: Colors.errorLight,
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  errorBannerText: { ...Typography.bodySmall, color: Colors.error },

  form: { gap: Spacing.base },
});
