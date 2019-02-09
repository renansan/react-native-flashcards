import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, TextInput } from 'react-native';
import { Button } from '../components/Button';
import { DECK_LIST, colors } from '../utils/helpers';

class AddCard extends Component {
  state = {
    question: '',
    answer: '',
    questionError: false,
    answerError: false,
  }

  onPress = (ev) => {
    const { question, answer } = this.state;
    if (question.length && answer.length) {
      AsyncStorage.getItem(DECK_LIST).then(data => {
        if (data) {
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
    } else {
      if (!question.length) {
        this.setState({
          questionError: true,
        });
      }
      if (!answer.length) {
        this.setState({
          answerError: true,
        });
      }
    }
  }

  render() {
    const { questionError, answerError } = this.state;
    return (
      <View>
        <View style={styles.formControl}>
          <Text style={styles.formLabel}>Type a Question</Text>
          <TextInput
             style={styles.formInput}
             autoFocus={true}
             onChangeText={(question) => this.setState({question})}
             value={this.state.question}
           />
         {questionError && (
           <Text style={styles.formError}>This field is required</Text>
         )}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.formLabel}>Type the Answer</Text>
          <TextInput
             style={styles.formInput}
             onChangeText={(answer) => this.setState({answer})}
             value={this.state.answer}
           />
         {answerError && (
           <Text style={styles.formError}>This field is required</Text>
         )}
        </View>
        <View>
          <Button title="Submit" onPress={this.onPress} />
        </View>
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

export default AddCard;
