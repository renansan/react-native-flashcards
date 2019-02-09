import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../utils/helpers';

class Loading extends Component {

  render() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    )
  }
}

/**
 * Style
 */
const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});


export default Loading;
