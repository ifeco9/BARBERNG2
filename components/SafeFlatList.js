import React from 'react';
import { FlatList } from 'react-native';

// This component prevents the nested VirtualizedList warning
const SafeFlatList = (props) => {
  return (
    <FlatList
      {...props}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      nestedScrollEnabled={true}
    />
  );
};

export default SafeFlatList;