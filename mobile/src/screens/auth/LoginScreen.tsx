import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Scissors, Lock, Smartphone, Mail } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { PinPad } from '../../components/PinPad';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuth();

  const [authMode, setAuthMode] = useState<'pin' | 'password'>('pin');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (overridePin?: string) => {
    const activePinOrPassword = overridePin || (authMode === 'pin' ? pin : password);

    if (!phoneOrEmail) {
      Alert.alert('Erreur', 'Veuillez saisir votre numéro de téléphone ou email.');
      return;
    }

    if (!activePinOrPassword) {
      Alert.alert('Erreur', authMode === 'pin' ? 'Veuillez saisir votre code PIN à 4 chiffres.' : 'Veuillez saisir votre mot de passe.');
      return;
    }

    setLoading(true);
    try {
      await login(phoneOrEmail, activePinOrPassword);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Identifiants incorrects ou compte inactif.';
      Alert.alert('Échec de connexion', message);
      if (authMode === 'pin') setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (newPin: string) => {
    setPin(newPin);
    if (newPin.length === 4 && phoneOrEmail) {
      handleLogin(newPin);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Logo & Brand Header */}
          <View style={styles.header}>
            <View style={[styles.logoCircle, { backgroundColor: theme.primaryLight, borderColor: theme.primaryBorder }]}>
              <Scissors size={32} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>TailleurPro</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              L'excellence et la précision de votre atelier
            </Text>
          </View>

          {/* Mode Switch Tabs */}
          <View style={[styles.modeTabs, { backgroundColor: theme.bgLevel2, borderColor: theme.border }]}>
            <TouchableOpacity
              onPress={() => setAuthMode('pin')}
              style={[
                styles.modeTab,
                authMode === 'pin' && { backgroundColor: theme.bgElevated },
              ]}
            >
              <Smartphone size={16} color={authMode === 'pin' ? theme.primary : theme.textMuted} />
              <Text style={[styles.modeTabText, { color: authMode === 'pin' ? theme.text : theme.textMuted }]}>
                Code PIN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAuthMode('password')}
              style={[
                styles.modeTab,
                authMode === 'password' && { backgroundColor: theme.bgElevated },
              ]}
            >
              <Mail size={16} color={authMode === 'password' ? theme.primary : theme.textMuted} />
              <Text style={[styles.modeTabText, { color: authMode === 'password' ? theme.text : theme.textMuted }]}>
                Mot de passe
              </Text>
            </TouchableOpacity>
          </View>

          {/* Phone / Email Input */}
          <Input
            label={authMode === 'pin' ? 'Numéro de téléphone' : 'Email ou Téléphone'}
            placeholder={authMode === 'pin' ? '77 123 45 67' : 'atelier@couture.sn'}
            value={phoneOrEmail}
            onChangeText={setPhoneOrEmail}
            keyboardType={authMode === 'pin' ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
            leftIcon={<Smartphone size={18} color={theme.textSubtle} />}
          />

          {/* PIN Pad Mode */}
          {authMode === 'pin' ? (
            <View style={styles.pinSection}>
              <Text style={[styles.pinLabel, { color: theme.textMuted }]}>
                Entrez votre code PIN à 4 chiffres
              </Text>
              <PinPad pin={pin} onPinChange={handlePinChange} />
              <Button
                title="Se connecter"
                onPress={() => handleLogin()}
                loading={loading}
                disabled={pin.length < 4 || !phoneOrEmail}
                style={{ marginTop: 12 }}
              />
            </View>
          ) : (
            /* Password Mode */
            <View style={styles.passwordSection}>
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Lock size={18} color={theme.textSubtle} />}
              />
              <Button
                title="Se connecter"
                onPress={() => handleLogin()}
                loading={loading}
                disabled={!password || !phoneOrEmail}
                style={{ marginTop: 16 }}
              />
            </View>
          )}

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Pas encore de compte atelier ?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.registerLink, { color: theme.primary }]}>
                Créer un compte tailleur
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  modeTabs: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  pinSection: {
    alignItems: 'center',
    marginTop: 12,
  },
  pinLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  passwordSection: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
});
