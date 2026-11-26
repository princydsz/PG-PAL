import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    Text,
    View,
} from 'react-native';

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

export default function MyRequests() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');

        if (!storedUser) {
          Alert.alert('Error', 'Please login again');
          return;
        }

        const user = JSON.parse(storedUser);

        const res = await axios.get(
          `${BASE_URL}/requests/student/${encodeURIComponent(user.email)}`,
          {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          }
        );

        const requestList = res.data || [];

        const enrichedRequests = await Promise.all(
          requestList.map(async (r: any) => {
            let landlordDetails = null;
            let roomDetails = null;

            try {
              const roomRes = await axios.get(
                `${BASE_URL}/rooms/${r.roomId}`,
                {
                  headers: { 'ngrok-skip-browser-warning': 'true' },
                }
              );
              roomDetails = roomRes.data;
            } catch (err) {
              console.log('ROOM FETCH ERROR:', err);
            }

            if (r.status === 'accepted') {
              try {
                const landlordRes = await axios.get(
                  `${BASE_URL}/users/${encodeURIComponent(r.landlordEmail)}`,
                  {
                    headers: { 'ngrok-skip-browser-warning': 'true' },
                  }
                );
                landlordDetails = landlordRes.data;
              } catch (err) {
                console.log('LANDLORD FETCH ERROR:', err);
              }
            }

            return {
              ...r,
              roomDetails,
              landlordDetails,
            };
          })
        );

        setRequests(enrichedRequests);
      } catch (err: any) {
        console.log('MY REQUEST ERROR:', err?.response?.data || err.message);
        Alert.alert('Error', 'Failed to load requests');
      }
    };

    fetch();
  }, []);

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
          <Text style={{ color: '#DBEAFE', fontSize: 15 }}>
            Track your activity 📊
          </Text>

          <Text
            style={{
              fontSize: 30,
              fontWeight: '800',
              color: '#fff',
              marginTop: 4,
            }}
          >
            My Requests
          </Text>

          <Text
            style={{
              color: '#DBEAFE',
              marginTop: 8,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            See your request status and contact landlords after acceptance.
          </Text>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          {requests.length === 0 ? (
            <View style={emptyCard}>
              <Ionicons name="mail-outline" size={40} color="#9CA3AF" />
              <Text style={emptyTitle}>No Requests Yet</Text>
              <Text style={emptyDesc}>
                Start exploring rooms and send requests to landlords.
              </Text>
            </View>
          ) : (
            requests.map((r) => (
              <View key={r.id} style={card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={title}>Request #{r.id}</Text>
                  <StatusBadge status={r.status} />
                </View>

                {/* ROOM DETAILS */}
                <View style={roomBox}>
                  {r.roomDetails?.imageUrl ? (
                    <Image
                      source={{ uri: r.roomDetails.imageUrl }}
                      style={roomImage}
                      resizeMode="cover"
                    />
                  ) : null}

                  <Text style={roomTitle}>
                    {r.roomDetails?.title || `Room #${r.roomId}`}
                  </Text>

                  <Text style={roomText}>
                    📍 {r.roomDetails?.location || 'Location not available'}
                  </Text>

                  <Text style={roomText}>
                    🏠 {r.roomDetails?.type || 'Type not available'}
                  </Text>

                  <Text style={roomPrice}>
                    ₹{r.roomDetails?.rent ?? 'N/A'}
                  </Text>
                </View>

                {/* STATUS CONTENT */}
                {r.status === 'accepted' && (
                  <View style={successBox}>
                    <Text style={successTitle}>🎉 Contact Unlocked</Text>
                    <Text style={successText}>📧 {r.landlordEmail}</Text>
                    <Text style={successText}>
                      📞 {r.landlordDetails?.phone || 'Not added'}
                    </Text>
                  </View>
                )}

                {r.status === 'pending' && (
                  <View style={pendingBox}>
                    <Text style={pendingText}>
                      ⏳ Waiting for landlord response
                    </Text>
                  </View>
                )}

                {r.status === 'rejected' && (
                  <View style={rejectBox}>
                    <Text style={rejectText}>
                      ❌ Request rejected
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function StatusBadge({ status }: any) {
  const bg =
    status === 'accepted'
      ? '#DCFCE7'
      : status === 'pending'
      ? '#FEF3C7'
      : '#FEE2E2';

  const color =
    status === 'accepted'
      ? '#166534'
      : status === 'pending'
      ? '#92400E'
      : '#991B1B';

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
      }}
    >
      <Text style={{ color, fontWeight: '700', fontSize: 12 }}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const card = {
  backgroundColor: '#fff',
  padding: 18,
  borderRadius: 20,
  marginBottom: 14,
  elevation: 4,
};

const title = {
  fontSize: 18,
  fontWeight: '800' as const,
  color: '#111827',
};

const roomBox = {
  backgroundColor: '#F9FAFB',
  padding: 12,
  borderRadius: 14,
  marginBottom: 12,
};

const roomImage = {
  width: '100%' as const,
  height: 170,
  borderRadius: 12,
  marginBottom: 10,
};

const roomTitle = {
  fontSize: 17,
  fontWeight: '800' as const,
  color: '#111827',
  marginBottom: 6,
};

const roomText = {
  color: '#4B5563',
  marginBottom: 4,
};

const roomPrice = {
  color: '#2563EB',
  fontWeight: '800' as const,
  fontSize: 18,
  marginTop: 4,
};

const successBox = {
  backgroundColor: '#DCFCE7',
  padding: 12,
  borderRadius: 12,
  marginTop: 4,
};

const successTitle = {
  fontWeight: '800' as const,
  color: '#166534',
};

const successText = {
  color: '#166534',
};

const pendingBox = {
  backgroundColor: '#FEF3C7',
  padding: 12,
  borderRadius: 12,
  marginTop: 4,
};

const pendingText = {
  color: '#92400E',
  fontWeight: '700' as const,
};

const rejectBox = {
  backgroundColor: '#FEE2E2',
  padding: 12,
  borderRadius: 12,
  marginTop: 4,
};

const rejectText = {
  color: '#991B1B',
  fontWeight: '700' as const,
};

const emptyCard = {
  backgroundColor: '#fff',
  padding: 30,
  borderRadius: 20,
  alignItems: 'center' as const,
};

const emptyTitle = {
  fontSize: 20,
  fontWeight: '800' as const,
  marginTop: 10,
};

const emptyDesc = {
  color: '#6B7280',
  textAlign: 'center' as const,
  marginTop: 6,
};