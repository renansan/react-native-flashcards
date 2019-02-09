import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import { colors } from '../utils/helpers';
import PropTypes from 'prop-types';

class Button extends Component {

  onButtonPress = (ev) => {
    const {onPress, disabled} = this.props;
    if (!disabled && onPress) onPress(ev);
  }

  render() {
    const { title, onPress, styleType, disabled } = this.props;
    const underlayColor =
      disabled ?
      colors.gray :
      colors.state[`${styleType}Active`] || colors.state['primaryActive'];
    const buttonStyle = [styles.button];
    if (styleType && styles[styleType]) buttonStyle.push(styles[styleType]);
    if (disabled) buttonStyle.push(styles['disabled']);

    return (
      <TouchableHighlight
        style={buttonStyle}
        underlayColor={underlayColor}
        onPress={this.onButtonPress}>
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
  danger: {
    backgroundColor: colors.red,
  },
  success: {
    backgroundColor: colors.green,
  },
  disabled: {
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 15,
  },
});

Button.propTypes = {
  title: PropTypes.string.isRequired,
  styleType: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};

export { Button };
