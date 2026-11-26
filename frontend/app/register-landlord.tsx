import { FontAwesome5, Ionicons } from '@expo/vector-icons';
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

export default function RegisterLandlord() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [propertyPhoto, setPropertyPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow gallery access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setPropertyPhoto(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedLocation = propertyLocation.trim();

    // Required fields
    if (!trimmedName || !trimmedPhone || !trimmedEmail || !trimmedPassword) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    // Name validation
    if (!/^[A-Za-z ]{2,50}$/.test(trimmedName)) {
      Alert.alert('Invalid Name', 'Only letters allowed (2–50 characters).');
      return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(trimmedPhone)) {
      Alert.alert('Invalid Phone', 'Phone must be exactly 10 digits.');
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Enter a valid email.');
      return;
    }

    // Password validation
    if (trimmedPassword.length < 6) {
      Alert.alert('Weak Password', 'Minimum 6 characters required.');
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}/users/register`,
        {
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
          password: trimmedPassword,
          role: 'landlord',
          propertyLocation: trimmedLocation,
          propertyPhoto: propertyPhoto?.uri || '',
        },
        {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        }
      );

      Alert.alert('Success', 'Landlord registered successfully');
      router.replace('/login' as any);
    } catch (error: any) {
      console.log('REGISTER ERROR:', error?.response?.data || error.message);

      Alert.alert(
        'Error',
        typeof error?.response?.data === 'string'
          ? error.response.data
          : 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0F2C59', '#2563EB', '#60A5FA']} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingTop: 54, paddingBottom: 30 }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: 'rgba(255,255,255,0.18)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 90, height: 90, borderRadius: 45 }}
          />
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 10 }}>
            PG-pal
          </Text>
        </View>

        {/* Card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 20,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '800', textAlign: 'center' }}>
            Landlord Registration 🏢
          </Text>

          <InputField icon="person-outline" value={name} onChange={setName} placeholder="Full Name" />
          <InputField icon="call-outline" value={phone} onChange={setPhone} placeholder="Phone" keyboard="phone-pad" />
          <InputField icon="mail-outline" value={email} onChange={setEmail} placeholder="Email" keyboard="email-address" />

          {/* Password */}
          <View style={inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={inputStyle}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} />
            </TouchableOpacity>
          </View>

          <InputField
            icon="location-outline"
            value={propertyLocation}
            onChange={setPropertyLocation}
            placeholder="Property Location"
          />

          {/* Image Upload */}
          <TouchableOpacity onPress={pickImage} style={uploadBox}>
            {propertyPhoto ? (
              <Image source={{ uri: propertyPhoto.uri }} style={{ width: 80, height: 80 }} />
            ) : (
              <FontAwesome5 name="building" size={28} color="#2563EB" />
            )}
            <Text style={{ marginTop: 8 }}>
              {propertyPhoto ? 'Change Photo' : 'Upload Property Photo'}
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity onPress={handleRegister} style={btn}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {loading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

/* Reusable Input */
function InputField({ icon, value, onChange, placeholder, keyboard }: any) {
  return (
    <View style={inputWrapper}>
      <Ionicons name={icon} size={20} color="#666" />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboard}
        style={inputStyle}
      />
    </View>
  );
}

/* Styles */
const inputWrapper = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 12,
  padding: 12,
  marginTop: 12,
};

const inputStyle = {
  flex: 1,
  marginLeft: 10,
};

const uploadBox = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 12,
  padding: 20,
  alignItems: 'center' as const,
  marginTop: 15,
};

const btn = {
  backgroundColor: '#2563EB',
  padding: 15,
  borderRadius: 12,
  alignItems: 'center' as const,
  marginTop: 20,
};