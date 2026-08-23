import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Check, ShieldCheck, Zap, Sparkles, CreditCard } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { SubscriptionPlan } from '../../types';
import { NotificationService } from '../../services/notificationService';

export const SubscriptionScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, refreshProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('premium');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { data: plansData, isLoading } = useQuery<{ data: SubscriptionPlan[] }>({
    queryKey: ['subscription_plans'],
    queryFn: async () => {
      const res = await api.get('/payments/plans');
      return res.data;
    },
  });

  const plans = plansData?.data || [];

  const handleCheckout = async (planId: 'basic' | 'premium') => {
    setCheckoutLoading(true);
    try {
      const response = await api.post('/payments/checkout', {
        plan: planId,
        return_url: 'https://tailleurpro.app/success',
        cancel_url: 'https://tailleurpro.app/cancel',
      });

      const { checkout_url, token } = response.data.data;
      if (checkout_url) {
        await NotificationService.playSuccessSoundAndHaptic();
        // Open PayDunya checkout in browser
        await Linking.openURL(checkout_url);
        Alert.alert(
          'Paiement PayDunya Initialisé',
          'Complétez votre paiement sur la page sécurisée PayDunya, puis cliquez sur Vérifier mon paiement.',
          [
            {
              text: 'Vérifier mon paiement',
              onPress: () => handleVerify(token),
            },
            { text: 'Plus tard', style: 'cancel' },
          ]
        );
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erreur lors de l\'initialisation du paiement PayDunya.';
      Alert.alert('Échec de paiement', msg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleVerify = async (token: string) => {
    try {
      const res = await api.get(`/payments/verify?token=${token}`);
      if (res.data?.data?.status === 'active') {
        await NotificationService.playSuccessSoundAndHaptic();
        await refreshProfile();
        Alert.alert('Succès', 'Votre abonnement TailleurPro est maintenant actif !');
      } else {
        Alert.alert('Statut du paiement', `Statut actuel : ${res.data?.data?.status || 'En attente'}`);
      }
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de vérifier le paiement.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight, borderColor: theme.primaryBorder }]}>
            <Sparkles size={28} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            Forfaits & Abonnements
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Débloquez la puissance complète de votre atelier couture
          </Text>
        </View>

        {/* Current Plan Status */}
        <Card style={[styles.statusCard, { backgroundColor: theme.bgElevated }]}>
          <View style={styles.statusRow}>
            <ShieldCheck size={20} color={user?.is_subscribed ? theme.success : theme.warning} />
            <Text style={[styles.statusText, { color: theme.text }]}>
              Statut : {user?.is_subscribed ? 'Abonnement Professionnel Actif' : 'Période d\'essai gratuite'}
            </Text>
          </View>
        </Card>

        {/* Plans Selection */}
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 30 }} />
        ) : (
          <View style={styles.plansContainer}>
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              const isPremium = p.id === 'premium';

              return (
                <Card
                  key={p.id}
                  onPress={() => setSelectedPlan(p.id)}
                  style={[
                    styles.planCard,
                    isSelected && {
                      borderColor: theme.primary,
                      borderWidth: 2,
                      backgroundColor: isPremium ? theme.bgElevated : theme.bgElevated,
                    },
                  ]}
                >
                  {isPremium && (
                    <View style={[styles.popularBadge, { backgroundColor: theme.primary }]}>
                      <Text style={[styles.popularText, { color: theme.mode === 'dark' ? '#121212' : '#FFFFFF' }]}>
                        Recommandé
                      </Text>
                    </View>
                  )}

                  <Text style={[styles.planName, { color: theme.text }]}>{p.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.planPrice, { color: theme.primaryDark }]}>
                      {p.price.toLocaleString()} {p.currency}
                    </Text>
                    <Text style={[styles.planPeriod, { color: theme.textMuted }]}>/ {p.period}</Text>
                  </View>

                  {/* Feature Bullets */}
                  <View style={styles.featuresList}>
                    {p.features.map((feat, fIdx) => (
                      <View key={fIdx} style={styles.featureItem}>
                        <Check size={16} color={theme.success} />
                        <Text style={[styles.featureText, { color: theme.text }]}>
                          {feat}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <Button
                    title={`Payer ${p.price.toLocaleString()} FCFA avec PayDunya`}
                    icon={<CreditCard size={18} color="#FFFFFF" />}
                    onPress={() => handleCheckout(p.id)}
                    loading={checkoutLoading && selectedPlan === p.id}
                    variant={isPremium ? 'primary' : 'secondary'}
                    style={{ marginTop: 16 }}
                  />
                </Card>
              );
            })}
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  statusCard: {
    padding: 14,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    padding: 20,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700',
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '800',
  },
  planPeriod: {
    fontSize: 14,
    marginLeft: 6,
  },
  featuresList: {
    marginTop: 10,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 13,
    marginLeft: 8,
  },
});
