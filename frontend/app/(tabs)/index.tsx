import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
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
};

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

export default function Home() {
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [location, setLocation] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAllRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/rooms`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      setRooms(res.data);
    } catch (err: any) {
      console.log('FETCH ALL ROOMS ERROR:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

 const applyFilters = async () => {
  try {
    setLoading(true);

    let params = [];

    if (location.trim()) params.push(`location=${encodeURIComponent(location)}`);
    if (maxRent.trim()) params.push(`maxRent=${encodeURIComponent(maxRent)}`);
    if (type.trim()) params.push(`type=${encodeURIComponent(type)}`);

    const url =
      params.length > 0
        ? `${BASE_URL}/rooms/search?${params.join('&')}`
        : `${BASE_URL}/rooms`;

    const res = await axios.get(url, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });

    setRooms(res.data);
  } catch (err: any) {
    console.log('FILTER ERROR:', err?.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  const clearFilters = () => {
    setLocation('');
    setMaxRent('');
    setType('');
    fetchAllRooms();
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

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
                paddingTop: 50,
                paddingBottom: 26,
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  style={topCircleBtn}
                  onPress={() => router.back()}
                  activeOpacity={0.9}
                >
                  <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={topCircleBtn} activeOpacity={0.9}>
                  <Ionicons name="options-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={{ color: '#DBEAFE', fontSize: 15 }}>
                Find your perfect stay 🏠
              </Text>

              <Text
                style={{
                  fontSize: 30,
                  fontWeight: '800',
                  color: '#fff',
                  marginTop: 4,
                }}
              >
                Explore Rooms
              </Text>

              <Text
                style={{
                  color: '#DBEAFE',
                  marginTop: 8,
                  marginBottom: 20,
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
                Search by location, budget, and room type to discover the best PG for you.
              </Text>

              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.16)',
                  borderRadius: 22,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.22)',
                }}
              >
                <InputRow
                  icon={<Ionicons name="location-outline" size={20} color="#2563EB" />}
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                />

                <InputRow
                  icon={<MaterialIcons name="currency-rupee" size={20} color="#2563EB" />}
                  placeholder="Max Rent"
                  value={maxRent}
                  onChangeText={setMaxRent}
                  keyboardType="numeric"
                />

                <InputRow
                  icon={<Ionicons name="home-outline" size={20} color="#2563EB" />}
                  placeholder="Type (single/shared)"
                  value={type}
                  onChangeText={(text) => setType(text.toLowerCase())}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setType('single')}
                    style={[
                      chip,
                      {
                        backgroundColor:
                          type.toLowerCase() === 'single'
                            ? '#2563EB'
                            : 'rgba(255,255,255,0.22)',
                      },
                    ]}
                  >
                    <Text style={chipText}>Single</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setType('shared')}
                    style={[
                      chip,
                      {
                        backgroundColor:
                          type.toLowerCase() === 'shared'
                            ? '#2563EB'
                            : 'rgba(255,255,255,0.22)',
                      },
                    ]}
                  >
                    <Text style={chipText}>Shared</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    style={applyBtn}
                    onPress={applyFilters}
                    activeOpacity={0.9}
                  >
                    <Text style={applyBtnText}>Apply Filters</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={clearBtn}
                    onPress={clearFilters}
                    activeOpacity={0.9}
                  >
                    <Text style={clearBtnText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>

            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 18,
                paddingBottom: 6,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>
                  Available Rooms
                </Text>
                <Text style={{ color: '#2563EB', fontWeight: '700', marginTop: 4 }}>
                  {loading ? 'Loading...' : `${rooms.length} Results`}
                </Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <View
              style={{
                marginTop: 60,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 30,
              }}
            >
              <View
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 37,
                  backgroundColor: '#E5E7EB',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons name="search-outline" size={30} color="#6B7280" />
              </View>

              <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>
                No rooms found
              </Text>

              <Text
                style={{
                  textAlign: 'center',
                  color: '#6B7280',
                  marginTop: 8,
                  lineHeight: 20,
                }}
              >
                Try changing your filters to see more room options.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/room/[id]' as any,
                params: { id: item.id.toString() },
              })
            }
            activeOpacity={0.92}
            style={{ paddingHorizontal: 20, marginTop: 12 }}
          >
            <View style={card}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{
                    uri: item.imageUrl || 'https://via.placeholder.com/400',
                  }}
                  style={{
                    width: '100%',
                    height: 210,
                  }}
                  resizeMode="cover"
                />

                

                <View
                  style={{
                    position: 'absolute',
                    left: 14,
                    bottom: 14,
                    backgroundColor: 'rgba(37,99,235,0.94)',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>
                    {item.type}
                  </Text>
                </View>
              </View>

              <View style={{ padding: 16 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '800',
                    color: '#111827',
                  }}
                >
                  {item.title}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                >
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={{ color: '#6B7280', marginLeft: 4 }}>
                    {item.location}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 16,
                  }}
                >
                  <View>
                    <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
                      Starting from
                    </Text>
                    <Text
                      style={{
                        color: '#2563EB',
                        fontWeight: '800',
                        fontSize: 26,
                        marginTop: 2,
                      }}
                    >
                      ₹{item.rent}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 21,
                      backgroundColor: '#EAF2FF',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="arrow-forward" size={20} color="#2563EB" />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          loading ? (
            <View style={{ paddingTop: 30 }}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 12,
                  color: '#6B7280',
                }}
              >
                Loading rooms...
              </Text>
            </View>
          ) : <View style={{ height: 18 }} />
        }
      />
    </View>
  );
}

function InputRow({
  icon,
  ...props
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
}) {
  return (
    <View
      style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 14,
        paddingHorizontal: 14,
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}
    >
      {icon}
      <TextInput
        {...props}
        placeholderTextColor="#9CA3AF"
        style={{
          flex: 1,
          paddingVertical: 14,
          paddingHorizontal: 10,
          color: '#111827',
          fontSize: 15,
        }}
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

const chip = {
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.22)',
};

const chipText = {
  color: '#fff',
  fontWeight: '700' as const,
  fontSize: 12,
};

const applyBtn = {
  flex: 1,
  backgroundColor: '#2563EB',
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: 'center' as const,
};

const clearBtn = {
  flex: 1,
  backgroundColor: '#fff',
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: 'center' as const,
};

const applyBtnText = {
  color: '#fff',
  fontWeight: '800' as const,
};

const clearBtnText = {
  color: '#2563EB',
  fontWeight: '800' as const,
};

const card = {
  backgroundColor: '#fff',
  borderRadius: 24,
  overflow: 'hidden' as const,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 5 },
  elevation: 5,
};