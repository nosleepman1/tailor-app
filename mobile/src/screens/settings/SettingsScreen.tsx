import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  User,
  Moon,
  Sun,
  Shield,
  RefreshCw,
  Bell,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { SyncService } from '../../services/syncService';
import { NotificationService } from '../../services/notificationService';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  const [syncing, setSyncing] = useState(false);

  const handleManualSync = async () => {
    setSyncing(true);
    const result = await SyncService.synchronize();
    setSyncing(false);

    if (result.success) {
      await NotificationService.playSuccessSoundAndHaptic();
      Alert.alert('Synchronisation réussie', 'Toutes les données de votre atelier sont à jour avec le serveur.');
    } else {
      Alert.alert('Mode Hors-Ligne', 'Impossible de contacter le serveur. Vos modifications restent enregistrées localement.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter de votre atelier ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
            <User size={32} color={theme.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {user?.name || 'Mon Atelier'}
            </Text>
            <Text style={[styles.profilePhone, { color: theme.textMuted }]}>
              {user?.phone}
            </Text>
            <Text style={[styles.profileCity, { color: theme.textSubtle }]}>
              {user?.city || 'Sénégal'}
            </Text>
          </View>
        </Card>

        {/* Section: Préférences & Affichage */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Affichage & Thème
        </Text>
        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              {isDark ? (
                <Moon size={20} color={theme.primary} />
              ) : (
                <Sun size={20} color={theme.primary} />
              )}
              <Text style={[styles.menuText, { color: theme.text }]}>
                Mode Sombre (Atelier Nuit)
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isDark ? theme.bgElevated : '#FFFFFF'}
            />
          </View>
        </Card>

        {/* Section: Données & Synchronisation */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Synchronisation & Réseau
        </Text>
        <Card style={styles.menuCard}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleManualSync}
            disabled={syncing}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <RefreshCw size={20} color={theme.primary} />
              <Text style={[styles.menuText, { color: theme.text }]}>
                {syncing ? 'Synchronisation en cours...' : 'Forcer la synchronisation locale'}
              </Text>
            </View>
            <ChevronRight size={18} color={theme.textSubtle} />
          </TouchableOpacity>
        </Card>

        {/* Section: Notifications */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Notifications & Sons
        </Text>
        <Card style={styles.menuCard}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => NotificationService.registerForPushNotifications()}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Bell size={20} color={theme.primary} />
              <Text style={[styles.menuText, { color: theme.text }]}>
                Activer les alertes push & rappels d'échéances
              </Text>
            </View>
            <ChevronRight size={18} color={theme.textSubtle} />
          </TouchableOpacity>
        </Card>

        {/* Section: Abonnement */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Abonnement PayDunya
        </Text>
        <Card style={styles.menuCard}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Subscription')}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Sparkles size={20} color={theme.primary} />
              <Text style={[styles.menuText, { color: theme.text }]}>
                Gérer mon forfait TailleurPro
              </Text>
            </View>
            <ChevronRight size={18} color={theme.textSubtle} />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <Button
          title="Se déconnecter de l'Atelier"
          icon={<LogOut size={18} color="#FFFFFF" />}
          variant="danger"
          onPress={handleLogout}
          style={{ marginTop: 24, marginBottom: 30 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profilePhone: {
    fontSize: 14,
    marginTop: 2,
  },
  profileCity: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    padding: 4,
    marginBottom: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
});
