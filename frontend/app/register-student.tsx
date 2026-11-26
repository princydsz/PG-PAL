import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
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

export default function RegisterStudent() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<any>(null);
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
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedCollegeName = collegeName.trim();
    const trimmedPreferredLocation = preferredLocation.trim();
    const trimmedBudget = budget.trim();
    const trimmedPreferences = preferences.trim();

    if (!trimmedName || !trimmedPhone || !trimmedEmail || !trimmedPassword) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    const nameRegex = /^[A-Za-z ]{2,50}$/;
    if (!nameRegex.test(trimmedName)) {
      Alert.alert(
        'Invalid Name',
        'Name should contain only letters and spaces, and be between 2 and 50 characters.'
      );
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      Alert.alert(
        'Invalid Phone Number',
        'Phone number must be exactly 10 digits.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters long.'
      );
      return;
    }

    if (trimmedBudget && isNaN(Number(trimmedBudget))) {
      Alert.alert('Invalid Budget', 'Budget must be a number.');
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
          role: 'student',
          profilePhoto: profilePhoto?.uri || '',
          collegeName: trimmedCollegeName,
          preferredLocation: trimmedPreferredLocation,
          budget: trimmedBudget,
          preferences: trimmedPreferences,
        },
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );

      Alert.alert('Success', 'Student registered successfully');
      router.replace('/login' as any);
    } catch (error: any) {
      console.log('REGISTER ERROR:', error?.response?.data || error.message);
      Alert.alert(
        'Error',
        error?.response?.data || 'Registration failed'
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

        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: 54,
              backgroundColor: 'rgba(255,255,255,0.18)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.35)',
            }}
          >
            <Image
              source={require('../assets/logo.png')}
              style={{ width: 90, height: 90, borderRadius: 45 }}
              resizeMode="cover"
            />
          </View>

          <Text
            style={{
              color: '#fff',
              fontSize: 28,
              fontWeight: '800',
              marginTop: 12,
            }}
          >
            PG-pal
          </Text>

          <Text
            style={{
              color: '#DBEAFE',
              marginTop: 4,
              fontSize: 14,
            }}
          >
            Housing Companion
          </Text>
        </View>

        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderRadius: 28,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 18,
            elevation: 10,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: '#111827',
              textAlign: 'center',
            }}
          >
            Create Your Student Account 🎓
          </Text>

          <Text
            style={{
              color: '#6B7280',
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 18,
              fontSize: 15,
            }}
          >
            Join PG-pal and find your perfect room and roommate
          </Text>

          <View
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: 16,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 18,
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: '#DBEAFE',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <Ionicons name="bulb-outline" size={18} color="#2563EB" />
            </View>

            <Text
              style={{
                flex: 1,
                color: '#374151',
                lineHeight: 20,
                fontSize: 14,
              }}
            >
              Add accurate details to get better room and roommate matches.
            </Text>
          </View>

          <InputField
            icon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
            placeholder="Full Name *"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />

          <InputField
            icon={<Ionicons name="call-outline" size={20} color="#6B7280" />}
            placeholder="Phone Number *"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <InputField
            icon={<MaterialIcons name="email" size={20} color="#6B7280" />}
            placeholder="Email Address *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              placeholder="Password *"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={inputStyle}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <InputField
            icon={<FontAwesome5 name="university" size={18} color="#6B7280" />}
            placeholder="College / University Name"
            value={collegeName}
            onChangeText={setCollegeName}
          />

          <InputField
            icon={<Ionicons name="location-outline" size={20} color="#6B7280" />}
            placeholder="Preferred Location"
            value={preferredLocation}
            onChangeText={setPreferredLocation}
          />

          <InputField
            icon={<MaterialIcons name="account-balance-wallet" size={20} color="#6B7280" />}
            placeholder="Budget (per month)"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />

          <View style={[inputWrapper, { alignItems: 'flex-start', minHeight: 100 }]}>
            <Ionicons
              name="heart-outline"
              size={20}
              color="#6B7280"
              style={{ marginTop: 14 }}
            />
            <TextInput
              placeholder="Preferences (e.g. non-smoker, veg, early sleeper)"
              placeholderTextColor="#9CA3AF"
              value={preferences}
              onChangeText={setPreferences}
              style={[inputStyle, { textAlignVertical: 'top', minHeight: 90 }]}
              multiline
            />
          </View>

          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.9}
            style={{
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: '#93C5FD',
              backgroundColor: '#F8FBFF',
              borderRadius: 18,
              padding: 16,
              marginTop: 4,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto.uri }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    marginRight: 14,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    backgroundColor: '#DBEAFE',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 14,
                  }}
                >
                  <Ionicons name="camera-outline" size={28} color="#2563EB" />
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#1D4ED8',
                    marginBottom: 4,
                  }}
                >
                  {profilePhoto ? 'Change Profile Photo' : 'Upload Profile Photo'}
                </Text>
                <Text
                  style={{
                    color: '#6B7280',
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  Choose a clear photo from your gallery
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegister} activeOpacity={0.85}>
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              style={{
                paddingVertical: 16,
                borderRadius: 14,
                alignItems: 'center',
                shadowColor: '#2563EB',
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
                {loading ? 'Registering...' : 'Register'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/login' as any)}>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 16,
                color: '#4B5563',
                fontSize: 15,
              }}
            >
              Already have an account?{' '}
              <Text style={{ color: '#2563EB', fontWeight: '800' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function InputField({
  icon,
  ...props
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
}) {
  return (
    <View style={inputWrapper}>
      {icon}
      <TextInput
        {...props}
        placeholderTextColor="#9CA3AF"
        style={inputStyle}
      />
    </View>
  );
}

const inputWrapper = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  backgroundColor: '#F9FAFB',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 14,
  paddingHorizontal: 14,
  marginBottom: 14,
  minHeight: 56,
};

const inputStyle = {
  flex: 1,
  paddingVertical: 14,
  paddingHorizontal: 10,
  color: '#111827',
  fontSize: 15,
};