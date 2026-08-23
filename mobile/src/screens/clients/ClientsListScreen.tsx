import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Search, Phone, Plus, User, Ruler } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Client } from '../../types';

export const ClientsListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch, isRefetching } = useQuery<{
    data: Client[];
  }>({
    queryKey: ['clients_list', search],
    queryFn: async () => {
      const res = await api.get('/clients', {
        params: { search: search || undefined },
      });
      return res.data;
    },
  });

  const clients = data?.data || [];

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderClientItem = ({ item }: { item: Client }) => {
    const hasMeasurements = !!item.measurement;

    return (
      <Card
        onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}
        style={styles.clientCard}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.avatarText, { color: theme.primaryDark }]}>
              {item.full_name?.charAt(0)?.toUpperCase() || 'C'}
            </Text>
          </View>

          <View style={styles.clientInfo}>
            <Text style={[styles.clientName, { color: theme.text }]}>
              {item.full_name}
            </Text>
            <Text style={[styles.clientPhone, { color: theme.textMuted }]}>
              {item.phone}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleCall(item.phone)}
            style={[styles.callBtn, { backgroundColor: theme.bgLevel2, borderColor: theme.border }]}
          >
            <Phone size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.measurementBadge}>
            <Ruler size={13} color={hasMeasurements ? theme.success : theme.textSubtle} />
            <Text
              style={[
                styles.measurementText,
                { color: hasMeasurements ? theme.success : theme.textSubtle },
              ]}
            >
              {hasMeasurements ? 'Mesures renseignées' : 'Pas de mesures'}
            </Text>
          </View>

          {item.active_commandes_count !== undefined && item.active_commandes_count > 0 && (
            <Badge
              label={`${item.active_commandes_count} en cours`}
              variant="gold"
            />
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Search Header */}
      <View style={styles.searchSection}>
        <Input
          placeholder="Rechercher un client (nom, téléphone)..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Search size={18} color={theme.textSubtle} />}
          containerStyle={{ flex: 1, marginVertical: 0 }}
        />
      </View>

      {/* Clients FlatList */}
      <FlatList
        data={clients}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderClientItem}
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
              <User size={48} color={theme.textSubtle} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Aucun client trouvé
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                Ajoutez votre premier client pour enregistrer ses mesures.
              </Text>
            </View>
          ) : null
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddClient')}
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
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  clientCard: {
    padding: 14,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
  },
  clientPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#E8E4D933',
  },
  measurementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementText: {
    fontSize: 12,
    fontWeight: '500',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});
