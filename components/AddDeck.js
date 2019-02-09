import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { DECK_LIST } from '../utils/helpers';

class AddDeck extends Component {
  state = {
    title: '',
  } 

  onPress = (ev) => {
    AsyncStorage.getItem(DECK_LIST).then(data => {
      const { title } = this.state;
      let newData = [];
      let newDeck = null;
      let key = '1';

      if (data) {
        newData = JSON.parse(data);
        key = (newData.length + 1).toString();
      }

      newDeck = {
        key,
        id: `deck-${key}`,
        title,
        cardsCount: 0,
        cards: [],
      }
      newData = newData.concat(newDeck);

      AsyncStorage.setItem(DECK_LIST, JSON.stringify(newData)).then(error => {
        AsyncStorage.getItem(DECK_LIST).then(data => {
          this.props.navigation.navigate('Deck', {
            deckId: newDeck.id,
            deckTitle: newDeck.title,
            cardsCount: 0,
          });
        });
      });
    });
  }

  render() {
    return (
      <View>
        <Text>Type the title of the new deck</Text>
        <TextInput
           style={{height: 40, borderColor: 'gray', borderWidth: 1}}
           onChangeText={(title) => this.setState({title})}
           value={this.state.title}
         />
       <Button title="Submit" onPress={this.onPress} />
      </View>
    )
  }
}

export default AddDeck;
