import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

export default function StudentDashboard() {
  const router = useRouter();

  const [availableRoomsCount, setAvailableRoomsCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const email = user.email;

        const [roomsRes, roommateRes, requestsRes] = await Promise.all([
          axios.get(`${BASE_URL}/rooms`, {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          }),
          axios.get(`${BASE_URL}/roommate/my/${encodeURIComponent(email)}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          }),
          axios.get(`${BASE_URL}/requests/student/${encodeURIComponent(email)}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          }),
        ]);

        setAvailableRoomsCount(Array.isArray(roomsRes.data) ? roomsRes.data.length : 0);

        const roommateRequests = Array.isArray(roommateRes.data) ? roommateRes.data : [];
        const acceptedMatches = roommateRequests.filter(
          (item: any) => item.status === 'accepted'
        ).length;
        setMatchesCount(acceptedMatches);

        const roomRequests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
        setRequestsCount(roomRequests.length);
      } catch (err: any) {
        console.log('STATS ERROR:', err?.response?.data || err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F6FB' }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/profile',
                    params: { role: 'student' },
                  } as any)
                }
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#DBEAFE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#fff',
                }}
              >
                <Ionicons name="person" size={22} color="#1D4ED8" />
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={{
              fontSize: 30,
              color: '#fff',
              fontWeight: '800',
            }}
          >
            Welcome 👋
          </Text>

          <Text
            style={{
              color: '#DBEAFE',
              marginTop: 8,
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            Ready to find your perfect room and roommate?
          </Text>
        </LinearGradient>

        <View style={{ padding: 20, marginTop: -10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <StatCard
              icon={<Ionicons name="home" size={20} color="#2563EB" />}
              number={availableRoomsCount.toString()}
              label="Available Rooms"
            />
            <StatCard
              icon={<Ionicons name="heart" size={20} color="#EC4899" />}
              number={matchesCount.toString()}
              label="Matches"
            />
            <StatCard
              icon={<MaterialIcons name="mail-outline" size={20} color="#10B981" />}
              number={requestsCount.toString()}
              label="Requests"
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)' as any)}
            activeOpacity={0.9}
            style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 15,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
              marginBottom: 22,
            }}
          >
            <Ionicons name="search" size={20} color="#2563EB" />
            <Text
              style={{
                marginLeft: 10,
                color: '#6B7280',
                fontSize: 15,
              }}
            >
              Search rooms, locations, or PGs...
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>
              Quick Actions
            </Text>

            
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <ActionCard
              title="Room Search"
              desc="Browse & filter rooms"
              icon={<Ionicons name="home" size={24} color="#2563EB" />}
              bg="#EAF2FF"
              onPress={() => router.push('/(tabs)' as any)}
            />

            <ActionCard
              title="Find Roommate"
              desc="Swipe & match"
              icon={<Ionicons name="people" size={24} color="#8B5CF6" />}
              bg="#F3E8FF"
              onPress={() => router.push('/roommate' as any)}
            />

            <ActionCard
              title="My Requests"
              desc="Track your requests"
              icon={<MaterialIcons name="mail" size={24} color="#F97316" />}
              bg="#FFF1E8"
              onPress={() => router.push('/my-requests' as any)}
            />

            <ActionCard
              title="Rental Guide"
              desc="Tips & safety"
              icon={<Ionicons name="book" size={24} color="#10B981" />}
              bg="#EAFBF3"
              onPress={() => router.push('/rental-guide' as any)}
            />

            <ActionCard
              title="Matches"
              desc="View roommate matches"
              icon={<Ionicons name="heart" size={24} color="#EC4899" />}
              bg="#FDECF3"
              onPress={() => router.push('/roommate-matches' as any)}
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/profile',
                params: { role: 'student' },
              } as any)
            }
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 18,
              marginTop: 18,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: '#DBEAFE',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 14,
              }}
            >
              <FontAwesome5 name="user" size={20} color="#2563EB" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>
                Profile
              </Text>
              <Text style={{ color: '#6B7280', marginTop: 4 }}>
                Edit your personal details and preferences
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  number,
  label,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
}) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: '31%',
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View style={{ marginBottom: 10 }}>{icon}</View>
      <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>
        {number}
      </Text>
      <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

function ActionCard({
  title,
  desc,
  icon,
  bg,
  onPress,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  bg: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: '48%',
        backgroundColor: bg,
        borderRadius: 22,
        padding: 18,
        marginBottom: 14,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        {icon}
      </View>

      <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>
        {title}
      </Text>

      <Text style={{ color: '#6B7280', marginTop: 6, lineHeight: 20 }}>
        {desc}
      </Text>

      <View
        style={{
          marginTop: 14,
          alignSelf: 'flex-end',
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="arrow-forward" size={18} color="#111827" />
      </View>
    </TouchableOpacity>
  );
}