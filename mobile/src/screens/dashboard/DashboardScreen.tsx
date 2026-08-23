import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import {
  Scissors,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertCircle,
  PlusCircle,
  Camera,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { OfflineBanner } from '../../components/OfflineBanner';
import { DashboardStats, Commande } from '../../types';

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const { data, isLoading, refetch, isRefetching } = useQuery<{
    role: string;
    stats: DashboardStats;
  }>({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data.data;
    },
  });

  const stats = data?.stats;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <OfflineBanner />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isRefetching}
            onRefresh={refetch}
            tintColor={theme.primary}
          />
        }
      >
        {/* Atelier Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textMuted }]}>
              Bonjour,
            </Text>
            <Text style={[styles.atelierName, { color: theme.text }]}>
              {user?.name || 'Atelier'}
            </Text>
          </View>
          <View style={[styles.badgeContainer, { backgroundColor: theme.primaryLight, borderColor: theme.primaryBorder }]}>
            <Scissors size={14} color={theme.primary} />
            <Text style={[styles.badgeText, { color: theme.primaryDark }]}>
              {user?.is_subscribed ? 'Abonnement Actif' : 'Essai Gratuit'}
            </Text>
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddCommande')}
            style={[styles.actionBtn, { backgroundColor: theme.primary }]}
          >
            <PlusCircle size={18} color={theme.mode === 'dark' ? '#121212' : '#FFFFFF'} />
            <Text style={[styles.actionBtnText, { color: theme.mode === 'dark' ? '#121212' : '#FFFFFF' }]}>
              Nouvelle Commande
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddClient')}
            style={[styles.actionBtn, { backgroundColor: theme.slate }]}
          >
            <Users size={18} color="#FFFFFF" />
            <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>
              Nouveau Client
            </Text>
          </TouchableOpacity>
        </View>

        {/* KPI Stats Grid */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Activité de l'Atelier
        </Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="En confection"
            value={stats?.orders_in_progress ?? 0}
            subtitle="Commandes actives"
            icon={<Clock size={18} color={theme.primary} />}
            accentColor={theme.primary}
          />
          <StatCard
            title="Prêtes"
            value={stats?.orders_ready ?? 0}
            subtitle="À essayer ou livrer"
            icon={<CheckCircle2 size={18} color={theme.success} />}
            accentColor={theme.success}
          />
          <StatCard
            title="Échéances 7J"
            value={stats?.deliveries_this_week ?? 0}
            subtitle="Livraisons prévues"
            icon={<Calendar size={18} color={theme.warning} />}
            accentColor={theme.warning}
          />
          <StatCard
            title="Dettes Clients"
            value={`${(stats?.total_debtors_amount ?? 0).toLocaleString()} F`}
            subtitle="Reliquats à encaisser"
            icon={<AlertCircle size={18} color={theme.error} />}
            accentColor={theme.error}
          />
        </View>

        {/* Revenue Banner */}
        <Card style={[styles.revenueCard, { backgroundColor: theme.bgElevated }]}>
          <View style={styles.revenueHeader}>
            <DollarSign size={20} color={theme.primary} />
            <Text style={[styles.revenueTitle, { color: theme.textMuted }]}>
              Chiffre d'affaires du mois
            </Text>
          </View>
          <Text style={[styles.revenueAmount, { color: theme.text }]}>
            {(stats?.total_revenue_month ?? 0).toLocaleString()} FCFA
          </Text>
        </Card>

        {/* Recent Commandes */}
        {stats?.recent_commandes && stats.recent_commandes.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Dernières Commandes
            </Text>
            {stats.recent_commandes.map((cmd: Commande) => (
              <Card
                key={cmd.id}
                onPress={() => navigation.navigate('CommandeDetail', { commandeId: cmd.id })}
                style={styles.commandeCard}
              >
                <View style={styles.cmdRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cmdClient, { color: theme.text }]}>
                      {cmd.client?.full_name || `Client #${cmd.client_id}`}
                    </Text>
                    <Text style={[styles.cmdFabric, { color: theme.textMuted }]}>
                      {cmd.fabric_description}
                    </Text>
                  </View>
                  <Badge status={cmd.status} />
                </View>
                <View style={styles.cmdFooter}>
                  <Text style={[styles.cmdPrice, { color: theme.primaryDark }]}>
                    {cmd.price.toLocaleString()} FCFA
                  </Text>
                  {cmd.due_date && (
                    <Text style={[styles.cmdDate, { color: theme.textSubtle }]}>
                      Livraison : {new Date(cmd.due_date).toLocaleDateString('fr-FR')}
                    </Text>
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
  },
  atelierName: {
    fontSize: 20,
    fontWeight: '700',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 16,
  },
  revenueCard: {
    padding: 16,
    marginBottom: 24,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  revenueTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  revenueAmount: {
    fontSize: 26,
    fontWeight: '700',
  },
  recentSection: {
    marginTop: 8,
  },
  commandeCard: {
    padding: 14,
    marginBottom: 10,
  },
  cmdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cmdClient: {
    fontSize: 15,
    fontWeight: '600',
  },
  cmdFabric: {
    fontSize: 13,
    marginTop: 2,
  },
  cmdFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  cmdPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  cmdDate: {
    fontSize: 12,
  },
});
