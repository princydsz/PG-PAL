import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Student = {
  id: number;
  name: string;
  email: string;
  collegeName?: string;
  budget?: string;
  preferredLocation?: string;
  preferences?: string;
  profilePhoto?: string;
};

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function RoommateScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const storedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(storedUser || '{}');

        const res = await axios.get(`${BASE_URL}/users/students`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });

        const filtered = (res.data || []).filter(
          (s: Student) => s.email !== user.email
        );

        console.log('ALL STUDENTS:', res.data.length);
        console.log('FILTERED STUDENTS:', filtered.length);
        console.log('FILTERED DATA:', filtered);

        setStudents(filtered);
        setIndex(0);
      } catch (err: any) {
        console.log('ROOMMATE FETCH ERROR:', err?.response?.data || err.message);
        Alert.alert('Error', 'Failed to load roommates');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const sendRequest = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storedUser || '{}');

      if (!students[index]) return;

      await axios.post(
        `${BASE_URL}/roommate/send`,
        {
          senderEmail: user.email,
          receiverEmail: students[index].email,
        },
        {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        }
      );
    } catch (err: any) {
      console.log('SEND REQUEST ERROR:', err?.response?.data || err.message);
    }
  };

  const moveToNextCard = () => {
    position.setValue({ x: 0, y: 0 });

    setIndex((prev) => {
      const next = prev + 1;

      if (next >= students.length) {
        Alert.alert('End', 'No more profiles');
        return prev;
      }

      return next;
    });
  };

  const forceSwipe = (dir: 'left' | 'right') => {
    const x = dir === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(async () => {
      if (dir === 'right') {
        await sendRequest();
      }

      moveToNextCard();
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, g) => {
          position.setValue({ x: g.dx, y: g.dy * 0.15 });
        },
        onPanResponderRelease: (_, g) => {
          if (g.dx > SWIPE_THRESHOLD) {
            forceSwipe('right');
          } else if (g.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left');
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();
          }
        },
      }),
    [index, students]
  );

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-18deg', '0deg', '18deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

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
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>
          Loading profiles...
        </Text>
      </View>
    );
  }

  if (students.length === 0) {
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
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>
          No roommate profiles
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: '#6B7280',
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 22,
          }}
        >
          No roommate profiles are available right now.
        </Text>
      </View>
    );
  }

  const current = students[index];

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F6FB' }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#0F2C59', '#2563EB', '#60A5FA']}
        style={{ padding: 20, paddingTop: 54, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
      >
        <Text style={{ color: '#fff', fontSize: 26, fontWeight: 'bold' }}>
          Roommate Search
        </Text>
      </LinearGradient>

      <View style={{ flex: 1, padding: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              overflow: 'hidden',
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
              ],
            }}
          >
            <View style={{ position: 'relative' }}>
              <Image
                source={{
                  uri:
                    current.profilePhoto && current.profilePhoto.trim() !== ''
                      ? current.profilePhoto
                      : `https://picsum.photos/500/700?random=${current.id}`,
                }}
                style={{ width: '100%', height: 260 }}
              />

              <Animated.View
                style={{
                  position: 'absolute',
                  top: 24,
                  left: 18,
                  borderWidth: 3,
                  borderColor: '#10B981',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  opacity: likeOpacity,
                  transform: [{ rotate: '-12deg' }],
                }}
              >
                <Text style={{ color: '#10B981', fontSize: 24, fontWeight: '800' }}>
                  LIKE
                </Text>
              </Animated.View>

              <Animated.View
                style={{
                  position: 'absolute',
                  top: 24,
                  right: 18,
                  borderWidth: 3,
                  borderColor: '#EF4444',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  opacity: nopeOpacity,
                  transform: [{ rotate: '12deg' }],
                }}
              >
                <Text style={{ color: '#EF4444', fontSize: 24, fontWeight: '800' }}>
                  NOPE
                </Text>
              </Animated.View>

              <View
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: 14,
                  backgroundColor: 'rgba(15,44,89,0.9)',
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>
                  Student
                </Text>
              </View>
            </View>

            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
                {current.name}
              </Text>

              <Text style={{ color: '#6B7280', marginTop: 6 }}>
                {current.email}
              </Text>

              <View
                style={{
                  backgroundColor: '#EAFBF3',
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 999,
                  alignSelf: 'flex-start',
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    color: '#10B981',
                    fontWeight: '800',
                    fontSize: 13,
                  }}
                >
                  {current.budget ? `₹${current.budget}` : 'No budget'}
                </Text>
              </View>

              <View style={{ marginTop: 14 }}>
                <InfoRow
                  icon={<Ionicons name="school-outline" size={18} color="#2563EB" />}
                  text={current.collegeName || 'College not added'}
                />

                <InfoRow
                  icon={<Ionicons name="location-outline" size={18} color="#2563EB" />}
                  text={current.preferredLocation || 'Location not added'}
                />

                <InfoRow
                  icon={<MaterialIcons name="favorite-border" size={18} color="#2563EB" />}
                  text={current.preferences || 'No preferences added'}
                  multiline
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => forceSwipe('left')}
            style={{
              flex: 1,
              backgroundColor: '#fee2e2',
              padding: 14,
              borderRadius: 12,
              marginRight: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#E11D48', fontWeight: 'bold' }}>
              Reject
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => forceSwipe('right')}
            style={{
              flex: 1,
              backgroundColor: '#10B981',
              padding: 14,
              borderRadius: 12,
              marginLeft: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Accept
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  text,
  multiline = false,
}: {
  icon: React.ReactNode;
  text: string;
  multiline?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        marginBottom: 10,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: '#EFF6FF',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
          marginTop: multiline ? 2 : 0,
        }}
      >
        {icon}
      </View>

      <Text
        style={{
          flex: 1,
          color: '#4B5563',
          fontSize: 15,
          lineHeight: 21,
        }}
      >
        {text}
      </Text>
    </View>
  );
}