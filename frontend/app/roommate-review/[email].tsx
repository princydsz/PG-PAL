import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const BASE_URL = 'https://semimanagerial-calcanean-avah.ngrok-free.dev';

type Review = {
  id: number;
  reviewerEmail: string;
  rating: number;
  comment: string;
};

export default function RoommateReview() {
  const { email } = useLocalSearchParams();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/reviews/roommate/${email}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      setReviews(res.data || []);

      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        const user = JSON.parse(storedUser);

        const found = res.data.some(
          (r: any) => r.reviewerEmail === user.email
        );

        setAlreadyReviewed(found);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitReview = async () => {
    try {
      if (!rating) {
        return Alert.alert('Select rating');
      }

      if (!comment) {
        return Alert.alert('Write comment');
      }

      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        return Alert.alert('Login required');
      }

      const user = JSON.parse(storedUser);

      await axios.post(
        `${BASE_URL}/reviews/add`,
        {
          reviewType: 'roommate',
          reviewerEmail: user.email,
          reviewedEmail: email,
          rating,
          comment,
        },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      Alert.alert('Review added');

      setRating(0);
      setComment('');

      fetchReviews();
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data || 'Failed'
      );
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#F3F6FB',
      }}
    >
      <StatusBar barStyle="dark-content" />

      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            marginBottom: 20,
          }}
        >
          Roommate Reviews
        </Text>

        {!alreadyReviewed && (
          <>
            <Text
              style={{
                fontWeight: '700',
                marginBottom: 10,
              }}
            >
              Add Review
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 14,
              }}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setRating(s)}
                >
                  <Ionicons
                    name={
                      s <= rating
                        ? 'star'
                        : 'star-outline'
                    }
                    size={34}
                    color="orange"
                    style={{ marginRight: 6 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Write review..."
              value={comment}
              onChangeText={setComment}
              multiline
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                padding: 14,
                minHeight: 100,
                marginBottom: 14,
              }}
            />

            <TouchableOpacity
              onPress={submitReview}
              style={{
                backgroundColor: '#2563EB',
                padding: 16,
                borderRadius: 14,
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: 16,
                }}
              >
                Submit Review
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            marginBottom: 12,
          }}
        >
          Reviews
        </Text>

        {reviews.length === 0 ? (
          <Text>No reviews yet</Text>
        ) : (
          reviews.map((r) => (
            <View
              key={r.id}
              style={{
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 16,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontWeight: '700',
                }}
              >
                {r.reviewerEmail}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                }}
              >
                ⭐ {r.rating}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: '#4B5563',
                }}
              >
                {r.comment}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}