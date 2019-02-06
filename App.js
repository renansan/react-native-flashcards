import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, View, FlatList, Button, TouchableHighlight, StatusBar, TextInput } from 'react-native';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import Reactotron from 'reactotron-react-native';

const cons = Reactotron || console;

/**
 * Database
 */
const DECK_LIST = 'DECK_LIST';
const decklist = [
  {
    key: '1',
    id: 'deck-1',
    title: 'Deck 1',
    cardsCount: 3,
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
    cardsCount: 0,
    cards: [],
  },
]
const storeData = async (key, value, cb) => {
  try {
    await AsyncStorage.mergeItem(key, value);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
}
const fetchData = async (key, cb) => {
  let data = null;
  try {
    data = await AsyncStorage.getItem(key) || null;
  } catch (error) {
    console.log(error.message);
  }
  return data;
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
  state = {
    decklist: {},
    logStatus: 'beforeDidMount',
  }

  renderDeckItem = (item) => {
    return (
      <DeckItem id={item.id} title={item.title} cardsCount={item.cards.length} navigation={this.props.navigation} />
    )
  }

  componentDidMount () {
    // https://facebook.github.io/react-native/docs/asyncstorage#mergeitem
    AsyncStorage.getItem(DECK_LIST).then(data => {
      if (data) {
        this.setState({ decklist: JSON.parse(data) });
      } else {
        AsyncStorage.setItem(DECK_LIST, JSON.stringify(decklist)).then(data => {
          this.setState({ decklist: JSON.parse(data) });
        });
      }
    });
  }

  render() {
    return (
      <View>
        <Text>{JSON.stringify(this.state.logStatus)}</Text>
        <Text>{JSON.stringify(this.state.decklist)}</Text>
        <FlatList
          data={this.state.decklist}
          renderItem={({item}) => this.renderDeckItem(item)}
        />
      </View>
    )
  }
}

class Deck extends Component {
  state = {
    id: '',
    title: '',
    cardsCount: 0,
  }

  startQuiz = (ev) => {
    this.props.navigation.navigate('Quiz', {
      deckId: this.state.id,
    });
  }

  addCard = (ev) => {
    this.props.navigation.navigate('AddCard', {
      deckTitle: this.state.title,
    });
  }

  componentDidMount () {
    const id = this.props.navigation.getParam('deckId');
    const title = this.props.navigation.getParam('deckTitle');
    const cardsCount = this.props.navigation.getParam('cardsCount');
    this.setState({
      id,
      title,
      cardsCount,
    });
  }

  render() {
    return (
      <View>
        <View>
          <Text>{this.state.title}</Text>
          <Text>{this.state.cardsCount} cards</Text>
        </View>
        <View>
          <Button title={'Start Quiz!'} onPress={this.startQuiz} />
          <Button title={'Add Card!'} onPress={this.addCard} />
        </View>
      </View>
    )
  }
}

class Quiz extends Component {
  state = {
    hits: 0,
    cardActiveIndex: 0,
    isShowingQuestion: true,
    isResult: false,
  }

  userAnswer = (isAnswerCorrect) => {
    this.setState(prevState => {
      const isResult = (this.props.cards.length === (prevState.cardActiveIndex + 1)) ? true : false;
      // debugger;
      return {
        ...prevState,
        hits: prevState.hits + isAnswerCorrect,
        cardActiveIndex: prevState.cardActiveIndex + 1,
        isResult,
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

  render() {
    const { cardActiveIndex, hits, isShowingQuestion, isResult } = this.state;
    const { id, cards } = this.props;
    const currentQuestion = cards[cardActiveIndex];
    const title = currentQuestion ? ((isShowingQuestion) ? currentQuestion.question : currentQuestion.answer) : '';

    return (
      <View>
        {isResult ? (
          <View>
            <Text>
              Score: {`${hits} correct answers of ${cards.length}.`}
            </Text>
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
      if (data) {
        const prevData = JSON.parse(data);
        const key = prevData.length + 1;
        const { title} = this.state;
        const newDeck = {
          key,
          id: `deck-${key}`,
          title,
          cardsCount: 0,
          cards: [],
        }
        debugger;
        AsyncStorage.mergeItem(DECK_LIST, JSON.stringify([...newDeck])).then(data => {
          this.setState({ decklist: JSON.parse(data), logStatus: 'merging' + data });
        });
      } else {
        AsyncStorage.setItem(DECK_LIST, JSON.stringify([newDeck])).then(data => {
          this.setState({ decklist: JSON.parse(data), logStatus: 'setting' + data });
        });
      }
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
  render() {
    return (
      <View>
        <View>
          <Text>Question</Text>
          <TextInput
             style={{height: 40, borderColor: 'gray', borderWidth: 1}}
             onChangeText={(text) => 'this.setState({text})'}
             value={'this.state.text'}
           />
        </View>
        <View>
          <Text>Answer</Text>
          <TextInput
             style={{height: 40, borderColor: 'gray', borderWidth: 1}}
             onChangeText={(text) => 'this.setState({text})'}
             value={'this.state.text'}
           />
        </View>
        <View>
          <Button title="Submit" onPress={ev => {}} />
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
    const deck = decklist.filter(item => id === item.id)[0];

    return (
      <View>
        <Quiz id={id} cards={deck.cards} navigation={this.props.navigation} />
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

  static navigationOptions = ({ navigation }) => {
    deckTitle = navigation.getParam('deckTitle');
    return {
      title: `Add a new card to ${deckTitle}`,
    };
  };

  render() {
    return (
      <View>
        <AddCard navigation={this.props.navigation} />
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
