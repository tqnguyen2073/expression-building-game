import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, FlatList } from 'react-native';

export default function App() {
  const [numbers, setNumbers] = useState([]);

  const generateNumbers = () => {
    let randomNumbers = [];
    for (let i = 0; i < 4; i++) {
      randomNumbers.push(Math.floor(Math.random() * 100) + 1); // Generates random numbers between 1 and 100
    }
    setNumbers(randomNumbers);
  };

  const renderNumber = ({ item }) => (
    <View style={styles.numberContainer}>
      <Text style={styles.number}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Generate Numbers" onPress={generateNumbers} />
      </View>
      <FlatList
        data={numbers}
        renderItem={renderNumber}
        keyExtractor={(item, index) => index.toString()}
        horizontal
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  numberContainer: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  number: {
    fontSize: 20,
    marginBottom: 30,
    fontWeight: 'bold',
  },
});
