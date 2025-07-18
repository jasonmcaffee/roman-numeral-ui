"use client";

import { View, Heading, Text, Link } from '@adobe/react-spectrum';
import ReactSpectrumProvider from '@/components/ReactSpectrumProvider';

export default function Home() {
  return (
    <ReactSpectrumProvider>
      <View padding="size-1000" maxWidth="1200px" margin="0 auto">
        <View marginBottom="size-300">
          <Heading level={1}>Roman Numeral Converter</Heading>
          <Text>Convert between integers and Roman numerals</Text>
        </View>

        <View>
          <Link href="/integer-to-roman-numeral">
            <Text>Convert Integer to Roman Numeral</Text>
          </Link>
        </View>
      </View>
    </ReactSpectrumProvider>
  );
}
