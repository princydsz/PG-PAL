import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

export default function ContactFlow() {
  const router = useRouter();
  const { requestId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [landlord, setLandlord] = useState<any>(null);
  const [requestData, setRequestData] = useState<any>(null);

  useEffect(() => {
    const fetchContactFlow = async () => {
      try {
        setLoading(true);

        const storedUser = await AsyncStorage.getItem('user');
        if (!storedUser) {
          Alert.alert('Error', 'Please login again');
          router.replace('/login' as any);
          return;
        }

        const currentUser = JSON.parse(storedUser);

        const requestsRes = await axios.get(
          `${BASE_URL}/requests/student/${encodeURIComponent(currentUser.email)}`,
          {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          }
        );

        const requests = requestsRes.data || [];
        const matchedRequest = requests.find(
          (r: any) => String(r.id) === String(requestId)
        );

        if (!matchedRequest) {
          Alert.alert('Error', 'Request not found');
          router.back();
          return;
        }

        if (matchedRequest.status !== 'accepted') {
          Alert.alert('Info', 'Contact is available only after acceptance');
          router.back();
          return;
        }

        setRequestData(matchedRequest);

        const [studentRes, landlordRes] = await Promise.all([
          axios.get(
            `${BASE_URL}/users/${encodeURIComponent(matchedRequest.studentEmail)}`,
            {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            }
          ),
          axios.get(
            `${BASE_URL}/users/${encodeURIComponent(matchedRequest.landlordEmail)}`,
            {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            }
          ),
        ]);

        setStudent(studentRes.data);
        setLandlord(landlordRes.data);
      } catch (err: any) {
        console.log('CONTACT FLOW ERROR:', err?.response?.data || err.message);
        Alert.alert('Error', 'Failed to load contact details');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchContactFlow();
    }
  }, [requestId, router]);

  const handleCall = async (phone: string) => {
    if (!phone) {
      Alert.alert('Unavailable', 'Phone number not available');
      return;
    }

    const url = `tel:${phone}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Calling not supported on this device');
    }
  };

  const handleEmail = async (email: string) => {
    if (!email) {
      Alert.alert('Unavailable', 'Email not available');
      return;
    }

    const url = `mailto:${email}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Email app not available');
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F3F6FB',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
          Loading contact details...
        </Text>
      </View>
    );
  }

  if (!student || !landlord || !requestData) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F3F6FB',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
          Contact details not available
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F6FB' }}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#0F2C59', '#2563EB', '#60A5FA']}
          style={{
            paddingHorizontal: 20,
            paddingTop: 54,
            paddingBottom: 30,
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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <View style={{ flex: 1, paddingRight: 14 }}>
              <Text style={{ color: '#DBEAFE', fontSize: 15 }}>
                Mutual acceptance successful 🤝
              </Text>

              <Text
                style={{
                  fontSize: 32,
                  fontWeight: '800',
                  color: '#fff',
                  marginTop: 6,
                }}
              >
                Contact Shared
              </Text>

              <Text
                style={{
                  color: '#DBEAFE',
                  marginTop: 10,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                Your room request was accepted. You can now connect directly.
              </Text>
            </View>

            <View
              style={{
                width: 76,
                height: 76,
                borderRadius: 22,
                backgroundColor: 'rgba(255,255,255,0.16)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FontAwesome5 name="handshake" size={34} color="#fff" />
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: '#DCFCE7',
              borderRadius: 20,
              padding: 16,
              marginBottom: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#22C55E',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="checkmark" size={26} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#166534',
                  fontSize: 22,
                  fontWeight: '800',
                }}
              >
                Connection Unlocked!
              </Text>
              <Text
                style={{
                  color: '#166534',
                  marginTop: 4,
                  lineHeight: 20,
                }}
              >
                You can now call or email the landlord directly.
              </Text>
            </View>
          </View>

          <View style={card}>
            <View style={sectionHeader}>
              <View style={[sectionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="school-outline" size={26} color="#2563EB" />
              </View>

              <Text style={sectionTitle}>Student Details</Text>

              <View style={badgeBlue}>
                <Text style={badgeBlueText}>Student</Text>
              </View>
            </View>

            <View style={[innerCard, { backgroundColor: '#EEF4FF' }]}>
              <DetailRow
                icon={<Ionicons name="person" size={22} color="#2563EB" />}
                label="Name"
                value={student.name || 'Not added'}
              />
              <Divider />
              <DetailRow
                icon={<Ionicons name="call" size={22} color="#2563EB" />}
                label="Phone"
                value={student.phone || 'Not added'}
              />
              <Divider />
              <DetailRow
                icon={<Ionicons name="mail" size={22} color="#2563EB" />}
                label="Email"
                value={student.email || 'Not added'}
              />
            </View>
          </View>

          <View style={card}>
            <View style={sectionHeader}>
              <View style={[sectionIcon, { backgroundColor: '#FDE7CF' }]}>
                <Ionicons name="home-outline" size={26} color="#F59E0B" />
              </View>

              <Text style={sectionTitle}>Landlord Details</Text>

              <View style={badgeOrange}>
                <Text style={badgeOrangeText}>Landlord</Text>
              </View>
            </View>

            <View style={[innerCard, { backgroundColor: '#FBF3E8' }]}>
              <DetailRow
                icon={<Ionicons name="person" size={22} color="#F59E0B" />}
                label="Name"
                value={landlord.name || 'Not added'}
              />
              <Divider />
              <DetailRow
                icon={<Ionicons name="call" size={22} color="#F59E0B" />}
                label="Phone"
                value={landlord.phone || 'Not added'}
              />
              <Divider />
              <DetailRow
                icon={<Ionicons name="mail" size={22} color="#F59E0B" />}
                label="Email"
                value={landlord.email || 'Not added'}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleCall(landlord.phone)}
            activeOpacity={0.9}
            style={{
              backgroundColor: '#22C55E',
              paddingVertical: 18,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginBottom: 14,
              shadowColor: '#22C55E',
              shadowOpacity: 0.22,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Ionicons name="call" size={22} color="#fff" />
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '800',
                marginLeft: 10,
              }}
            >
              Call Landlord
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#fff"
              style={{ position: 'absolute', right: 16 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleEmail(landlord.email)}
            activeOpacity={0.9}
            style={{
              backgroundColor: '#2563EB',
              paddingVertical: 18,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <Ionicons name="mail-outline" size={22} color="#fff" />
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '800',
                marginLeft: 10,
              }}
            >
              Send Email
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#fff"
              style={{ position: 'absolute', right: 16 }}
            />
          </TouchableOpacity>

          <View
            style={{
              marginTop: 18,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="lock-closed" size={16} color="#6B7280" />
            <Text
              style={{
                color: '#6B7280',
                marginLeft: 8,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              Your contact details are shared securely after acceptance.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      }}
    >
      <View style={{ width: 34, alignItems: 'center' }}>{icon}</View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text
          style={{
            color: '#6B7280',
            fontSize: 14,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: '#111827',
            fontSize: 18,
            fontWeight: '700',
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: '#D7DFEA',
      }}
    />
  );
}

const card = {
  backgroundColor: '#fff',
  padding: 18,
  borderRadius: 22,
  marginBottom: 18,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

const sectionHeader = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  marginBottom: 14,
};

const sectionIcon = {
  width: 56,
  height: 56,
  borderRadius: 18,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  marginRight: 12,
};

const sectionTitle = {
  flex: 1,
  fontSize: 22,
  fontWeight: '800' as const,
  color: '#111827',
};

const innerCard = {
  borderRadius: 18,
  paddingHorizontal: 14,
  paddingVertical: 4,
};

const badgeBlue = {
  backgroundColor: '#EAF2FF',
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 999,
};

const badgeBlueText = {
  color: '#2563EB',
  fontWeight: '700' as const,
  fontSize: 12,
};

const badgeOrange = {
  backgroundColor: '#FDE7CF',
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 999,
};

const badgeOrangeText = {
  color: '#EA7B15',
  fontWeight: '700' as const,
  fontSize: 12,
};