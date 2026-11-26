import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

export default function AddRoom() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission Required', 'Allow gallery access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleAddRoom = async () => {
    if (!title.trim() || !location.trim() || !rent.trim() || !type.trim() || !description.trim()) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    if (!image) {
      Alert.alert('No Image', 'Please pick an image first.');
      return;
    }

    if (isNaN(Number(rent)) || Number(rent) <= 0) {
      Alert.alert('Invalid Rent', 'Please enter a valid rent amount.');
      return;
    }

    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      const user = JSON.parse(storedUser);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('location', location.trim());
      formData.append('rent', String(Number(rent)));
      formData.append('type', type.trim().toLowerCase());
      formData.append('description', description.trim());
      formData.append('ownerEmail', user.email);

      formData.append(
        'file',
        {
          uri: image.uri,
          name: image.fileName || 'room.jpg',
          type: image.mimeType || image.type || 'image/jpeg',
        } as any
      );

      await axios.post(`${BASE_URL}/rooms/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      Alert.alert('Success', 'Room added successfully!');

      setTitle('');
      setLocation('');
      setRent('');
      setType('');
      setDescription('');
      setImage(null);

      router.back();
    } catch (err: any) {
      console.log('ADD ROOM ERROR:', err?.response?.data || err?.message);

      Alert.alert(
        'Add Room Failed',
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
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
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
              <Ionicons name="home-outline" size={28} color="#fff" />
            </View>
          </View>

          <Text style={{ color: '#DBEAFE', fontSize: 15 }}>
            Create a new listing 🏠
          </Text>

          <Text
            style={{
              fontSize: 30,
              fontWeight: '800',
              color: '#fff',
              marginTop: 4,
            }}
          >
            Add Room
          </Text>

          <Text
            style={{
              color: '#DBEAFE',
              marginTop: 8,
              fontSize: 14,
              lineHeight: 21,
            }}
          >
            Fill in the details below to list your room and attract students quickly.
          </Text>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          <View style={card}>
            <Text style={sectionTitle}>Room Photo</Text>
            <Text style={sectionSub}>
              Add a clear photo of your room
            </Text>

            <TouchableOpacity
              style={uploadArea}
              onPress={pickImage}
              activeOpacity={0.9}
            >
              {image ? (
                <Image
                  source={{ uri: image.uri }}
                  style={{
                    width: '100%',
                    height: 210,
                    borderRadius: 16,
                  }}
                />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 20,
                      backgroundColor: '#DBEAFE',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons name="image-outline" size={34} color="#2563EB" />
                  </View>

                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '800',
                      color: '#2563EB',
                    }}
                  >
                    Upload Room Photo
                  </Text>

                  <Text
                    style={{
                      color: '#6B7280',
                      marginTop: 6,
                      textAlign: 'center',
                    }}
                  >
                    Tap to choose a photo from your gallery
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={card}>
            <Text style={sectionTitle}>Room Details</Text>
            <Text style={sectionSub}>
              Enter the basic information
            </Text>

            <InputRow
              icon={<Ionicons name="create-outline" size={20} color="#2563EB" />}
              placeholder="Room Title"
              value={title}
              onChangeText={setTitle}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <InputRow
                  icon={<Ionicons name="location-outline" size={20} color="#2563EB" />}
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <View style={{ flex: 1 }}>
                <InputRow
                  icon={<MaterialIcons name="currency-rupee" size={20} color="#2563EB" />}
                  placeholder="Rent"
                  value={rent}
                  onChangeText={setRent}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <InputRow
              icon={<Ionicons name="home-outline" size={20} color="#2563EB" />}
              placeholder="Type (single/shared/girls/boys)"
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
          </View>

          <View
            style={{
              backgroundColor: '#EEF4FF',
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: '#C7D7FE',
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <Ionicons
              name="bulb-outline"
              size={22}
              color="#2563EB"
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#1E3A8A',
                  fontWeight: '800',
                  marginBottom: 4,
                }}
              >
                Tip
              </Text>
              <Text style={{ color: '#4B5563', lineHeight: 20 }}>
                Add accurate details and a good photo to get more requests quickly.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[primaryButton, { opacity: loading ? 0.75 : 1 }]}
            onPress={handleAddRoom}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Ionicons name="add" size={22} color="#fff" />
            <Text style={primaryButtonText}>
              {loading ? 'Adding Room...' : 'Add Room'}
            </Text>
          </TouchableOpacity>
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

const card = {
  backgroundColor: '#fff',
  borderRadius: 24,
  padding: 18,
  marginBottom: 16,
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

const uploadArea = {
  borderWidth: 1.5,
  borderStyle: 'dashed' as const,
  borderColor: '#93C5FD',
  backgroundColor: '#F8FBFF',
  borderRadius: 18,
  padding: 18,
  minHeight: 180,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
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
  marginBottom: 6,
};

const primaryButton = {
  backgroundColor: '#22C55E',
  paddingVertical: 17,
  borderRadius: 18,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexDirection: 'row' as const,
  gap: 8,
  marginBottom: 22,
};

const primaryButtonText = {
  color: '#fff',
  fontSize: 18,
  fontWeight: '800' as const,
};