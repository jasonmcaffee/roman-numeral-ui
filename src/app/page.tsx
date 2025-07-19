"use client";

import { View, Heading, Text, Link } from '@adobe/react-spectrum';
import ReactSpectrumProvider from '@/components/ReactSpectrumProvider';

export default function Home() {
  return (
    <ReactSpectrumProvider>
      <View padding="size-1000" maxWidth="1200px" margin="0 auto" height="100vh">
        <View marginBottom="size-300">
          <Heading level={1}>Roman Numeral UI</Heading>
          <Text>Welcome to the Roman Numeral UI!  Please follow the links below to explore.</Text>
        </View>

        <View>
          <Link href="/integer-to-roman-numeral" aria-label={"convert integers to roman numerals"}>
            <Text>Convert Integer to Roman Numeral Page</Text>
          </Link>
        </View>
      </View>
    </ReactSpectrumProvider>
  );
}
