import { Linking, Platform, TouchableOpacity, Text } from 'react-native';
import { type ComponentProps } from 'react';

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
        await Linking.openURL(href);
      }}
    >
      <Text style={style}>{children}</Text>
    </TouchableOpacity>
  );
}