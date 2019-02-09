import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { fetchData, storeData } from '../utils/api';
import { colors } from '../utils/helpers';
import PropTypes from 'prop-types';

class AddDeck extends Component {
  state = {
    title: '',
    titleError: false,
  }

  onPress = (ev) => {
    const { title } = this.state;
    const id = this.props.navigation.getParam('deckId');

    if (title.length) {
      fetchData(data => {
        let newData = [];
        let newDeck = null;
        let key = id || '1';

        if (data) {
          prevData = JSON.parse(data);
          if (id) {
            newData = prevData.map(item => {
              if (item.id === id) {
                item.title = title;
              }
              return item;
            });
          } else {
            key = (newData.length + 1).toString();

            newDeck = {
              key,
              id: `deck-${key}`,
              title,
              cardsCount: 0,
              cards: [],
            }

            newData = prevData.concat(newDeck);
          }
        }

        debugger;

        storeData(newData, data => {
          this.props.navigation.navigate('Deck', {
            deckId: id || newDeck.id,
            deckTitle: title,
            cardsCount: 0,
          });
        });
      });
    } else {
      this.setState({
        titleError: true,
      });
    }
  }

  componentDidMount() {
    const id = this.props.navigation.getParam('deckId');
    const title = this.props.navigation.getParam('deckTitle');
    debugger;
    if (id && title) {
      this.setState({
        id,
        title,
      });
    }
  }

  render() {
    const { titleError } = this.state;
    const id = this.props.navigation.getParam('deckId');
    return (
      <View style={styles.formControl}>
        <Text style={styles.formLabel}>Type the title of the deck</Text>
        <TextInput
           style={styles.formInput}
           autoFocus={true}
           onChangeText={(title) => this.setState({title, titleError: false })}
           value={this.state.title}
         />
       {titleError && (
           <Text style={styles.formError}>This field is required</Text>
         )}
       <Button title={`${(id) ? 'Edit' : 'Add'}`} onPress={this.onPress}>
         <MaterialIcons name={'library-add'} size={24} color={colors.white} />
       </Button>
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

AddDeck.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddDeck;
