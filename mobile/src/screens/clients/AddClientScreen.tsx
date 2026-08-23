import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ArrowLeft, User, Phone, MapPin, Ruler } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { MeasurementInput } from '../../components/MeasurementInput';
import { SyncService } from '../../services/syncService';
import { NotificationService } from '../../services/notificationService';
import { Client } from '../../types';

export const AddClientScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const existingClient: Client | undefined = route.params?.client;

  const [fullName, setFullName] = useState(existingClient?.full_name || '');
  const [phone, setPhone] = useState(existingClient?.phone || '');
  const [email, setEmail] = useState(existingClient?.email || '');
  const [address, setAddress] = useState(existingClient?.address || '');
  const [notes, setNotes] = useState(existingClient?.notes || '');

  // Measurements State
  const m = existingClient?.measurement;
  const [neck, setNeck] = useState(m?.neck?.toString() || '');
  const [chest, setChest] = useState(m?.chest?.toString() || '');
  const [shoulder, setShoulder] = useState(m?.shoulder?.toString() || '');
  const [armLength, setArmLength] = useState(m?.arm_length?.toString() || '');
  const [belly, setBelly] = useState(m?.belly?.toString() || '');
  const [boubouLength, setBoubouLength] = useState(m?.boubou_length?.toString() || '');
  const [pantLength, setPantLength] = useState(m?.pant_length?.toString() || '');
  const [hips, setHips] = useState(m?.hips?.toString() || '');
  const [thigh, setThigh] = useState(m?.thigh?.toString() || '');
  const [biceps, setBiceps] = useState(m?.biceps?.toString() || '');

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName || !phone) {
      Alert.alert('Champs obligatoires', 'Veuillez renseigner le nom complet et le numéro de téléphone.');
      return;
    }

    setLoading(true);
    const payload = {
      full_name: fullName,
      phone,
      email: email || null,
      address: address || null,
      notes: notes || null,
      measurements: {
        neck: neck ? parseFloat(neck) : null,
        chest: chest ? parseFloat(chest) : null,
        shoulder: shoulder ? parseFloat(shoulder) : null,
        arm_length: armLength ? parseFloat(armLength) : null,
        belly: belly ? parseFloat(belly) : null,
        boubou_length: boubouLength ? parseFloat(boubouLength) : null,
        pant_length: pantLength ? parseFloat(pantLength) : null,
        hips: hips ? parseFloat(hips) : null,
        thigh: thigh ? parseFloat(thigh) : null,
        biceps: biceps ? parseFloat(biceps) : null,
      },
    };

    try {
      if (existingClient) {
        await api.put(`/clients/${existingClient.id}`, payload);
      } else {
        await api.post('/clients', payload);
      }

      await NotificationService.playSuccessSoundAndHaptic();
      queryClient.invalidateQueries({ queryKey: ['clients_list'] });
      queryClient.invalidateQueries({ queryKey: ['client_detail', existingClient?.id] });
      navigation.goBack();
    } catch (error: any) {
      // If network fails, queue offline
      await SyncService.queueOfflineClient(payload);
      await NotificationService.playSuccessSoundAndHaptic();
      Alert.alert('Enregistré Hors-Ligne', 'Le client a été enregistré sur votre appareil et sera synchronisé automatiquement.');
      navigation.goBack();
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
        {/* Header */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.text }]}>
            {existingClient ? 'Modifier le Client' : 'Nouveau Client & Mesures'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Section: Informations Générales */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Informations du Client
          </Text>

          <Input
            label="Nom & Prénom *"
            placeholder="Ex: Modou Fall"
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<User size={18} color={theme.textSubtle} />}
          />

          <Input
            label="Téléphone *"
            placeholder="Ex: 77 111 22 33"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={18} color={theme.textSubtle} />}
          />

          <Input
            label="Adresse / Ville"
            placeholder="Ex: Dakar, Almadies"
            value={address}
            onChangeText={setAddress}
            leftIcon={<MapPin size={18} color={theme.textSubtle} />}
          />

          {/* Section: Mensurations (cm) */}
          <View style={styles.measurementsHeader}>
            <Ruler size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 8 }]}>
              Mensurations (en centimètres)
            </Text>
          </View>

          <View style={styles.grid}>
            <MeasurementInput label="Tour de Cou" value={neck} onChangeValue={setNeck} />
            <MeasurementInput label="Tour de Poitrine" value={chest} onChangeValue={setChest} />
            <MeasurementInput label="Largeur Épaule" value={shoulder} onChangeValue={setShoulder} />
            <MeasurementInput label="Longueur Bras" value={armLength} onChangeValue={setArmLength} />
            <MeasurementInput label="Tour de Ventre" value={belly} onChangeValue={setBelly} />
            <MeasurementInput label="Longueur Boubou" value={boubouLength} onChangeValue={setBoubouLength} />
            <MeasurementInput label="Longueur Pantalon" value={pantLength} onChangeValue={setPantLength} />
            <MeasurementInput label="Tour de Hanches" value={hips} onChangeValue={setHips} />
            <MeasurementInput label="Tour de Cuisse" value={thigh} onChangeValue={setThigh} />
            <MeasurementInput label="Tour de Biceps" value={biceps} onChangeValue={setBiceps} />
          </View>

          <Input
            label="Notes de coupe & préférences tissu"
            placeholder="Ex: Préfère les coupes cintrées, col Mao..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            containerStyle={{ marginTop: 8 }}
          />

          <Button
            title={existingClient ? 'Enregistrer les modifications' : 'Créer la fiche client'}
            onPress={handleSave}
            loading={loading}
            style={{ marginTop: 24, marginBottom: 20 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  measurementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
});
