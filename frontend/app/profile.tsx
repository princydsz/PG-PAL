import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

export default function Profile() {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const roleParam = Array.isArray(role) ? role[0] : role;

  const [userRole, setUserRole] = useState('student');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [collegeName, setCollegeName] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');

  const [propertyLocation, setPropertyLocation] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');

        if (!storedUser) {
          Alert.alert('Error', 'Please login again');
          router.replace('/login' as any);
          return;
        }

        const user = JSON.parse(storedUser);

        const finalRole =
          roleParam === 'landlord' || user.role === 'landlord'
            ? 'landlord'
            : 'student';

        setUserRole(finalRole);
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setCollegeName(user.collegeName || '');
        setPreferredLocation(user.preferredLocation || '');
        setBudget(user.budget || '');
        setPreferences(user.preferences || '');
        setPropertyLocation(user.propertyLocation || '');
        setProfilePhoto(user.profilePhoto || '');
      } catch (err) {
        console.log('PROFILE LOAD ERROR:', err);
        Alert.alert('Error', 'Failed to load profile');
      }
    };

    loadUser();
  }, [roleParam]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!/^[A-Za-z ]{2,50}$/.test(trimmedName)) {
      Alert.alert('Error', 'Enter a valid name');
      return;
    }

    if (!/^[0-9]{10}$/.test(trimmedPhone)) {
      Alert.alert('Error', 'Phone must be 10 digits');
      return;
    }

    try {
      setLoading(true);

      const updatedUser = {
        name: trimmedName,
        email,
        phone: trimmedPhone,
        role: userRole,
        collegeName: collegeName.trim(),
        preferredLocation: preferredLocation.trim(),
        budget: budget.trim(),
        preferences: preferences.trim(),
        propertyLocation: propertyLocation.trim(),
        profilePhoto,
      };

      const res = await fetch(`${BASE_URL}/users/update/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log('PROFILE UPDATE ERROR RESPONSE:', errorText);
        throw new Error(errorText || 'Failed to save profile');
      }

      const savedUser = await res.json();
      await AsyncStorage.setItem('user', JSON.stringify(savedUser));

      Alert.alert('Success', 'Profile updated successfully');
    } catch (err: any) {
      console.log('PROFILE SAVE ERROR:', err);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('role');
            router.replace('/login' as any);
          } catch (err) {
            console.log('LOGOUT ERROR:', err);
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F6FB' }}>
      <StatusBar barStyle="light-content" />

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

        <Text style={{ color: '#DBEAFE' }}>Manage your account 👤</Text>
        <Text style={{ fontSize: 30, fontWeight: '800', color: '#fff', marginTop: 4 }}>
          Profile
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }}>
        <View style={card}>
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <View style={avatarWrap}>
              <Image
                source={
                  profilePhoto
                    ? { uri: profilePhoto }
                    : require('../assets/logo.png')
                }
                style={avatar}
              />
            </View>

            <Text style={nameText}>{name || 'User'}</Text>
            <Text style={{ color: '#6B7280', marginTop: 4 }}>{email}</Text>

            <View style={roleBadge}>
              <Text style={roleText}>{userRole.toUpperCase()}</Text>
            </View>
          </View>

          <Input
            icon="person-outline"
            value={name}
            set={setName}
            placeholder="Name"
          />

          <Input
            icon="call-outline"
            value={phone}
            set={setPhone}
            placeholder="Phone"
            keyboardType="phone-pad"
          />

          {userRole === 'student' ? (
            <>
              <Section title="Student Details" />
              <Input
                icon="school-outline"
                value={collegeName}
                set={setCollegeName}
                placeholder="College"
              />
              <Input
                icon="location-outline"
                value={preferredLocation}
                set={setPreferredLocation}
                placeholder="Location"
              />
              <Input
                icon="cash-outline"
                value={budget}
                set={setBudget}
                placeholder="Budget"
                keyboardType="numeric"
              />
              <Input
                icon="options-outline"
                value={preferences}
                set={setPreferences}
                placeholder="Preferences"
              />
            </>
          ) : (
            <>
              <Section title="Property Details" />
              <Input
                icon="business-outline"
                value={propertyLocation}
                set={setPropertyLocation}
                placeholder="Property Location"
              />
            </>
          )}

          <TouchableOpacity
            style={[saveBtn, loading && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 6, fontWeight: '700' }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function Input({
  icon,
  value,
  set,
  placeholder,
  keyboardType,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  set: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'numeric' | 'email-address';
}) {
  return (
    <View style={inputWrap}>
      <Ionicons name={icon} size={20} color="#6B7280" />
      <TextInput
        value={value}
        onChangeText={set}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        style={{
          flex: 1,
          marginLeft: 10,
          color: '#111827',
        }}
      />
    </View>
  );
}

function Section({ title }: { title: string }) {
  return (
    <Text style={{ fontSize: 18, fontWeight: '700', marginVertical: 10, color: '#111827' }}>
      {title}
    </Text>
  );
}

const card = {
  backgroundColor: '#fff',
  borderRadius: 24,
  padding: 20,
  elevation: 5,
};

const avatarWrap = {
  width: 110,
  height: 110,
  borderRadius: 55,
  backgroundColor: '#DBEAFE',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const avatar = {
  width: 100,
  height: 100,
  borderRadius: 50,
};

const nameText = {
  fontSize: 22,
  fontWeight: '800' as const,
  marginTop: 10,
  color: '#111827',
};

const roleBadge = {
  marginTop: 10,
  backgroundColor: '#EAF2FF',
  paddingHorizontal: 12,
  paddingVertical: 5,
  borderRadius: 20,
};

const roleText = {
  color: '#2563EB',
  fontWeight: '700' as const,
};

const inputWrap = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  backgroundColor: '#F9FAFB',
  padding: 14,
  borderRadius: 12,
  marginBottom: 10,
};

const saveBtn = {
  backgroundColor: '#2563EB',
  padding: 16,
  borderRadius: 14,
  alignItems: 'center' as const,
  marginTop: 10,
};

const logoutBtn = {
  backgroundColor: '#EF4444',
  padding: 16,
  borderRadius: 14,
  alignItems: 'center' as const,
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  marginTop: 10,
};