import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Plus, Scissors, Calendar, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Commande, CommandeStatus } from '../../types';

export const CommandesListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data, isLoading, refetch, isRefetching } = useQuery<{
    data: Commande[];
  }>({
    queryKey: ['commandes_list', selectedStatus],
    queryFn: async () => {
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const res = await api.get('/commandes', { params });
      return res.data;
    },
  });

  const commandes = data?.data || [];

  const filterTabs = [
    { id: 'all', label: 'Toutes' },
    { id: 'in_progress', label: 'En confection' },
    { id: 'ready', label: 'Prêtes' },
    { id: 'delivered', label: 'Livrées' },
  ];

  const renderCommandeItem = ({ item }: { item: Commande }) => {
    const remaining = Math.max(0, item.price - item.deposit_paid);

    return (
      <Card
        onPress={() => navigation.navigate('CommandeDetail', { commandeId: item.id })}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.clientName, { color: theme.text }]}>
              {item.client?.full_name || `Client #${item.client_id}`}
            </Text>
            <Text style={[styles.fabricDescription, { color: theme.textMuted }]}>
              {item.fabric_description}
            </Text>
          </View>
          <Badge status={item.status} />
        </View>

        <View style={styles.financialRow}>
          <View>
            <Text style={[styles.priceLabel, { color: theme.textSubtle }]}>Prix total</Text>
            <Text style={[styles.priceVal, { color: theme.text }]}>
              {item.price.toLocaleString()} F
            </Text>
          </View>

          <View>
            <Text style={[styles.priceLabel, { color: theme.textSubtle }]}>Acompte</Text>
            <Text style={[styles.priceVal, { color: theme.success }]}>
              {item.deposit_paid.toLocaleString()} F
            </Text>
          </View>

          <View>
            <Text style={[styles.priceLabel, { color: theme.textSubtle }]}>Reliquat</Text>
            <Text
              style={[
                styles.priceVal,
                { color: remaining > 0 ? theme.error : theme.textMuted },
              ]}
            >
              {remaining.toLocaleString()} F
            </Text>
          </View>
        </View>

        {item.due_date && (
          <View style={[styles.footer, { borderTopColor: `${theme.border}44` }]}>
            <View style={styles.dateRow}>
              <Calendar size={14} color={theme.primary} />
              <Text style={[styles.dateText, { color: theme.textMuted }]}>
                Livraison : {new Date(item.due_date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            {item.event && (
              <Badge label={item.event.name} variant="gold" />
            )}
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        {filterTabs.map((tab) => {
          const active = selectedStatus === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => setSelectedStatus(tab.id)}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: active ? theme.primary : theme.bgElevated,
                  borderColor: active ? theme.primary : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: active ? (theme.mode === 'dark' ? '#121212' : '#FFFFFF') : theme.textMuted },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Orders List */}
      <FlatList
        data={commandes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCommandeItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isRefetching}
            onRefresh={refetch}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Scissors size={48} color={theme.textSubtle} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Aucune commande trouvée
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                Créez une nouvelle commande avec choix du tissu et photos de modèles.
              </Text>
            </View>
          ) : null
        }
      />

      {/* FAB Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddCommande')}
        style={[styles.fab, { backgroundColor: theme.primary }]}
      >
        <Plus size={24} color={theme.mode === 'dark' ? '#121212' : '#FFFFFF'} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    padding: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
  },
  fabricDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  priceVal: {
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
