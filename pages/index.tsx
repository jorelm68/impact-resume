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

        <img src={constants.photos.resume1} alt="resume" />

        <Text style={{
        }}>Welcome to the PDF Generator</Text>
        <Text style={{
        }}>This is a simple example of how to generate a PDF file using React and React-PDF.</Text>
        <Text style={{
        }}>You can generate a PDF file by clicking the button below.</Text>
        <Text style={{
        }}>$10.00</Text>


      </View>
    </main>
  );
};