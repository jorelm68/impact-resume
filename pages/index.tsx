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

        <View style={{
          display: 'flex',
          height: '4px',
          backgroundColor: 'black',
          width: '100%',
        }} />

        <Text style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>Go ahead and sign in with Google to start creating your Impact Resume for free!</Text>

        <Text style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>Upgrade to premium for {constants.PRICE} a year in order to export your PDFs.</Text>

        <View style={{
          display: 'flex',
          height: '4px',
          backgroundColor: 'black',
          width: '100%',
        }} />

        <img src={constants.gifs.resumes} alt="resumes" />
        <img src={constants.gifs.contact} alt="contact" />
        <img src={constants.gifs.education} alt="education" />
        <img src={constants.gifs.experience} alt="experience" />
        <img src={constants.gifs.additional} alt="additional" />
        <img src={constants.gifs.download} alt="download" />

        <Text style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>This is the modern resume template with the most Impact.</Text>
        <View style={{
          border: '4px solid orange',
        }}>
          <img src={constants.photos.resume3} alt="resume" />
        </View>
      </View>
    </main>
  );
};