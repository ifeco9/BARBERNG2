// Replace this:
// import { Href, Link } from 'expo-router';

// With this:
import { Linking } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native';

type Props = {
  href: string;
  children: React.ReactNode;
  style?: any;
};

export function ExternalLink({ href, children, style, ...rest }: Props) {
  return (
    <TouchableOpacity
      {...rest}
      onPress={async () => {
        if (Platform.OS !== 'web') {
          await openBrowserAsync(href);
        } else {
          Linking.openURL(href);
        }
      }}
    >
      <Text style={style}>{children}</Text>
    </TouchableOpacity>
  );
}
