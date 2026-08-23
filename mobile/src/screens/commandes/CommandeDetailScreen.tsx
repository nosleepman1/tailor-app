import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  Phone,
  Scissors,
  CheckCircle2,
  Clock,
  Truck,
  DollarSign,
  AlertCircle,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { NotificationService } from '../../services/notificationService';
import { Commande, CommandeStatus } from '../../types';

export const CommandeDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { commandeId } = route.params;
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { data, isLoading, refetch } = useQuery<{ data: Commande }>({
    queryKey: ['commande_detail', commandeId],
    queryFn: async () => {
      const res = await api.get(`/commandes/${commandeId}`);
      return res.data;
    },
  });

  const commande = data?.data;

  if (isLoading || !commande) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  const remaining = Math.max(0, commande.price - commande.deposit_paid);

  const handleUpdateStatus = async (newStatus: CommandeStatus) => {
    setUpdatingStatus(true);
    try {
      await api.patch(`/commandes/${commande.id}/status`, { status: newStatus });
      await NotificationService.playSuccessSoundAndHaptic();
      queryClient.invalidateQueries({ queryKey: ['commande_detail', commande.id] });
      queryClient.invalidateQueries({ queryKey: ['commandes_list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      refetch();
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.text }]}>Détails de la Commande</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Main Info Card */}
        <Card style={styles.mainCard}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.clientName, { color: theme.text }]}>
                {commande.client?.full_name}
              </Text>
              {commande.client?.phone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${commande.client?.phone}`)}
                  style={styles.phoneRow}
                >
                  <Phone size={14} color={theme.primary} />
                  <Text style={[styles.phoneText, { color: theme.primary }]}>
                    {commande.client.phone}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Badge status={commande.status} />
          </View>

          <Text style={[styles.fabricDesc, { color: theme.text }]}>
            {commande.fabric_description}
          </Text>

          {commande.due_date && (
            <View style={styles.dueRow}>
              <Calendar size={15} color={theme.primary} />
              <Text style={[styles.dueText, { color: theme.textMuted }]}>
                Échéance de livraison : {new Date(commande.due_date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}
        </Card>

        {/* Status Stepper Actions */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Cycle de Confection
        </Text>
        <Card style={styles.statusCard}>
          <View style={styles.stepperContainer}>
            {commande.status === 'pending' && (
              <Button
                title="Lancer la confection en atelier"
                icon={<Scissors size={18} color="#FFFFFF" />}
                onPress={() => handleUpdateStatus('in_progress')}
                loading={updatingStatus}
                variant="primary"
              />
            )}

            {commande.status === 'in_progress' && (
              <Button
                title="Marquer comme Prête pour essayage"
                icon={<CheckCircle2 size={18} color="#FFFFFF" />}
                onPress={() => handleUpdateStatus('ready')}
                loading={updatingStatus}
                variant="primary"
              />
            )}

            {commande.status === 'ready' && (
              <Button
                title="Confirmer la livraison au client"
                icon={<Truck size={18} color="#FFFFFF" />}
                onPress={() => handleUpdateStatus('delivered')}
                loading={updatingStatus}
                variant="secondary"
              />
            )}

            {commande.status === 'delivered' && (
              <View style={styles.completedBox}>
                <CheckCircle2 size={24} color={theme.success} />
                <Text style={[styles.completedText, { color: theme.success }]}>
                  Commande livrée avec succès !
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Financial Summary Card */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Règlement Financier
        </Text>
        <Card style={styles.financialCard}>
          <View style={styles.finRow}>
            <Text style={[styles.finLabel, { color: theme.textMuted }]}>Montant Total</Text>
            <Text style={[styles.finVal, { color: theme.text }]}>
              {commande.price.toLocaleString()} FCFA
            </Text>
          </View>

          <View style={styles.finRow}>
            <Text style={[styles.finLabel, { color: theme.textMuted }]}>Acompte Encaissé</Text>
            <Text style={[styles.finVal, { color: theme.success }]}>
              {commande.deposit_paid.toLocaleString()} FCFA
            </Text>
          </View>

          <View style={[styles.finRow, styles.totalRow]}>
            <Text style={[styles.finLabelBold, { color: theme.text }]}>Reliquat Restant</Text>
            <Text
              style={[
                styles.finValBold,
                { color: remaining > 0 ? theme.error : theme.success },
              ]}
            >
              {remaining.toLocaleString()} FCFA
            </Text>
          </View>
        </Card>

        {/* Attached Photos */}
        {commande.images && commande.images.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Photos du Modèle & Tissu
            </Text>
            <ScrollView horizontal style={styles.photosScroll}>
              {commande.images.map((imgUri, idx) => (
                <Image key={idx} source={{ uri: imgUri }} style={styles.modelPhoto} />
              ))}
            </ScrollView>
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
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  mainCard: {
    padding: 16,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  fabricDesc: {
    fontSize: 15,
    marginVertical: 10,
    lineHeight: 22,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dueText: {
    fontSize: 13,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  statusCard: {
    padding: 16,
    marginBottom: 20,
  },
  stepperContainer: {
    alignItems: 'stretch',
  },
  completedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  completedText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  financialCard: {
    padding: 16,
    marginBottom: 20,
  },
  finRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalRow: {
    borderTopWidth: 0.5,
    borderTopColor: '#E8E4D944',
    marginTop: 6,
    paddingTop: 10,
  },
  finLabel: {
    fontSize: 14,
  },
  finVal: {
    fontSize: 15,
    fontWeight: '600',
  },
  finLabelBold: {
    fontSize: 15,
    fontWeight: '700',
  },
  finValBold: {
    fontSize: 17,
    fontWeight: '700',
  },
  photosScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  modelPhoto: {
    width: 140,
    height: 180,
    borderRadius: 12,
    marginRight: 10,
  },
});
