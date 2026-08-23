import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Phone, MapPin, Edit3, PlusCircle, Ruler, Scissors, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Client, Commande } from '../../types';

export const ClientDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { clientId } = route.params;
  const { theme } = useTheme();

  const { data, isLoading, refetch } = useQuery<{ data: Client }>({
    queryKey: ['client_detail', clientId],
    queryFn: async () => {
      const res = await api.get(`/clients/${clientId}`);
      return res.data;
    },
  });

  const client = data?.data;
  const m = client?.measurement;

  if (isLoading || !client) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  const measurementsList = [
    { label: 'Tour de Cou', val: m?.neck },
    { label: 'Tour de Poitrine', val: m?.chest },
    { label: 'Largeur Épaule', val: m?.shoulder },
    { label: 'Longueur Bras', val: m?.arm_length },
    { label: 'Tour de Ventre', val: m?.belly },
    { label: 'Longueur Boubou', val: m?.boubou_length },
    { label: 'Longueur Pantalon', val: m?.pant_length },
    { label: 'Tour de Hanches', val: m?.hips },
    { label: 'Tour de Cuisse', val: m?.thigh },
    { label: 'Tour de Biceps', val: m?.biceps },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.text }]}>Fiche Client</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddClient', { client })}
          style={styles.editBtn}
        >
          <Edit3 size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Client Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarLarge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.avatarLargeText, { color: theme.primaryDark }]}>
                {client.full_name?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.clientName, { color: theme.text }]}>
                {client.full_name}
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${client.phone}`)}
                style={styles.phoneRow}
              >
                <Phone size={14} color={theme.primary} />
                <Text style={[styles.phoneText, { color: theme.primary }]}>
                  {client.phone}
                </Text>
              </TouchableOpacity>
              {client.address && (
                <View style={styles.addressRow}>
                  <MapPin size={14} color={theme.textSubtle} />
                  <Text style={[styles.addressText, { color: theme.textMuted }]}>
                    {client.address}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Create Order Button */}
          <Button
            title="Nouvelle commande pour ce client"
            icon={<PlusCircle size={18} color="#FFFFFF" />}
            onPress={() => navigation.navigate('AddCommande', { clientId: client.id })}
            style={{ marginTop: 16 }}
          />
        </Card>

        {/* Measurements Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ruler size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Fiche de Mensurations (cm)
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddClient', { client })}
          >
            <Text style={[styles.editLink, { color: theme.primary }]}>Modifier</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.measurementsCard}>
          <View style={styles.measurementsGrid}>
            {measurementsList.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.measureBox,
                  { backgroundColor: theme.bgLevel2, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.measureLabel, { color: theme.textMuted }]}>
                  {item.label}
                </Text>
                <Text style={[styles.measureValue, { color: theme.text }]}>
                  {item.val ? `${item.val} cm` : '—'}
                </Text>
              </View>
            ))}
          </View>
          {m?.notes && (
            <View style={styles.notesBox}>
              <Text style={[styles.notesLabel, { color: theme.textMuted }]}>Notes particulières :</Text>
              <Text style={[styles.notesText, { color: theme.text }]}>{m.notes}</Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  editBtn: {
    padding: 4,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    padding: 16,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarLargeText: {
    fontSize: 24,
    fontWeight: '700',
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 13,
    marginLeft: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  editLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  measurementsCard: {
    padding: 12,
    marginBottom: 24,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  measureBox: {
    width: '48%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  measureLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  measureValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  notesBox: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#E8E4D944',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  notesText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});
