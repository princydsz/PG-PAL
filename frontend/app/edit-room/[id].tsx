import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

export default function EditRoom() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');

        if (!storedUser) {
          Alert.alert('Error', 'Please login again');
          router.replace('/login' as any);
          return;
        }

        const user = JSON.parse(storedUser);
        setOwnerEmail(user.email);

        const res = await axios.get(`${BASE_URL}/rooms/${id}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });

        const room = res.data;
        setTitle(room.title || '');
        setLocation(room.location || '');
        setRent(room.rent ? String(room.rent) : '');
        setType(room.type || '');
        setDescription(room.description || '');
      } catch (err: any) {
        console.log('FETCH ERROR:', err?.response?.data || err.message);
        Alert.alert('Error', 'Failed to load room details');
      }
    };

    fetchRoom();
  }, [id, router]);

  const handleUpdate = async () => {
    if (
      !title.trim() ||
      !location.trim() ||
      !rent.trim() ||
      !type.trim() ||
      !description.trim()
    ) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    if (isNaN(Number(rent)) || Number(rent) <= 0) {
      Alert.alert('Invalid Rent', 'Please enter a valid rent amount.');
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${BASE_URL}/rooms/${id}`,
        {
          title: title.trim(),
          location: location.trim(),
          rent: Number(rent),
          type: type.trim().toLowerCase(),
          description: description.trim(),
          ownerEmail,
        },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      Alert.alert('Success', 'Room updated successfully');
      router.back();
    } catch (err: any) {
      console.log('UPDATE ERROR:', err?.response?.data || err.message);
      Alert.alert(
        'Update Failed',
        typeof err?.response?.data === 'string'
          ? err.response.data
          : err?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F6FB' }}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#0F2C59', '#2563EB', '#60A5FA']}
          style={{
            paddingHorizontal: 20,
            paddingTop: 54,
            paddingBottom: 28,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={topCircleBtn}
              activeOpacity={0.9}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.16)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="create-outline" size={28} color="#fff" />
            </View>
          </View>

          <Text style={{ color: '#DBEAFE', fontSize: 15 }}>
            Update your property 🛠️
          </Text>

          <Text
            style={{
              fontSize: 30,
              fontWeight: '800',
              color: '#fff',
              marginTop: 4,
            }}
          >
            Edit Room
          </Text>

          <Text
            style={{
              color: '#DBEAFE',
              marginTop: 8,
              fontSize: 14,
              lineHeight: 21,
            }}
          >
            Update your room details, rent, type, and description.
          </Text>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          <View style={card}>
            <Text style={sectionTitle}>Room Details</Text>
            <Text style={sectionSub}>Edit the fields below</Text>

            <InputRow
              icon={<Ionicons name="create-outline" size={20} color="#2563EB" />}
              placeholder="Room Title"
              value={title}
              onChangeText={setTitle}
            />

            <InputRow
              icon={<Ionicons name="location-outline" size={20} color="#2563EB" />}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />

            <InputRow
              icon={<MaterialIcons name="currency-rupee" size={20} color="#2563EB" />}
              placeholder="Rent"
              value={rent}
              onChangeText={setRent}
              keyboardType="numeric"
            />

            <InputRow
              icon={<Ionicons name="home-outline" size={20} color="#2563EB" />}
              placeholder="Type"
              value={type}
              onChangeText={setType}
            />

            <View style={textAreaWrap}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#2563EB"
                style={{ marginTop: 14 }}
              />
              <TextInput
                placeholder="Description"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                style={{
                  flex: 1,
                  minHeight: 100,
                  paddingVertical: 14,
                  paddingHorizontal: 10,
                  color: '#111827',
                  fontSize: 15,
                  textAlignVertical: 'top',
                }}
              />
            </View>

            <TouchableOpacity
              style={[primaryButton, { opacity: loading ? 0.75 : 1 }]}
              onPress={handleUpdate}
              disabled={loading}
              activeOpacity={0.9}
            >
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={primaryButtonText}>
                {loading ? 'Updating Room...' : 'Update Room'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InputRow({
  icon,
  ...props
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
}) {
  return (
    <View style={inputWrap}>
      {icon}
      <TextInput
        {...props}
        placeholderTextColor="#9CA3AF"
        style={{
          flex: 1,
          paddingVertical: 14,
          paddingHorizontal: 10,
          color: '#111827',
          fontSize: 15,
        }}
      />
    </View>
  );
}

const topCircleBtn = {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: 'rgba(255,255,255,0.18)',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const card = {
  backgroundColor: '#fff',
  borderRadius: 24,
  padding: 20,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

const sectionTitle = {
  fontSize: 24,
  fontWeight: '800' as const,
  color: '#111827',
};

const sectionSub = {
  fontSize: 14,
  color: '#6B7280',
  marginTop: 4,
  marginBottom: 16,
};

const inputWrap = {
  backgroundColor: '#F9FAFB',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 14,
  paddingHorizontal: 14,
  minHeight: 56,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  marginBottom: 12,
};

const textAreaWrap = {
  backgroundColor: '#F9FAFB',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 14,
  paddingHorizontal: 14,
  minHeight: 120,
  flexDirection: 'row' as const,
  alignItems: 'flex-start' as const,
  marginBottom: 8,
};

const primaryButton = {
  backgroundColor: '#22C55E',
  paddingVertical: 17,
  borderRadius: 18,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexDirection: 'row' as const,
  gap: 8,
  marginTop: 8,
};

const primaryButtonText = {
  color: '#fff',
  fontSize: 18,
  fontWeight: '800' as const,
};