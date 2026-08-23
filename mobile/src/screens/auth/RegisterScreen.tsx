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
import { Scissors, Lock, Smartphone, Mail, User, MapPin } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone) {
      Alert.alert('Champs obligatoires', 'Le nom de votre atelier et votre numéro de téléphone sont obligatoires.');
      return;
    }

    if (!pin && !password) {
      Alert.alert('Sécurité', 'Veuillez définir au moins un code PIN à 4 chiffres ou un mot de passe.');
      return;
    }

    if (pin && pin.length !== 4) {
      Alert.alert('Code PIN invalide', 'Le code PIN doit comporter exactement 4 chiffres.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        phone,
        email: email || undefined,
        city: city || undefined,
        pin: pin || undefined,
        password: password || undefined,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de la création du compte.';
      Alert.alert('Inscription impossible', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoCircle, { backgroundColor: theme.primaryLight, borderColor: theme.primaryBorder }]}>
              <Scissors size={28} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Créer un compte Atelier</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              Rejoignez les meilleurs artisans tailleurs
            </Text>
          </View>

          {/* Form Fields */}
          <Input
            label="Nom de l'atelier / Tailleur *"
            placeholder="Ex: Atelier Makhtoum Couture"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={18} color={theme.textSubtle} />}
          />

          <Input
            label="Téléphone *"
            placeholder="Ex: 77 123 45 67"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Smartphone size={18} color={theme.textSubtle} />}
          />

          <Input
            label="Email (optionnel)"
            placeholder="contact@atelier.sn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color={theme.textSubtle} />}
          />

          <Input
            label="Ville / Quartier"
            placeholder="Ex: Dakar, Médina"
            value={city}
            onChangeText={setCity}
            leftIcon={<MapPin size={18} color={theme.textSubtle} />}
          />

          <Input
            label="Code PIN rapide (4 chiffres)"
            placeholder="Ex: 1234"
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            leftIcon={<Lock size={18} color={theme.textSubtle} />}
          />

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={18} color={theme.textSubtle} />}
          />

          <Button
            title="Créer mon atelier"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: 16 }}
          />

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Vous avez déjà un compte ?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: theme.primary }]}>
                Se connecter
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
});
