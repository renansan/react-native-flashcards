import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Quiz from '../components/Quiz';

class QuizView extends Component {
  static navigationOptions = {
    title: 'Quiz',
  };

  render() {
    const id = this.props.navigation.getParam('deckId');

    return (
      <View>
        <Quiz id={id} navigation={this.props.navigation} />
      </View>
    );
  }
}

export default QuizView;
