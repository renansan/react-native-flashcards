import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, TextInput } from 'react-native';
import { Button } from '../components/Button';
import { DECK_LIST, colors } from '../utils/helpers';

class AddDeck extends Component {
  state = {
    title: '',
    titleError: false,
  }

  onPress = (ev) => {
    const { title } = this.state;
    if (title.length) {
      AsyncStorage.getItem(DECK_LIST).then(data => {
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
    } else {
      this.setState({
        titleError: true,
      });
    }
  }

  render() {
    const { titleError } = this.state;
    return (
      <View style={styles.formControl}>
        <Text style={styles.formLabel}>Type the title of the new deck</Text>
        <TextInput
           style={styles.formInput}
           autoFocus={true}
           onChangeText={(title) => this.setState({title})}
           value={this.state.title}
         />
       {titleError && (
           <Text style={styles.formError}>This field is required</Text>
         )}
       <Button title="Submit" onPress={this.onPress} />
      </View>
    )
  }
}

/**
 * Style
 */
const styles = StyleSheet.create({
  formControl: {
    padding: 20,
  },
  formLabel: {
    fontSize: 16,
  },
  formInput: {
    height: 40,
  },
  formError: {
    color: colors.red,
    fontSize: 14,
  }
});

export default AddDeck;
