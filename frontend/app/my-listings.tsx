import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Room = {
  id: number;
  title: string;
  location: string;
  rent: number;
  type: string;
  imageUrl: string;
  ownerEmail: string;
};

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

export default function MyListings() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);

        const storedUser = await AsyncStorage.getItem('user');

        if (!storedUser) {
          Alert.alert('Error', 'Please login again');
          return;
        }

        const user = JSON.parse(storedUser);
        setOwnerEmail(user.email);

        const res = await axios.get(
          `${BASE_URL}/rooms/owner/${encodeURIComponent(user.email)}`,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          }
        );

        setRooms(res.data || []);
      } catch (err: any) {
        console.log('MY LISTINGS ERROR:', err?.response?.data || err.message);
        Alert.alert(
          'Error',
          err?.response?.data || err.message || 'Failed to load your listings'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Room',
      'Are you sure you want to delete this room?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(
                `${BASE_URL}/rooms/${id}?ownerEmail=${encodeURIComponent(ownerEmail)}`,
                {
                  headers: {
                    'ngrok-skip-browser-warning': 'true',
                  },
                }
              );

              setRooms((prev) => prev.filter((room) => room.id !== id));
              Alert.alert('Success', 'Room deleted successfully');
            } catch (err: any) {
              console.log('DELETE ERROR:', err?.response?.data || err.message);
              Alert.alert(
                'Delete Failed',
                err?.response?.data || err.message || 'Something went wrong'
              );
            }
          },
        },
      ]
    );
  };

  const renderRoomCard = ({ item }: { item: Room }) => (
    <View style={card}>
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/600x400' }}
        style={{
          width: '100%',
          height: 210,
        }}
        resizeMode="cover"
      />

      <View style={{ padding: 16 }}>
        <Text style={roomTitle}>{item.title}</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 2,
            marginBottom: 10,
          }}
        >
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={[roomSub, { marginLeft: 4 }]}>{item.location}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          <Text style={typeTag}>{item.type}</Text>
          <Text style={price}>₹{item.rent}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/edit-room/[id]' as any,
                params: { id: item.id.toString() },
              })
            }
            style={editBtn}
            activeOpacity={0.9}
          >
            <MaterialIcons name="edit" size={18} color="#fff" />
            <Text style={btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={deleteBtn}
            activeOpacity={0.9}
          >
            <MaterialIcons name="delete-outline" size={18} color="#fff" />
            <Text style={btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F6FB' }}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
        ListHeaderComponent={
          <>
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 18,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={topCircleBtn}
                >
                  <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/add-room' as any)}
                  style={topCircleBtn}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={{ color: '#DBEAFE', fontSize: 15 }}>
                Manage your uploaded rooms 🏠
              </Text>

              <Text
                style={{
                  fontSize: 30,
                  fontWeight: '800',
                  color: '#fff',
                  marginTop: 4,
                }}
              >
                My Listings
              </Text>

              <Text
                style={{
                  color: '#DBEAFE',
                  marginTop: 8,
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
                View your listings, edit details, and remove rooms when needed.
              </Text>
            </LinearGradient>

            <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 3,
                }}
              >
                <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>
                  Logged in as
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                  {ownerEmail || 'Loading user...'}
                </Text>
                <Text style={{ color: '#2563EB', marginTop: 8, fontWeight: '700' }}>
                  {loading ? 'Loading listings...' : `${rooms.length} listing${rooms.length === 1 ? '' : 's'}`}
                </Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
              <View style={emptyCard}>
                <Ionicons name="home-outline" size={40} color="#9CA3AF" />
                <Text style={emptyTitle}>No rooms listed yet</Text>
                <Text style={emptyDesc}>
                  Add your first room listing to start receiving requests.
                </Text>

                <TouchableOpacity
                  onPress={() => router.push('/add-room' as any)}
                  style={emptyActionBtn}
                  activeOpacity={0.9}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={emptyActionText}>Add Room</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
              <Text style={{ textAlign: 'center', color: '#6B7280' }}>
                Loading listings...
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
            {renderRoomCard({ item })}
          </View>
        )}
      />
    </View>
  );
}

const topCircleBtn = {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: 'rgba(255,255,255,0.18)',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const card = {
  backgroundColor: '#fff',
  borderRadius: 24,
  overflow: 'hidden' as const,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

const roomTitle = {
  fontSize: 23,
  fontWeight: '800' as const,
  color: '#111827',
};

const roomSub = {
  color: '#6B7280',
  fontSize: 15,
};

const typeTag = {
  backgroundColor: '#EEF2FF',
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 10,
  color: '#1E3A8A',
  fontWeight: '700' as const,
  overflow: 'hidden' as const,
};

const price = {
  color: '#22C55E',
  fontWeight: '800' as const,
  fontSize: 22,
};

const editBtn = {
  flex: 1,
  backgroundColor: '#2563EB',
  paddingVertical: 13,
  borderRadius: 14,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexDirection: 'row' as const,
  gap: 6,
};

const deleteBtn = {
  flex: 1,
  backgroundColor: '#EF4444',
  paddingVertical: 13,
  borderRadius: 14,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexDirection: 'row' as const,
  gap: 6,
};

const btnText = {
  color: '#fff',
  fontWeight: '800' as const,
  fontSize: 15,
};

const emptyCard = {
  backgroundColor: '#fff',
  borderRadius: 22,
  padding: 24,
  alignItems: 'center' as const,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

const emptyTitle = {
  textAlign: 'center' as const,
  color: '#111827',
  fontSize: 20,
  fontWeight: '800' as const,
  marginTop: 12,
};

const emptyDesc = {
  textAlign: 'center' as const,
  color: '#6B7280',
  fontSize: 15,
  marginTop: 6,
  lineHeight: 22,
};

const emptyActionBtn = {
  marginTop: 16,
  backgroundColor: '#2563EB',
  paddingHorizontal: 18,
  paddingVertical: 12,
  borderRadius: 14,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 6,
};

const emptyActionText = {
  color: '#fff',
  fontWeight: '800' as const,
  fontSize: 15,
};