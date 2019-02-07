import React, { Component } from 'react';
import { Animated, AsyncStorage, StyleSheet, Text, View, FlatList, Button, TouchableHighlight, StatusBar, TextInput } from 'react-native';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
// import Reactotron from 'reactotron-react-native';

const cons = console // || Reactotron;

/**
 * Database
 */
const DECK_LIST = 'DECK_LIST';
const decklist = [
  {
    key: '1',
    id: 'deck-1',
    title: 'Deck 1',
    cards: [
      {
        question: 'What is React?',
        answer: 'A library for managing user interfaces',
      },
      {
        question: 'Where do you make Ajax requests in React?',
        answer: 'The componentDidMount lifecycle event',
      },
      {
        question: 'Where do you make Ajax requests in React?',
        answer: 'The componentDidMount lifecycle event',
      }
    ]
  },
  {
    key: '2',
    id: 'deck-2',
    title: 'Deck 2',
    cards: [],
  },
]
const storeData = (key, value, callback = function () {}) => {
  AsyncStorage.setItem(key, JSON.stringify(value)).then(error => {
    AsyncStorage.getItem(key).then(data => callback());
  });
}
const fetchData = (key, callback = function () {}) => {
  AsyncStorage.getItem(key).then(data => callback());
}

/**
 * Components
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

class DeckList extends Component {
  constructor(props) {
    super(props);

    // https://github.com/react-navigation/react-navigation/issues/922#issuecomment-437782511
    this.updateRenderAfterNavigation = this.props.navigation.addListener('willFocus', () => {
      this.fetchData()
    });
  }

  componentWillUnmount() {
    this.updateRenderAfterNavigation
  }

  state = {
    decklist: {},
    logStatus: 'beforeDidMount',
  }

  renderDeckItem = (item) => {
    return (
      <DeckItem id={item.id} title={item.title} cardsCount={item.cards.length} navigation={this.props.navigation} />
    )
  }

  fetchData = () => {
    AsyncStorage.getItem(DECK_LIST).then(data => {
      if (data) {
        this.setState({ logStatus: 'hasData', decklist: JSON.parse(data) });
      } else {
        AsyncStorage.setItem(DECK_LIST, JSON.stringify(decklist)).then(data => {
          AsyncStorage.getItem(DECK_LIST).then(data => {
            this.setState({ logStatus: 'hasNoData', decklist: JSON.parse(data) });
          });
        });
      }
    });
  }

  componentDidMount () {
    this.fetchData();
  }

  render() {
    return (
      <View>
        {/*<Text>{JSON.stringify(this.state.logStatus)}</Text>
        <Text>{JSON.stringify(this.state.decklist)}</Text>*/}
        <FlatList
          data={this.state.decklist}
          renderItem={({item}) => this.renderDeckItem(item)}
        />
      </View>
    )
  }
}

class Deck extends Component {
  constructor(props) {
    super(props);

    // https://github.com/react-navigation/react-navigation/issues/922#issuecomment-437782511
    this.updateRenderAfterNavigation = this.props.navigation.addListener('willFocus', () => {
      this.fetchCardsCount()
    });
  }

  componentWillUnmount() {
    this.updateRenderAfterNavigation;
  }

  state = {
    id: '',
    title: '',
    cardsCount: 0,
    bounceValue: new Animated.Value(1),
  }

  startQuiz = (ev) => {
    this.props.navigation.navigate('Quiz', {
      deckId: this.state.id,
    });
  }

  addCard = (ev) => {
    this.props.navigation.navigate('AddCard', {
      deckId: this.state.id,
      deckTitle: this.state.title,
    });
  }

  fetchCardsCount = () => {
    AsyncStorage.getItem(DECK_LIST).then(data => {
      const id = this.props.navigation.getParam('deckId');
      const cardsCount = JSON.parse(data).filter(item => item.id === id)[0].cards.length;
      this.setState({ cardsCount });
    });
  }

  componentDidMount () {
    const { bounceValue} = this.state;
    const id = this.props.navigation.getParam('deckId');
    const title = this.props.navigation.getParam('deckTitle');
    this.fetchCardsCount();
    this.setState({
      id,
      title,
    });

    Animated.sequence([
      Animated.timing(bounceValue, { duration: 300, toValue: 1.2}),
      Animated.spring(bounceValue, { toValue: 1, friction: 8})
    ]).start()
  }

  render() {
    const { title, cardsCount } = this.state;
    const hasCards = cardsCount ? true : false;
    const { bounceValue} = this.state;
    return (
      <View>
        <Animated.View style={[{transform: [{scale: bounceValue}]}]}>
          <Text>{title}</Text>
          <Text>{cardsCount} cards</Text>
        </Animated.View>
        <View>
          <Button disabled={!hasCards} title={'Start Quiz!'} onPress={this.startQuiz} />
          <Button title={'Add Card!'} onPress={this.addCard} />
        </View>
      </View>
    )
  }
}

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

class AddDeck extends Component {
  state = {
    title: '',
    logStatus: 'beforeSubmit',
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
        <Text>{this.state.logStatus}</Text>
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
        <View>
          {/* <FormLabel>Name</FormLabel> <FormInput onChangeText={someFunction}/> <FormValidationMessage>{'This field is required'}</FormValidationMessage> */}
        </View>
      </View>
    )
  }
}

/**
 * Views
 */
class HomeView extends Component {

  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <View>
        <StatusBar
          barStyle="light-content"
          backgroundColor="orange"
        />
        <DeckList decklist={decklist} navigation={this.props.navigation} />
        <Button title="Add Deck" onPress={ev => this.props.navigation.navigate('AddDeck')} />
      </View>
    );
  }
}

class DeckView extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('deckTitle'),
    };
  };

  render() {
    return (
      <View>
        <Deck navigation={this.props.navigation} />
      </View>
    );
  }
}

class QuizView extends Component {
  static navigationOptions = {
    title: 'Quiz',
  };

  render() {
    const id = this.props.navigation.getParam('deckId');

    return (
      <View>
        <Quiz id={id} navigation={this.props.navigation} />
      </View>
    );
  }
}

class AddDeckView extends Component {
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

class AddCardView extends Component {
  state = {
    id: '',
  }

  static navigationOptions = ({ navigation }) => {
    deckTitle = navigation.getParam('deckTitle');
    return {
      title: `Add a new card to ${deckTitle}`,
    };
  };

  componentDidMount() {
    const id = this.props.navigation.getParam('deckId');
    this.setState({ id });
  }

  render() {
    return (
      <View>
        <AddCard id={this.state.id} navigation={this.props.navigation} />
      </View>
    );
  }
}

/**
 * Navigator
 * @link https://reactnavigation.org/docs/en/navigation-options-resolution.html
 */
const Stack = {
  Home: {screen: HomeView},
  Deck: {screen: DeckView},
  Quiz: {screen: QuizView},
  AddDeck: {screen: AddDeckView},
  AddCard: {screen: AddCardView},
};

const HeaderNavigator = createStackNavigator(Stack);

const StackNav = {
  Home: {screen: HeaderNavigator},
  Deck: {screen: DeckView},
  Quiz: {screen: QuizView},
  AddDeck: {screen: AddDeckView},
  AddCard: {screen: AddCardView},
};

const BottomNavigator = createBottomTabNavigator(Stack);

const MainNavigator = createDrawerNavigator({
  ...Stack,
  Home: {screen: HeaderNavigator},
}, {
  initialRouteName: "Home",
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

/**
 * Navigator
 * @link https://review.udacity.com/#!/rubrics/1215/view
 */
const App = createAppContainer(MainNavigator);

/**
 * Style
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
