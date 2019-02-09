import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import AddDeck from '../components/AddDeck';

class AddDeckView extends Component {
  static navigationOptions = ({ navigation }) => {
    const id = navigation.getParam('deckId');
    return {
      title: (id) ? 'Edit Deck' : 'Add Deck',
    };
  };
  static navigationOptions = {
    title: 'Add Deck',
  };

  render() {
    return (
      <View>
        <AddDeck navigation={this.props.navigation} />
      </View>
    );
  }
}

export default AddDeckView;
