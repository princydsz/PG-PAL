import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StatusBar, Text, View } from 'react-native';

export default function RentalGuide() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F3F6FB' }}>
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
          <Text style={{ color: '#DBEAFE', fontSize: 15 }}>
            Rent smart, stay safe 🏠
          </Text>

          <Text
            style={{
              fontSize: 30,
              fontWeight: '800',
              color: '#fff',
              marginTop: 4,
            }}
          >
            Rental Success Guide
          </Text>

          <Text
            style={{
              color: '#DBEAFE',
              marginTop: 8,
              fontSize: 14,
              lineHeight: 21,
            }}
          >
            Navigate the rental process with confidence using these simple checklists and safety tips.
          </Text>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          {/* Hero Tip */}
          <View style={tipCard}>
            <View style={tipIconWrap}>
              <Ionicons name="bulb-outline" size={24} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={tipTitle}>Pro Tip</Text>
              <Text style={tipDesc}>
                A little preparation helps you find a better place and avoid future problems.
              </Text>
            </View>
          </View>

          {/* Rental Agreement Checklist */}
          <View style={card}>
            <View style={cardHeaderRow}>
              <View style={iconCircleBlue}>
                <MaterialIcons name="fact-check" size={24} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={cardTitle}>Rental Agreement Checklist</Text>
                <Text style={cardSubtext}>
                  Make sure everything is clear before you sign.
                </Text>
              </View>
              <View style={badgeBlue}>
                <Text style={badgeBlueText}>Important</Text>
              </View>
            </View>

            <CheckItem text="Verify landlord ownership documents" />
            <CheckItem text="Check rent amount and payment terms" />
            <CheckItem text="Confirm security deposit details" />
            <CheckItem text="Review notice period clauses" />
            <CheckItem text="Ensure maintenance responsibilities are clear" />
            <CheckItem text="Get the agreement notarized if needed" />
          </View>

          {/* Before Moving In */}
          <View style={[card, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1 }]}>
            <View style={cardHeaderRow}>
              <View style={iconCircleGreen}>
                <Ionicons name="home-outline" size={24} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={cardTitle}>Before Moving In</Text>
                <Text style={cardSubtext}>
                  Check these essentials before settling into your new room.
                </Text>
              </View>
              <View style={badgeGreen}>
                <Text style={badgeGreenText}>Must Do</Text>
              </View>
            </View>

            <GreenItem text="Inspect room condition and take photos" />
            <GreenItem text="Test all electrical appliances" />
            <GreenItem text="Check water and bathroom facilities" />
            <GreenItem text="Verify internet connectivity" />
            <GreenItem text="Meet other residents in shared accommodation" />
            <GreenItem text="Collect all keys and access cards" />
          </View>

          {/* Red Flags */}
          <View style={[card, { backgroundColor: '#FEF2F2', borderColor: '#FECACA', borderWidth: 1 }]}>
            <View style={cardHeaderRow}>
              <View style={iconCircleRed}>
                <Ionicons name="warning-outline" size={24} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[cardTitle, { color: '#B91C1C' }]}>Red Flags to Watch</Text>
                <Text style={cardSubtext}>
                  Stay alert and avoid potential rental problems.
                </Text>
              </View>
              <View style={badgeRed}>
                <Text style={badgeRedText}>Be Careful</Text>
              </View>
            </View>

            <RedItem text="Landlord refuses a written agreement" />
            <RedItem text="Unreasonably high security deposit" />
            <RedItem text="No clarity on utility bill payments" />
            <RedItem text="Poor maintenance or safety concerns" />
            <RedItem text="Negative reviews from previous tenants" />
            <RedItem text="Hidden charges not mentioned upfront" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <View style={itemRow}>
      <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
      <Text style={itemText}>{text}</Text>
    </View>
  );
}

function GreenItem({ text }: { text: string }) {
  return (
    <View style={itemRow}>
      <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
      <Text style={itemText}>{text}</Text>
    </View>
  );
}

function RedItem({ text }: { text: string }) {
  return (
    <View style={itemRow}>
      <Ionicons name="ellipse" size={10} color="#DC2626" style={{ marginTop: 5 }} />
      <Text style={itemText}>{text}</Text>
    </View>
  );
}

const tipCard = {
  backgroundColor: '#F5F3FF',
  borderRadius: 20,
  padding: 16,
  marginBottom: 16,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
};

const tipIconWrap = {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: '#E9D5FF',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginRight: 12,
};

const tipTitle = {
  fontSize: 19,
  fontWeight: '800' as const,
  color: '#5B21B6',
  marginBottom: 4,
};

const tipDesc = {
  color: '#6B7280',
  lineHeight: 20,
};

const card = {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 22,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

const cardHeaderRow = {
  flexDirection: 'row' as const,
  alignItems: 'flex-start' as const,
  marginBottom: 14,
};

const iconCircleBlue = {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#DBEAFE',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginRight: 12,
};

const iconCircleGreen = {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#DCFCE7',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginRight: 12,
};

const iconCircleRed = {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#FEE2E2',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginRight: 12,
};

const cardTitle = {
  fontSize: 22,
  fontWeight: '800' as const,
  color: '#111827',
  marginBottom: 4,
};

const cardSubtext = {
  color: '#6B7280',
  lineHeight: 20,
};

const badgeBlue = {
  backgroundColor: '#EAF2FF',
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 999,
};

const badgeBlueText = {
  color: '#2563EB',
  fontWeight: '700' as const,
  fontSize: 12,
};

const badgeGreen = {
  backgroundColor: '#DCFCE7',
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 999,
};

const badgeGreenText = {
  color: '#15803D',
  fontWeight: '700' as const,
  fontSize: 12,
};

const badgeRed = {
  backgroundColor: '#FEE2E2',
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 999,
};

const badgeRedText = {
  color: '#B91C1C',
  fontWeight: '700' as const,
  fontSize: 12,
};

const itemRow = {
  flexDirection: 'row' as const,
  alignItems: 'flex-start' as const,
  marginBottom: 10,
};

const itemText = {
  flex: 1,
  fontSize: 15,
  color: '#4B5563',
  marginLeft: 10,
  lineHeight: 22,
};