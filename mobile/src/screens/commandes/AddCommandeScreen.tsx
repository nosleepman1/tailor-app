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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Camera, Image as ImageIcon, X, Scissors, Calendar, DollarSign } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { NotificationService } from '../../services/notificationService';
import { SyncService } from '../../services/syncService';
import { Client, EventItem } from '../../types';

export const AddCommandeScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const preselectedClientId: number | undefined = route.params?.clientId;

  const [selectedClientId, setSelectedClientId] = useState<number | null>(preselectedClientId || null);
  const [fabricDescription, setFabricDescription] = useState('');
  const [price, setPrice] = useState('');
  const [depositPaid, setDepositPaid] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Clients list for dropdown selector
  const { data: clientsData } = useQuery<{ data: Client[] }>({
    queryKey: ['clients_selector'],
    queryFn: async () => {
      const res = await api.get('/clients');
      return res.data;
    },
  });

  // Fetch Events list (Tabaski, Korité, etc.)
  const { data: eventsData } = useQuery<{ data: EventItem[] }>({
    queryKey: ['events_list'],
    queryFn: async () => {
      const res = await api.get('/events/upcoming');
      return res.data;
    },
  });

  const clients = clientsData?.data || [];
  const events = eventsData?.data || [];

  // Native Camera capture
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'L\'accès à l\'appareil photo est nécessaire pour capturer les modèles.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  // Native Gallery Picker
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedClientId) {
      Alert.alert('Client requis', 'Veuillez sélectionner le client pour cette commande.');
      return;
    }

    if (!fabricDescription) {
      Alert.alert('Description requise', 'Veuillez décrire le vêtement / tissu (ex: Grand Boubou 3 pièces Bazin).');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      Alert.alert('Prix requis', 'Veuillez indiquer le montant total de la commande.');
      return;
    }

    setLoading(true);

    const payload = {
      client_id: selectedClientId,
      event_id: selectedEventId,
      fabric_description: fabricDescription,
      price: parseFloat(price),
      deposit_paid: depositPaid ? parseFloat(depositPaid) : 0,
      due_date: dueDate || null,
      notes: notes || null,
    };

    try {
      // In production, multi-part form data sends uploaded images
      const formData = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          formData.append(key, String(val));
        }
      });

      images.forEach((uri, idx) => {
        const filename = uri.split('/').pop() || `photo_${idx}.jpg`;
        // @ts-ignore
        formData.append('images[]', {
          uri,
          name: filename,
          type: 'image/jpeg',
        });
      });

      await api.post('/commandes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await NotificationService.playSuccessSoundAndHaptic();
      queryClient.invalidateQueries({ queryKey: ['commandes_list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      navigation.goBack();
    } catch (error: any) {
      // Offline fallback
      await SyncService.queueOfflineCommande(payload);
      await NotificationService.playSuccessSoundAndHaptic();
      Alert.alert('Enregistré Hors-Ligne', 'La commande a été enregistrée sur votre appareil et sera synchronisée.');
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
          <Text style={[styles.navTitle, { color: theme.text }]}>Nouvelle Commande</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Client Selection */}
          <Text style={[styles.label, { color: theme.textMuted }]}>Client *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clientsSelector}>
            {clients.map((c) => {
              const selected = selectedClientId === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedClientId(c.id)}
                  style={[
                    styles.clientChip,
                    {
                      backgroundColor: selected ? theme.primary : theme.bgElevated,
                      borderColor: selected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.clientChipText,
                      { color: selected ? (theme.mode === 'dark' ? '#121212' : '#FFFFFF') : theme.text },
                    ]}
                  >
                    {c.full_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Fabric & Model Description */}
          <Input
            label="Description du modèle & Tissu *"
            placeholder="Ex: Grand Boubou 3 pièces Bazin Riche Bleu Roi"
            value={fabricDescription}
            onChangeText={setFabricDescription}
            leftIcon={<Scissors size={18} color={theme.textSubtle} />}
          />

          {/* Pricing & Deposit */}
          <View style={styles.row}>
            <Input
              label="Prix total (FCFA) *"
              placeholder="35000"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              containerStyle={{ flex: 1, marginRight: 6 }}
              leftIcon={<DollarSign size={18} color={theme.textSubtle} />}
            />
            <Input
              label="Acompte versé (FCFA)"
              placeholder="15000"
              value={depositPaid}
              onChangeText={setDepositPaid}
              keyboardType="numeric"
              containerStyle={{ flex: 1, marginLeft: 6 }}
              leftIcon={<DollarSign size={18} color={theme.success} />}
            />
          </View>

          {/* Due Date */}
          <Input
            label="Date de livraison souhaitée (YYYY-MM-DD)"
            placeholder="2026-06-15"
            value={dueDate}
            onChangeText={setDueDate}
            leftIcon={<Calendar size={18} color={theme.textSubtle} />}
          />

          {/* Event Attachment (Tabaski, Korité, etc.) */}
          {events.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.label, { color: theme.textMuted }]}>Événement / Fête (Optionnel)</Text>
              <View style={styles.eventsRow}>
                {events.map((ev) => {
                  const selected = selectedEventId === ev.id;
                  return (
                    <TouchableOpacity
                      key={ev.id}
                      onPress={() => setSelectedEventId(selected ? null : ev.id)}
                      style={[
                        styles.eventChip,
                        {
                          backgroundColor: selected ? theme.primaryLight : theme.bgElevated,
                          borderColor: selected ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.eventChipText,
                          { color: selected ? theme.primaryDark : theme.textMuted },
                        ]}
                      >
                        {ev.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Photos Capture Section */}
          <Text style={[styles.label, { color: theme.textMuted, marginTop: 16 }]}>
            Photos de modèles & Tissus
          </Text>
          <View style={styles.photoActions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleTakePhoto}
              style={[styles.photoBtn, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
            >
              <Camera size={20} color={theme.primary} />
              <Text style={[styles.photoBtnText, { color: theme.text }]}>Prendre une photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePickImage}
              style={[styles.photoBtn, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
            >
              <ImageIcon size={20} color={theme.primary} />
              <Text style={[styles.photoBtnText, { color: theme.text }]}>Galerie</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Photos Preview */}
          {images.length > 0 && (
            <ScrollView horizontal style={styles.photoPreviews}>
              {images.map((uri, idx) => (
                <View key={idx} style={styles.photoThumbWrapper}>
                  <Image source={{ uri }} style={styles.photoThumb} />
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(idx)}
                    style={styles.removePhotoBtn}
                  >
                    <X size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Notes */}
          <Input
            label="Notes de confection particulières"
            placeholder="Ex: Broderie fil or, boutons de rechange..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            containerStyle={{ marginTop: 8 }}
          />

          <Button
            title="Enregistrer la commande"
            onPress={handleSubmit}
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  clientsSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  clientChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  clientChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  eventsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  eventChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  eventChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  photoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  photoPreviews: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoThumbWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
