import constants from "@/lib/constants";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

export default function Home() {
  return (
    <main>
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      }}>
        <img src={constants.photos.nameTransparent} alt="logo" />

        <Text style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>Go ahead and sign in with Google to start creating your Impact Resume for free!</Text>

        <img src={constants.photos.resume1} alt="resume" />
      </View>
    </main>
  );
};