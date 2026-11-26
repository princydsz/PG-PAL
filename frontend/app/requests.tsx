import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

export default function LandlordRequests() {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      const res = await axios.get(
        `${BASE_URL}/requests/landlord/${user.email}`,
        {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        }
      );

      const requestList = res.data || [];

      const enriched = await Promise.all(
        requestList.map(async (r: any) => {
          try {
            const studentRes = await axios.get(
              `${BASE_URL}/users/${encodeURIComponent(r.studentEmail)}`,
              {
                headers: { 'ngrok-skip-browser-warning': 'true' },
              }
            );

            return { ...r, studentDetails: studentRes.data };
          } catch {
            return r;
          }
        })
      );

      setRequests(enriched);
    } catch {
      Alert.alert('Error', 'Failed to load requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: number, action: 'accept' | 'reject') => {
    try {
      await axios.put(
        `${BASE_URL}/requests/${id}/${action}`,
        {},
        {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        }
      );

      Alert.alert('Success', `Request ${action}ed`);
      fetchRequests();
    } catch {
      Alert.alert('Error', 'Failed to update request');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F6FB' }}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
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
            Manage requests 📩
          </Text>

          <Text style={{ fontSize: 30, fontWeight: '800', color: '#fff' }}>
            Incoming Requests
          </Text>

          <Text style={{ color: '#DBEAFE', marginTop: 8 }}>
            Accept or reject student requests
          </Text>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          {requests.length === 0 ? (
            <View style={emptyCard}>
              <Ionicons name="mail-outline" size={40} color="#9CA3AF" />
              <Text style={emptyTitle}>No Requests Yet</Text>
              <Text style={emptyDesc}>
                Student requests will appear here.
              </Text>
            </View>
          ) : (
            requests.map((r) => (
              <View key={r.id} style={card}>
                <Text style={name}>
                  {r.studentDetails?.name || 'Student'}
                </Text>

                <Text style={info}>📧 {r.studentEmail}</Text>
                <Text style={info}>🏠 Room ID: {r.roomId}</Text>

                {/* STATUS */}
                <StatusBadge status={r.status} />

                {/* ACTIONS */}
                {r.status === 'pending' && (
                  <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <TouchableOpacity
                      style={acceptBtn}
                      onPress={() => updateStatus(r.id, 'accept')}
                    >
                      <Text style={btnText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={rejectBtn}
                      onPress={() => updateStatus(r.id, 'reject')}
                    >
                      <Text style={btnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {r.status === 'accepted' && (
                  <Text style={{ marginTop: 8, color: '#166534' }}>
                    📞 {r.studentDetails?.phone || 'Not added'}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* COMPONENTS */

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
    <View style={{ backgroundColor: bg, padding: 8, borderRadius: 10, marginTop: 8 }}>
      <Text style={{ color, fontWeight: '700' }}>{status.toUpperCase()}</Text>
    </View>
  );
}

/* STYLES */

const card = {
  backgroundColor: '#fff',
  padding: 18,
  borderRadius: 18,
  marginBottom: 14,
};

const name = {
  fontSize: 20,
  fontWeight: '800' as const,
  color: '#111827',
};

const info = {
  color: '#6B7280',
  marginTop: 4,
};

const acceptBtn = {
  flex: 1,
  backgroundColor: '#22C55E',
  padding: 12,
  borderRadius: 10,
  alignItems: 'center' as const,
  marginRight: 5,
};

const rejectBtn = {
  flex: 1,
  backgroundColor: '#EF4444',
  padding: 12,
  borderRadius: 10,
  alignItems: 'center' as const,
  marginLeft: 5,
};

const btnText = {
  color: '#fff',
  fontWeight: '700' as const,
};

const emptyCard = {
  backgroundColor: '#fff',
  padding: 25,
  borderRadius: 18,
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