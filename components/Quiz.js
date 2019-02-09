import React, { Component } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { DECK_LIST } from '../utils/helpers';

class Quiz extends Component {
  state = {
    hits: 0,
    cards: [],
    cardActiveIndex: 0,
    isShowingQuestion: true,
    isResult: false,
  }

  userAnswer = (isAnswerCorrect) => {
    this.setState(prevState => {
      const isResult = (prevState.cards.length === (prevState.cardActiveIndex + 1)) ? true : false;
      return {
        ...prevState,
        hits: prevState.hits + isAnswerCorrect,
        cardActiveIndex: prevState.cardActiveIndex + 1,
        isResult,
        isShowingQuestion: true,
      }
    })
  }

  toggleQA = (ev) => {
    this.setState(prevState => {
      return {
        ...prevState,
        isShowingQuestion: !prevState.isShowingQuestion,
      }
    })
  }

  fecthCards = () => {
    AsyncStorage.getItem(DECK_LIST).then(data => {
      const { id } = this.props;
      const cards = JSON.parse(data).filter(item => item.id === id)[0].cards;
      this.setState({ cards });
    });
  }

  restartQuiz = () => {
    this.setState({
      hits: 0,
      cardActiveIndex: 0,
      isShowingQuestion: true,
      isResult: false,
    });
  }

  componentDidMount() {
    this.fecthCards()
  }

  render() {
    const { cardActiveIndex, hits, isShowingQuestion, isResult, cards } = this.state;
    const { id } = this.props;
    const currentQuestion = cards[cardActiveIndex];
    const title = currentQuestion ? ((isShowingQuestion) ? currentQuestion.question : currentQuestion.answer) : '';

    return (
      <View>
        {isResult ? (
          <View>
            <Text>
              Score: {`${hits} correct answers of ${cards.length} questions.`}
            </Text>
            <Button title={'Restart Quiz'} onPress={ev => this.restartQuiz()} />
            <Button title={'Back to Deck'} onPress={ev => this.props.navigation.goBack()} />
          </View>
        ) : (
          <View>
            <View>
              <Text>{`${cardActiveIndex + 1}/${cards.length}`}</Text>
            </View>
            <View>
              <Text>{title}</Text>
              <TouchableHighlight onPress={this.toggleQA}>
                <Text>Show {isShowingQuestion ? 'answer' : 'question'}</Text>
              </TouchableHighlight>
            </View>
            <View>
              <Button title={'Correct'} onPress={ev => this.userAnswer(1)} />
              <Button title={'Incorrect'} onPress={ev => this.userAnswer(0)} />
            </View>
          </View>
        )}
      </View>
    )
  }
}

export default Quiz;
