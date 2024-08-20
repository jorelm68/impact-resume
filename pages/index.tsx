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

        <img src={constants.gifs.resumes} alt="resumes" />
        <img src={constants.gifs.contact} alt="contact" />
        <img src={constants.gifs.education} alt="education" />
        <img src={constants.gifs.experience} alt="experience" />
        <img src={constants.gifs.additional} alt="additional" />
        <img src={constants.gifs.download} alt="download" />

        <img src={constants.photos.resume2} alt="resume" />
      </View>
    </main>
  );
};