import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import { colors } from '../utils/helpers';

class Button extends Component {

  render() {
    const { title, onPress } = this.props;
    return (
      <TouchableHighlight
        style={styles.button}
        onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableHighlight>
    )
  }
}

class ButtonDanger extends Component {

  render() {
    const { title, onPress } = this.props;
    return (
      <TouchableHighlight
        style={styles.buttonDanger}
        onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableHighlight>
    )
  }
}

class ButtonSuccess extends Component {

  render() {
    const { title, onPress } = this.props;
    return (
      <TouchableHighlight
        style={styles.buttonSuccess}
        onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableHighlight>
    )
  }
}

/**
 * Style
 */
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: colors.blue,
  },
  buttonDanger: {
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: colors.red,
  },
  buttonSuccess: {
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: colors.green,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 15,
  },
});

export { Button, ButtonDanger, ButtonSuccess };
