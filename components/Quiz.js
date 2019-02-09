import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Button, ButtonDanger, ButtonSuccess } from '../components/Button';
import { fetchData, storeData } from '../utils/api';
import { colors } from '../utils/helpers';

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
    fetchData(data => {
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
      <View style={styles.quiz}>
        {isResult ? (
          <View>
            <View style={styles.quizBox}>
              <Text>
                Score
              </Text>
              <View style={styles.quizResult}>
                <Text style={styles.quizResultHits}>Hits</Text>
                <Text style={styles.quizResultBox}>
                  <Text style={[styles.quizResultHighlight, styles.quizResultHits]}>{hits}</Text>
                  <Text>{` / ${cards.length}`}</Text>
                </Text>
              </View>
              <View style={styles.quizResult}>
                <Text style={styles.quizResultMisses}>Misses</Text>
                <Text style={styles.quizResultBox}>
                  <Text style={[styles.quizResultHighlight, styles.quizResultMisses]}>{cards.length - hits}</Text>
                  <Text>{` / ${cards.length}`}</Text>
                </Text>
              </View>
            </View>
            <View style={styles.quizButtons}>
              <Button title={'Restart Quiz'} onPress={ev => this.restartQuiz()} />
              <Button title={'Back to Deck'} onPress={ev => this.props.navigation.goBack()} />
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.quizBox}>
              <View style={styles.quizCount}>
                <Text>{`${cardActiveIndex + 1}/${cards.length}`}</Text>
              </View>
              <View>
                <Text style={styles.quizTitle}>{title}</Text>
                <TouchableHighlight style={styles.quizLinkContainer} onPress={this.toggleQA}>
                  <Text style={styles.quizLink}>Show {isShowingQuestion ? 'answer' : 'question'}</Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.quizButtons}>
              <ButtonSuccess title={'Correct'} onPress={ev => this.userAnswer(1)} />
              <ButtonDanger title={'Incorrect'} onPress={ev => this.userAnswer(0)} />
            </View>
          </View>
        )}
      </View>
    )
  }
}

/**
 * Style
 */
const styles = StyleSheet.create({
  quiz: {
    marginHorizontal: 10,
  },
  quizBox: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  quizButtons: {
    marginVertical: 20,
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  quizLinkContainer: {
    alignItems: 'center',
  },
  quizLink: {
    color: colors.blue,
    textDecorationLine: "underline",
    fontSize: 16,
    marginVertical: 10,
  },
  quizCount: {
    marginVertical: 10,
  },
  quizResult: {
    marginVertical: 15,
  },
  quizResultBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  quizResultHighlight: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  quizResultHits: {
    color: colors.green,
    fontWeight: 'bold',
  },
  quizResultMisses: {
    color: colors.red,
    fontWeight: 'bold',
  },
});

export default Quiz;
