import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

/**
 * DeckItem
 */
class DeckItem extends Component {
  onPress = (ev) => {
    this.props.navigation.navigate('Deck', {
      deckId: this.props.id,
      deckTitle: this.props.title,
      cardsCount: this.props.cardsCount,
    });
  }

  render() {
    return (
      <TouchableHighlight onPress={this.onPress}>
        <View>
          <Text>{this.props.title}</Text>
          <Text>{this.props.cardsCount}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

export default DeckItem;
