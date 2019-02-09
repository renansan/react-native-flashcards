import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { colors } from '../utils/helpers';
import PropTypes from 'prop-types';

class Button extends Component {

  onButtonPress = (ev) => {
    const {onPress, disabled} = this.props;
    if (!disabled && onPress) onPress(ev);
  }

  render() {
    const { title, onPress, styleType, disabled, children } = this.props;
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
        <View style={styles.buttonBox}>
          {children}
          <Text style={styles.buttonText}>
            {title}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

/**
 * Style
 */
const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
    backgroundColor: colors.blue,
  },
  buttonBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
    marginHorizontal: 5,
  },
});

Button.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.func,
  styleType: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};

export { Button };
