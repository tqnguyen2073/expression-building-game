import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [input, setInput] = useState('');
  const [targetValue, setTargetValue] = useState(0);
  const [generatedExpression, setGeneratedExpression] = useState('');
  const [userValue, setUserValue] = useState(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    generateRandomNumbers();
    setInput('');
    setUserValue(null);
    setAttemptsRemaining(3);
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
      const result = eval(input);
      setUserValue(result);

      if (attemptsRemaining > 1) { // Check if there are attempts left BEFORE decrementing
        setAttemptsRemaining(attemptsRemaining - 1); // Decrement attempts
        if (result === targetValue) {
          Alert.alert(
            'Congratulations! You won the game.',
            'Tap the button to start a new game.',
            [{ text: 'New Game', onPress: startNewGame }]
          );
        } else {
          Alert.alert(
            'Your expression is incorrect.',
            'Tap the button to try again.',
            [{ text: 'Retry', onPress: handleRetryPress }]
          );
        }
      } else { // This is the last attempt
        setAttemptsRemaining(0); // Set attempts to 0
        if (result === targetValue) {
          Alert.alert(
            'Congratulations! You won the game.',
            'Tap the button to start a new game.',
            [{ text: 'New Game', onPress: startNewGame }]
          );
        } else {
          Alert.alert(
            'Incorrect! You are out of attempts.',
            'Tap the button to start a new game.',
            [{ text: 'New Game', onPress: startNewGame }]
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid expression.');
    }
  };

  const formatTargetValue = (value) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(2).toString();
  };


  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>EXPRESSION BUILDING</Text>
        <Text style={styles.explanation}>In this game, you will create an expression that gives the target value.</Text>
        <View style={styles.valueSection}>
          {/* YOUR VALUE */}
          <View style={styles.valueItem}>
            <Text style={styles.valueLabel}>YOUR VALUE</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{userValue !== null ? formatTargetValue(userValue) : 'N/A'}</Text>
            </View>
          </View>

          {/* TARGET VALUE */}
          <View style={styles.valueItem}>
            <Text style={styles.valueLabel}>TARGET VALUE</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{formatTargetValue(targetValue)}</Text>
            </View>
          </View>

          {/* TIMES REMAINING */}
          <View style={styles.valueItem}>
            <Text style={styles.valueLabel}>TIMES REMAINING</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueText}>{attemptsRemaining}</Text>
            </View>
          </View>
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#354B5E', // Dark Blue Background
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Inner Container for Content
  innerContainer: {
    backgroundColor: '#a0dcfc', // Light Blue Box
    padding: 20,
    borderRadius: 10, // Optional: Rounded corners for the box
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#782528',
  },
  explanation: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20, // Added for spacing
    color: '#782528',
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
