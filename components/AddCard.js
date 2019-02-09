import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { DECK_LIST, colors } from '../utils/helpers';
import { fetchData, storeData } from '../utils/api';
import PropTypes from 'prop-types';

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

      fetchData(data => {
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

          storeData(newData, (data) => {
            this.props.navigation.goBack()
          })
        } else {
          // Has no data on storage
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
          <Button title={'Add'} onPress={this.onPress}>
            <MaterialIcons name={'playlist-add'} size={24} color={colors.white} />
          </Button>
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

AddCard.propTypes = {
  id: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default AddCard;
