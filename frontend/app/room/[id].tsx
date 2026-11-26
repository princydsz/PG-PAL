import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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

export default function RoomDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const roomId = Array.isArray(id) ? id[0] : id;

  const [room, setRoom] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchRoom();
    fetchReviews();
  }, [roomId]);

  const fetchRoom = async () => {
    const res = await axios.get(`${BASE_URL}/rooms/${roomId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    setRoom(res.data);
  };

  const fetchReviews = async () => {
    const res = await axios.get(`${BASE_URL}/reviews/room/${roomId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });

    const data = res.data || [];
    setReviews(data);

    // ✅ CHECK IF USER ALREADY REVIEWED
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);

      const found = data.some(
        (r: any) => r.reviewerEmail === user.email
      );

      setAlreadyReviewed(found);
    }
  };

  /* ================= REQUEST ================= */

  const handleRequest = async () => {
    try {
      setSending(true);

      const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');

      if (user.email === room.ownerEmail) {
        return Alert.alert('Not Allowed', 'Cannot request your own room');
      }

      await axios.post(`${BASE_URL}/requests/send`, {
        studentEmail: user.email,
        landlordEmail: room.ownerEmail,
        roomId: room.id,
      });

      Alert.alert('Request sent');
    } finally {
      setSending(false);
    }
  };

  /* ================= REVIEW ================= */

  const submitReview = async () => {
    if (!rating) return Alert.alert('Select rating');
    if (!comment.trim()) return Alert.alert('Write comment');

    try {
      const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');

      if (user.email === room.ownerEmail) {
        return Alert.alert('Cannot review own room');
      }

      await axios.post(`${BASE_URL}/reviews/add`, {
        reviewType: 'room',
        roomId: Number(roomId),
        reviewerEmail: user.email,
        rating,
        comment: comment.trim(),
      });

      Alert.alert('Review added');

      setRating(0);
      setComment('');
      fetchReviews();

    } catch (err: any) {
      const msg = err?.response?.data;

      if (msg === 'You already reviewed this room') {
        Alert.alert('Already Reviewed', msg);
      } else {
        Alert.alert('Error', msg || 'Failed');
      }
    }
  };

  /* ================= UI ================= */

  if (!room) return <Text>Loading...</Text>;

  const avg =
    reviews.length > 0
      ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
      : '0';

  return (
    <ScrollView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <Image
        source={{ uri: room.imageUrl || 'https://via.placeholder.com/400' }}
        style={{ height: 250 }}
      />

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '800' }}>
          {room.title}
        </Text>

        <Text>{room.location}</Text>
        <Text style={{ color: 'green' }}>₹{room.rent}</Text>

        <Text>⭐ {avg} ({reviews.length})</Text>

        <TouchableOpacity
          onPress={handleRequest}
          style={{ backgroundColor: 'green', padding: 12, marginTop: 10 }}
        >
          <Text style={{ color: '#fff' }}>
            {sending ? 'Sending...' : 'Request'}
          </Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 10 }}>{room.description}</Text>

        {/* ================= REVIEW SECTION ================= */}

        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
          Add Review
        </Text>

        {/* SHOW MESSAGE */}
        {alreadyReviewed && (
          <Text style={{ color: 'green', marginTop: 8 }}>
            You already reviewed this room
          </Text>
        )}

        {/* HIDE IF ALREADY REVIEWED */}
        {!alreadyReviewed && (
          <>
            {/* STARS */}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              {[1,2,3,4,5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Ionicons
                    name={s <= rating ? 'star' : 'star-outline'}
                    size={30}
                    color="orange"
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* INPUT */}
            <TextInput
              placeholder="Write review..."
              value={comment}
              onChangeText={setComment}
              style={{
                borderWidth: 1,
                marginTop: 10,
                padding: 10,
                borderRadius: 8,
              }}
            />

            {/* BUTTON */}
            <TouchableOpacity
              onPress={submitReview}
              style={{
                backgroundColor: 'blue',
                padding: 10,
                marginTop: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                Submit Review
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ================= SHOW REVIEWS ================= */}

        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
          Reviews
        </Text>

        {reviews.length === 0 ? (
          <Text>No reviews yet</Text>
        ) : (
          reviews.map(r => (
            <View
              key={r.id}
              style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: '#eee',
                borderRadius: 10,
              }}
            >
              <Text>{r.reviewerEmail}</Text>
              <Text>⭐ {r.rating}</Text>
              <Text>{r.comment}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}