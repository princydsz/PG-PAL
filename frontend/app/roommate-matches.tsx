import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

export default function RoommateMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      const user = JSON.parse(storedUser);

      const res = await axios.get(
        `${BASE_URL}/roommate/my/${user.email}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      const allRequests = res.data || [];

      const enriched = await Promise.all(
        allRequests.map(async (r: any) => {
          const otherEmail =
            r.senderEmail === user.email
              ? r.receiverEmail
              : r.senderEmail;

          try {
            const userRes = await axios.get(
              `${BASE_URL}/users/${encodeURIComponent(otherEmail)}`,
              {
                headers: {
                  'ngrok-skip-browser-warning': 'true',
                },
              }
            );

            return {
              ...r,
              otherUser: userRes.data,
            };
          } catch {
            return r;
          }
        })
      );

      setMatches(enriched);
    } catch (err: any) {
      console.log(
        'ROOMMATE MATCH FETCH ERROR:',
        err?.response?.data || err.message
      );

      Alert.alert(
        'Error',
        'Failed to load roommate matches'
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F3F6FB',
      }}
    >
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
          <Text
            style={{
              color: '#DBEAFE',
              fontSize: 15,
            }}
          >
            Your connections 🤝
          </Text>

          <Text
            style={{
              fontSize: 30,
              fontWeight: '800',
              color: '#fff',
              marginTop: 4,
            }}
          >
            Roommate Matches
          </Text>

          <Text
            style={{
              color: '#DBEAFE',
              marginTop: 8,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            Track your requests and accepted roommates.
          </Text>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          {matches.length === 0 ? (
            <View style={emptyCard}>
              <Ionicons
                name="people-outline"
                size={40}
                color="#9CA3AF"
              />

              <Text style={emptyTitle}>
                No Matches Yet
              </Text>

              <Text style={emptyDesc}>
                Start swiping to find your roommate.
              </Text>
            </View>
          ) : (
            matches.map((m) => (
              <View
                key={m.id}
                style={card}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={name}>
                    {m.otherUser?.name || 'Student'}
                  </Text>

                  <StatusBadge status={m.status} />
                </View>

                <Info
                  text={`📧 ${
                    m.otherUser?.email ||
                    m.senderEmail
                  }`}
                />

                <Info
                  text={`🎓 ${
                    m.otherUser?.collegeName ||
                    'Not added'
                  }`}
                />

                <Info
                  text={`📍 ${
                    m.otherUser?.preferredLocation ||
                    'Not added'
                  }`}
                />

                <Info
                  text={`💰 ${
                    m.otherUser?.budget
                      ? `₹${m.otherUser.budget}`
                      : 'Not added'
                  }`}
                />

                <View style={statusBox(m.status)}>
                  <Text style={statusText(m.status)}>
                    {m.status.toUpperCase()}
                  </Text>

                  {m.status === 'accepted' && (
                    <Text
                      style={{
                        marginTop: 6,
                        color: '#166534',
                      }}
                    >
                      📞{' '}
                      {m.otherUser?.phone ||
                        'Not added'}
                    </Text>
                  )}
                </View>

                {m.status === 'accepted' && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname:
                          '/roommate-review/[email]' as any,
                        params: {
                          email:
                            m.otherUser?.email,
                        },
                      })
                    }
                    style={{
                      marginTop: 14,
                      backgroundColor: '#2563EB',
                      paddingVertical: 14,
                      borderRadius: 14,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '800',
                        fontSize: 15,
                      }}
                    >
                      Review Roommate
                    </Text>
                  </TouchableOpacity>
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
      <Text
        style={{
          color,
          fontWeight: '700',
          fontSize: 12,
        }}
      >
        {status}
      </Text>
    </View>
  );
}

function Info({ text }: any) {
  return (
    <Text
      style={{
        color: '#4B5563',
        marginTop: 6,
      }}
    >
      {text}
    </Text>
  );
}

const card = {
  backgroundColor: '#fff',
  padding: 18,
  borderRadius: 20,
  marginBottom: 14,
  elevation: 4,
};

const name = {
  fontSize: 20,
  fontWeight: '800' as const,
  color: '#111827',
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

const statusBox = (status: string) => ({
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  backgroundColor:
    status === 'accepted'
      ? '#DCFCE7'
      : status === 'pending'
      ? '#FEF3C7'
      : '#FEE2E2',
});

const statusText = (status: string) => ({
  fontWeight: '800' as const,
  color:
    status === 'accepted'
      ? '#166534'
      : status === 'pending'
      ? '#92400E'
      : '#991B1B',
});