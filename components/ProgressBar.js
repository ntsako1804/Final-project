import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const ProgressBar = ({ step }) => {
  const totalSteps = 5;

  return (
    <View style={styles.progressBar}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.circle,
              index < step && styles.activeCircle,
            ]}
          >
            <Text style={styles.stepText}>{index + 1}</Text>
          </View>
          {index < totalSteps - 1 && (
            <View
              style={[
                styles.line,
                index < step - 1 && styles.activeLine,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#2196F3',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  line: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: '#2196F3',
  },
});

export default ProgressBar;
