import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'landlord'>('student');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedRole = await AsyncStorage.getItem('role');

        if (storedUser && storedRole) {
          const parsedUser = JSON.parse(storedUser);

          if (storedRole === 'landlord' || parsedUser.role === 'landlord') {
            router.replace('/landlord-dashboard' as any);
          } else {
            router.replace('/student-dashboard' as any);
          }
        }
      } catch (err) {
        console.log('AUTO LOGIN ERROR:', err);
      }
    };

    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Enter email and password');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/users/login`,
        {
          email: email.trim(),
          password: password.trim(),
        },
        {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        }
      );

      const user = res.data;

      if (selectedRole !== user.role) {
        Alert.alert(
          'Role mismatch',
          `You selected ${selectedRole}, but this account is registered as ${user.role}.`
        );
        return;
      }

      if (rememberMe) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('role', user.role);
      } else {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('role');
      }

      if (user.role === 'landlord') {
        router.replace('/landlord-dashboard' as any);
      } else {
        router.replace('/student-dashboard' as any);
      }
    } catch (err: any) {
      console.log('LOGIN ERROR:', err?.response?.data || err.message);
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email first.');
      return;
    }

    try {
      setForgotLoading(true);

      const res = await axios.post(
        `${BASE_URL}/users/forgot-password`,
        null,
        {
          params: { email: email.trim() },
          headers: { 'ngrok-skip-browser-warning': 'true' },
        }
      );

      Alert.alert('Success', res.data || 'Password reset info sent.');
    } catch (err: any) {
      console.log('FORGOT PASSWORD ERROR:', err?.response?.data || err.message);
      Alert.alert(
        'Error',
        err?.response?.data || 'Failed to process forgot password request'
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0F2C59', '#2563EB', '#60A5FA']}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 22,
          paddingVertical: 30,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
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
              fontSize: 30,
              fontWeight: '800',
              marginTop: 12,
              letterSpacing: 0.3,
            }}
          >
            PG-pal
          </Text>

          <Text
            style={{
              color: '#DBEAFE',
              marginTop: 6,
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
            padding: 22,
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
            Welcome Back 👋
          </Text>

          <Text
            style={{
              color: '#6B7280',
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 20,
              fontSize: 15,
            }}
          >
            Login to find your perfect place to stay
          </Text>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#EFF6FF',
              borderRadius: 16,
              padding: 4,
              marginBottom: 18,
            }}
          >
            <TouchableOpacity
              onPress={() => setSelectedRole('student')}
              style={{
                flex: 1,
                backgroundColor: selectedRole === 'student' ? '#2563EB' : 'transparent',
                paddingVertical: 12,
                borderRadius: 12,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Ionicons
                name="school-outline"
                size={18}
                color={selectedRole === 'student' ? '#fff' : '#2563EB'}
              />
              <Text
                style={{
                  color: selectedRole === 'student' ? '#fff' : '#2563EB',
                  fontWeight: '700',
                }}
              >
                Student
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedRole('landlord')}
              style={{
                flex: 1,
                backgroundColor: selectedRole === 'landlord' ? '#2563EB' : 'transparent',
                paddingVertical: 12,
                borderRadius: 12,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <FontAwesome5
                name="building"
                size={16}
                color={selectedRole === 'landlord' ? '#fff' : '#2563EB'}
              />
              <Text
                style={{
                  color: selectedRole === 'landlord' ? '#fff' : '#2563EB',
                  fontWeight: '700',
                }}
              >
                Landlord
              </Text>
            </TouchableOpacity>
          </View>

          <View style={inputWrapper}>
            <MaterialIcons name="email" size={20} color="#6B7280" />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={inputStyle}
            />
          </View>

          <View style={inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              placeholder="Enter your password"
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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 6,
              marginBottom: 18,
            }}
          >
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Ionicons
                name={rememberMe ? 'checkbox' : 'square-outline'}
                size={20}
                color="#2563EB"
              />
              <Text style={{ marginLeft: 8, color: '#374151' }}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={{ color: '#2563EB', fontWeight: '600' }}>
                {forgotLoading ? 'Please wait...' : 'Forgot Password?'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              style={{
                paddingVertical: 15,
                borderRadius: 14,
                alignItems: 'center',
                shadowColor: '#2563EB',
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
                {loading ? 'Logging in...' : 'Login'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          

          <TouchableOpacity onPress={() => router.push('/register' as any)}>
            <Text style={{ textAlign: 'center', marginTop: 8, color: '#4B5563' }}>
              Don’t have an account?{' '}
              <Text style={{ fontWeight: '800', color: '#2563EB' }}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
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