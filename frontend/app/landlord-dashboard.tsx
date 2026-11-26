import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function LandlordDashboard() {
  const router = useRouter();

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
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: 24,
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push('/notifications' as any)}
              style={circleBtn}
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              <View style={dot} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/profile',
                  params: { role: 'landlord' },
                } as any)
              }
              style={profileCircle}
            >
              <Ionicons name="person" size={22} color="#059669" />
            </TouchableOpacity>
          </View>

          <Text style={{ color: '#DBEAFE', fontSize: 15 }}>
            Good Morning ☀️
          </Text>

          <Text style={headerTitle}>Welcome 👋</Text>

          <Text style={headerDesc}>
            Manage your properties easily with PG-pal
          </Text>
        </LinearGradient>

        <View style={{ padding: 20, marginTop: -10 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 18,
              marginBottom: 18,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: '#111827',
                marginBottom: 12,
              }}
            >
              Quick Overview
            </Text>

            <View style={overviewRow}>
              <Ionicons name="home-outline" size={20} color="#2563EB" />
              <Text style={overviewText}>
                Manage all your listed rooms in one place
              </Text>
            </View>

            <View style={overviewRow}>
              <Ionicons name="mail-outline" size={20} color="#F97316" />
              <Text style={overviewText}>
                Review incoming student requests quickly
              </Text>
            </View>

            <View style={overviewRow}>
              <MaterialIcons name="check-circle-outline" size={20} color="#10B981" />
              <Text style={overviewText}>
                Keep your landlord profile updated and trusted
              </Text>
            </View>
          </View>

          <Text style={sectionTitle}>Quick Actions</Text>

          <View style={grid}>
            <ActionCard
              title="Add Room"
              desc="List new property"
              icon={<Ionicons name="add" size={24} color="#2563EB" />}
              bg="#EAF2FF"
              onPress={() => router.push('/add-room' as any)}
            />

            <ActionCard
              title="My Listings"
              desc="Manage rooms"
              icon={<FontAwesome5 name="building" size={20} color="#059669" />}
              bg="#EAFBF3"
              onPress={() => router.push('/my-listings' as any)}
            />

            <ActionCard
              title="Requests"
              desc="Approve or reject"
              icon={<MaterialIcons name="mail" size={24} color="#F97316" />}
              bg="#FFF1E8"
              onPress={() => router.push('/requests' as any)}
            />

            <ActionCard
              title="Profile"
              desc="Update details"
              icon={<Ionicons name="person" size={24} color="#8B5CF6" />}
              bg="#F3E8FF"
              onPress={() =>
                router.push({
                  pathname: '/profile',
                  params: { role: 'landlord' },
                } as any)
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const circleBtn = {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: 'rgba(255,255,255,0.18)',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const profileCircle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: '#D1FAE5',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  borderWidth: 2,
  borderColor: '#fff',
};

const dot = {
  position: 'absolute' as const,
  top: 8,
  right: 8,
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#EF4444',
};

const headerTitle = {
  fontSize: 30,
  color: '#fff',
  fontWeight: '800' as const,
};

const headerDesc = {
  color: '#DBEAFE',
  marginTop: 8,
};

const sectionTitle = {
  fontSize: 22,
  fontWeight: '800' as const,
  marginBottom: 14,
  color: '#111827',
};

const grid = {
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  justifyContent: 'space-between' as const,
};

const overviewRow = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  marginBottom: 10,
};

const overviewText = {
  marginLeft: 10,
  color: '#374151',
  flex: 1,
};

function ActionCard({ title, desc, icon, bg, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '48%',
        backgroundColor: bg,
        borderRadius: 20,
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
          marginBottom: 12,
        }}
      >
        {icon}
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
        {title}
      </Text>

      <Text style={{ color: '#6B7280', marginTop: 5 }}>{desc}</Text>
    </TouchableOpacity>
  );
}