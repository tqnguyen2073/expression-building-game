import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [input, setInput] = useState('');
  const [targetValue, setTargetValue] = useState(0);
  const [generatedExpression, setGeneratedExpression] = useState('');
  const [userValue, setUserValue] = useState(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    generateRandomNumbers();
    setInput('');
    setUserValue(null);
  };

  const generateRandomNumbers = () => {
    let randomNumbers = [];
    while (randomNumbers.length < 4) {
      let randomNumber = Math.floor(Math.random() * 99) + 1; // generates a number between 1 and 99
      if (!randomNumbers.some((num) => num.value === randomNumber)) {
        randomNumbers.push({ value: randomNumber, disabled: false });
      }
    }
    setNumbers(randomNumbers);
    const expression = generateRandomExpression(randomNumbers);
    const result = eval(expression);
    setGeneratedExpression(expression);
    setTargetValue(result);
  };

  const generateRandomExpression = (numbers) => {
    const operations = ['+', '-', '*', '/'];
    let expression = numbers[0].value.toString();

    for (let i = 1; i < numbers.length; i++) {
      const randomOperation = operations[Math.floor(Math.random() * operations.length)];
      expression += randomOperation + numbers[i].value.toString();
    }

    return expression;
  };

  const handleNumberPress = (number) => {
    setInput(input + number.value);
    setNumbers(numbers.map((num) =>
      num.value === number.value ? { ...num, disabled: true } : num
    ));
  };

  const handleOperationPress = (operation) => {
    setInput(input + operation);
  };

  const handleResetPress = () => {
    startNewGame();
  };

  const handleRetryPress = () => {
    setInput('');
    setNumbers(numbers.map((num) => ({ ...num, disabled: false })));
  };

  const handleCheckPress = () => {
    if (input.length === 0 || !/\d+[+\-*/]\d+/.test(input)) {
      Alert.alert('Error', 'Please enter a valid expression using the numbers and operations.');
      return;
    }

    try {
      const result = eval(input); // Evaluate the user's input
      setUserValue(result);

      if (result === targetValue) {
        Alert.alert(
          'Congratulations! You won the game.',
          'Tap the button to start a new game.',
          [
            { text: 'New Game', onPress: startNewGame }
          ]
        );
      } else {
        Alert.alert(
          'Your expression is incorrect.',
          'Tap the button to try again.',
          [
            { text: 'Retry', onPress: handleRetryPress }
          ]
        );
      }
      
    } catch (error) {
      Alert.alert('Error', 'Invalid expression.');
    }
  };

  const formatTargetValue = (value) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(2).toString();
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.inputBar}>Input: {input}</Text>
      <Text style={styles.targetValue}>Target Value: {formatTargetValue(targetValue)}</Text>
      <Text style={styles.generatedExpression}>Generated Expression: {generatedExpression}</Text>
      <Text style={styles.userValue}>User Value: {userValue !== null ? formatTargetValue(userValue) : 'N/A'}</Text>
      <View style={styles.buttonGroup}>
        {numbers.map((number, index) => (
          <Button
            key={index}
            title={number.value.toString()}
            onPress={() => handleNumberPress(number)}
            disabled={number.disabled}
          />
        ))}
      </View>
      <View style={styles.buttonGroup}>
        <Button title="+" onPress={() => handleOperationPress('+')} />
        <Button title="-" onPress={() => handleOperationPress('-')} />
        <Button title="*" onPress={() => handleOperationPress('*')} />
        <Button title="/" onPress={() => handleOperationPress('/')} />
      </View>
      <View style={styles.buttonGroup}>
        <Button title="Reset" onPress={handleResetPress} />
        <Button title="Check" onPress={handleCheckPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  inputBar: {
    fontSize: 24,
    marginBottom: 10,
  },
  targetValue: {
    fontSize: 24,
    marginBottom: 10,
  },
  generatedExpression: {
    fontSize: 20,
    marginBottom: 10,
    color: 'gray',
  },
  userValue: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});

export default App;
