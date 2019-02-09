import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { DECK_LIST } from '../utils/helpers';

class AddCard extends Component {
  state = {
    question: '',
    answer: '',
  }

  onPress = (ev) => {
    AsyncStorage.getItem(DECK_LIST).then(data => {
      if (data) {
        const { question, answer } = this.state;
        const { id } = this.props;
        const prevData = JSON.parse(data);
        const newData = prevData.map(item => {
          if (item.id === id) {
            item.cards.push({
              question,
              answer,
            });
          }

          return item;
        });

        AsyncStorage.setItem(DECK_LIST, JSON.stringify(newData)).then(error => {
          AsyncStorage.getItem(DECK_LIST).then(data => {
            this.props.navigation.goBack();
          });
        });
      } else {
        // Has no data on AsyncStorage
      }
    });
  }

  render() {
    return (
      <View>
        <View>
          <Text>Question</Text>
          <TextInput
             style={{height: 40, borderColor: 'gray', borderWidth: 1}}
             onChangeText={(question) => this.setState({question})}
             value={this.state.question}
           />
        </View>
        <View>
          <Text>Answer</Text>
          <TextInput
             style={{height: 40, borderColor: 'gray', borderWidth: 1}}
             onChangeText={(answer) => this.setState({answer})}
             value={this.state.answer}
           />
        </View>
        <View>
          <Button title="Submit" onPress={this.onPress} />
        </View>
      </View>
    )
  }
}

export default AddCard;
