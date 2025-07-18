"use client";

import { View, Heading, Text, Link } from '@adobe/react-spectrum';
import ReactSpectrumProvider from '@/components/ReactSpectrumProvider';

export default function IntegerToRoman() {
  return (
    <ReactSpectrumProvider>
      <View padding="size-1000" maxWidth="1200px" margin="0 auto">
        <View marginBottom="size-300">
          <Heading level={1}>Integer to Roman Numeral</Heading>
          <Text>Convert integers to Roman numerals</Text>
        </View>
        
        <View marginBottom="size-300">
          <Text>Hello World</Text>
        </View>
        
        <View>
          <Link href="/">
            <Text>Back to Home</Text>
          </Link>
        </View>
      </View>
    </ReactSpectrumProvider>
  );
} 