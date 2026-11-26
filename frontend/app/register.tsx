import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function Register() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#0F2C59', '#2563EB', '#60A5FA']}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 22,
          paddingVertical: 28,
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.replace('/login' as any)}
          style={{
            position: 'absolute',
            top: 55,
            left: 22,
            zIndex: 10,
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: 'rgba(255,255,255,0.18)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Branding */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: 54,
              backgroundColor: 'rgba(255,255,255,0.18)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.35)',
            }}
          >
            <Image
              source={require('../assets/logo.png')}
              style={{ width: 90, height: 90, borderRadius: 45 }}
              resizeMode="cover"
            />
          </View>

          <Text
            style={{
              color: '#fff',
              fontSize: 30,
              fontWeight: '800',
              marginTop: 12,
            }}
          >
            PG-pal
          </Text>

          <Text
            style={{
              color: '#DBEAFE',
              marginTop: 6,
              fontSize: 14,
            }}
          >
            Housing Companion
          </Text>
        </View>

        {/* Main card */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderRadius: 28,
            padding: 22,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 18,
            elevation: 10,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: '#111827',
              textAlign: 'center',
            }}
          >
            Create Your Account 
          </Text>

          <Text
            style={{
              color: '#6B7280',
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 20,
              fontSize: 15,
            }}
          >
            Choose how you want to join PG-pal
          </Text>

          {/* Student Card */}
          <TouchableOpacity
            onPress={() => router.push('/register-student' as any)}
            activeOpacity={0.9}
            style={{
              backgroundColor: '#EFF6FF',
              borderWidth: 1.5,
              borderColor: '#93C5FD',
              borderRadius: 22,
              padding: 18,
              marginBottom: 16,
              shadowColor: '#2563EB',
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  backgroundColor: '#BFDBFE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 14,
                }}
              >
                <Ionicons name="school" size={28} color="#1D4ED8" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '800',
                    color: '#1D4ED8',
                    marginBottom: 4,
                  }}
                >
                  Student
                </Text>

                <Text
                  style={{
                    color: '#374151',
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  Find rooms, connect with roommates, and make your stay easier.
                </Text>
              </View>

              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: '#2563EB',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginTop: 14,
              }}
            >
              <Tag text="Find PGs" />
              <Tag text="Roommates" />
              <Tag text="Quick Match" />
            </View>
          </TouchableOpacity>

          {/* Landlord Card */}
          <TouchableOpacity
            onPress={() => router.push('/register-landlord' as any)}
            activeOpacity={0.9}
            style={{
              backgroundColor: '#ECFDF5',
              borderWidth: 1.5,
              borderColor: '#86EFAC',
              borderRadius: 22,
              padding: 18,
              marginBottom: 18,
              shadowColor: '#10B981',
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  backgroundColor: '#D1FAE5',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 14,
                }}
              >
                <FontAwesome5 name="building" size={24} color="#047857" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '800',
                    color: '#047857',
                    marginBottom: 4,
                  }}
                >
                  Landlord
                </Text>

                <Text
                  style={{
                    color: '#374151',
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  Add listings, manage requests, and track your properties easily.
                </Text>
              </View>

              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: '#10B981',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginTop: 14,
              }}
            >
              <Tag text="Add Listings" green />
              <Tag text="Manage Requests" green />
              <Tag text="Track Bookings" green />
            </View>
          </TouchableOpacity>

          {/* Trust box */}
          <View
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 18,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F9FAFB',
              marginBottom: 14,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: '#DBEAFE',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <MaterialIcons name="verified-user" size={22} color="#2563EB" />
            </View>

            <Text
              style={{
                flex: 1,
                color: '#374151',
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              Join users who trust PG-pal for safe and comfortable housing.
            </Text>
          </View>

          {/* Login link */}
          <TouchableOpacity onPress={() => router.replace('/login' as any)}>
            <Text
              style={{
                textAlign: 'center',
                color: '#4B5563',
                marginTop: 4,
                fontSize: 15,
              }}
            >
              Already have an account?{' '}
              <Text style={{ fontWeight: '800', color: '#2563EB' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

function Tag({ text, green = false }: { text: string; green?: boolean }) {
  return (
    <View
      style={{
        backgroundColor: green ? '#D1FAE5' : '#DBEAFE',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: green ? '#047857' : '#1D4ED8',
        }}
      >
        {text}
      </Text>
    </View>
  );
}