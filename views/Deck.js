import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Deck from '../components/Deck';

class DeckView extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('deckTitle'),
    };
  };

  render() {
    return (
      <View>
        <Deck navigation={this.props.navigation} />
      </View>
    );
  }
}

export default DeckView;
