import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [input, setInput] = useState('');
  const [targetValue, setTargetValue] = useState(0);
  const [generatedExpression, setGeneratedExpression] = useState('');
  const [userValue, setUserValue] = useState(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  // Initializes the game on component mount.
  useEffect(() => {
    startNewGame();
  }, []);

  // Starts a new game round: resets the game state and generates new numbers, restart the attempt to 3.
  const startNewGame = () => {
    generateRandomNumbers();
    setInput('');
    setUserValue(null);
    setAttemptsRemaining(3);
  };

  // Generates four unique random numbers and a corresponding expression with a target value.
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

  // Helper function to create the expression string from the given numbers and random operations.
  const generateRandomExpression = (numbers) => {
    const operations = ['+', '-', '*', '/'];
    let expression = numbers[0].value.toString();

    for (let i = 1; i < numbers.length; i++) {
      const randomOperation = operations[Math.floor(Math.random() * operations.length)];
      expression += randomOperation + numbers[i].value.toString();
    }

    return expression;
  };

  // Appends the pressed number to the current input and disables the number button.
  const handleNumberPress = (number) => {
    setInput(input + number.value);
    setNumbers(numbers.map((num) =>
      num.value === number.value ? { ...num, disabled: true } : num
    ));
  };

  // Appends the pressed operator to the current input.
  const handleOperationPress = (operation) => {
    setInput(input + operation);
  };

  // Resets the game to a new round.
  const handleResetPress = () => {
    startNewGame();
    handleRetryPress();
  };

  // Clears the input field and re-enables all number buttons.
  const handleRetryPress = () => {
    setInput('');
    setNumbers(numbers.map((num) => ({ ...num, disabled: false })));
  };

  // Evaluates the user's input and checks if it matches the target value.
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

  // Formats the target value for display (rounds to two decimals if needed).
  const formatTargetValue = (value) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(2).toString();
  };


  // Value Item Component
  const ValueItem = ({ label, value }) => (
    <View style={styles.valueItem}>
      <Text style={styles.valueLabel}>{label}</Text>
      <View style={styles.valueBox}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    </View>
  );

  // Number Button Component
  const NumberButton = ({ number, onPress }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
      setIsPressed(true);
      onPress(number);
    };

    const handlePressOut = () => {
      setIsPressed(false);
    };

    return (
      <TouchableOpacity
        style={[
          styles.button,
          isPressed ? styles.pressedNumberButton : styles.numberButton, // Conditional styling
          number.disabled ? styles.disabledButton : null, // Keep disabled styling
        ]}
        onPressIn={handlePressIn} // Use onPressIn and onPressOut for styling
        onPressOut={handlePressOut}
        disabled={number.disabled}
      >
        <Text style={styles.buttonText}>{number.value}</Text>
      </TouchableOpacity>
    );
  };

  // Operator Button Component
  const OperatorButton = ({ operator, onPress }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => {
      setIsPressed(true);
      onPress(operator);
      // Immediately reset the pressed state:
      setTimeout(() => setIsPressed(false), 100);
    };

    return (
      <TouchableOpacity
        style={[
          styles.button,
          isPressed ? styles.pressedOperatorButton : styles.operatorButton,
        ]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{operator}</Text>
      </TouchableOpacity>
    );
  };

  // State to control Check button color
  const [isCheckButtonEnabled, setIsCheckButtonEnabled] = useState(false);

  useEffect(() => {
    // Check button enabled if there is input
    setIsCheckButtonEnabled(input.trim().length > 0);
  }, [input]); // Update when input changes

  // Main render function: returns the UI elements of the game
  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>EXPRESSION BUILDING</Text>
        <Text style={styles.explanation}>In this game, you will create an expression that gives the target value.</Text>

        {/* Value Section */}
        <View style={styles.valueSection}>
          <ValueItem label="YOUR VALUE" value={userValue !== null ? <Text style={styles.valueText}>{formatTargetValue(userValue)}</Text> : 'N/A'} />
          <ValueItem label="TARGET VALUE" value={<Text style={styles.valueText}>{formatTargetValue(targetValue)}</Text>} />
          <ValueItem label="TIMES" value={<Text style={styles.valueText}>{attemptsRemaining}</Text>} />
        </View>

        {/* Expression Input Box */}
        <View style={styles.inputBox}>
          <Text style={[styles.inputText, styles.alignRight]}>{input}</Text>
        </View>

        {/* Number and Operation Buttons (Original Structure, Modified Layout, Smaller Width, Updated Colors) */}
        <View style={[styles.buttonContainer, styles.smallerWidth]}>
          <View style={styles.buttonRow}>
            {numbers.slice(0, 2).map((number, index) => (
              <NumberButton key={index} number={number} onPress={handleNumberPress} />
            ))}
            {['+', '-'].map((operator, index) => (
              <OperatorButton key={index + 4} operator={operator} onPress={handleOperationPress} />
            ))}
          </View>

          <View style={styles.buttonRow}>
            {numbers.slice(2, 4).map((number, index) => (
              <NumberButton key={index + 2} number={number} onPress={handleNumberPress} />
            ))}
            {['*', '/'].map((operator, index) => (
              <OperatorButton key={index + 6} operator={operator} onPress={handleOperationPress} />
            ))}
          </View>
        </View>

        {/* Reset and Check Buttons*/}
        <View style={[styles.buttonGroup, { alignSelf: 'center' }]}>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetPress}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          {/* Check button */}
          <TouchableOpacity
            style={[
              styles.checkButton,
              styles.smallerButton,
              isCheckButtonEnabled ? {} : styles.disabledButton, // Apply disabled style if not enabled
            ]}
            onPress={handleCheckPress}
            disabled={!isCheckButtonEnabled} // Disable button when no input
          >
            <Text style={styles.checkButtonText}>Check</Text>
          </TouchableOpacity>
        </View>

        {/* Generate Expression to test */}
        <Text style={styles.generatedExpression}>Generated Expression: {generatedExpression}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#354B5E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Inner Container for Content
  innerContainer: {
    backgroundColor: '#a0dcfc',
    padding: 20,
    borderRadius: 10,
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
    marginBottom: 20,
    color: '#782528',
  },
  valueSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  valueItem: {
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  valueBox: {
    backgroundColor: '#c0b4b4',
    padding: 10,
    borderRadius: 5,
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#782528',
  },
  inputBox: {
    backgroundColor: '#c0b4b4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center',
    width: 220,
  },
  inputText: {
    fontSize: 18,
    textAlign: 'right',
    color: '#983444',
  },
  alignRight: {
    textAlign: 'right',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 5,
    margin: 5,
  },
  numberButton: {
    backgroundColor: '#983444',
  },
  operatorButton: {
    backgroundColor: '#983444',
  },
  pressedOperatorButton: {
    backgroundColor: '#707c8c',
  },
  pressedNumberButton: {
    backgroundColor: '#707c8c',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  smallerWidth: {
    width: '80%',
    alignSelf: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#983444',
    padding: 10,
    borderRadius: 5,
    width: 80,
    height: 40,
    marginRight: 20,
  },
  checkButton: {
    backgroundColor: '#983444',
    padding: 10,
    borderRadius: 5,
    width: 80,
    height: 40,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  generatedExpression: {
    fontSize: 12,
    color: '#782528',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default App;
