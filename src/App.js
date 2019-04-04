import React, { Component } from "react";
import {
  Message,
  Input,
  Transition,
  Statistic,
  Button,
  Segment
} from "semantic-ui-react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.myref = React.createRef();
  }
  state = {
    temp: "",
    text: "",
    negative: false,
    color: "grey",
    visible: true,
    Timer: "",
    disabled: true,
    clock: 0,
    end: false
  };

  componentWillMount() {
    const word =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eu odio vitae elit pretium mattis.";
    this.setState({ temp: word });
  }


  // the input as changed
  onChange = event => {
    var txt = event.target.value.trim();

    this.setState({
      text: txt
    });
  };


  // when a state update
  componentDidUpdate(prevProps, prevState) {
    const { text, temp } = this.state;

    var tmp = temp;
    var wordtmp = temp.trim().split(" ");

    const current = wordtmp[0];

    // if text in input is different than the last text input
    if (text !== prevState.text) {
      var regex = new RegExp("^\\s*(" + text + ")", "g");
      var letter = text.length - 1;

      // check if the letter from the current word is equal to the current letter of the text input
      if (current[letter] === text[letter] && text !== "") {
        if (temp.trim().match(regex)) {

          this.setState({ negative: false, color: "grey" });

          // set the correct letter in green on the screen 
          tmp = tmp.replace(
            regex,
            '<span style="color: white; background-color: green;">' +
              tmp.trim().match(regex) +
              "</span>"
          );

          this.myref.current.innerHTML = tmp;

          // check if the current word match exactly the current text
          // then delete this word from the pool and clear the input
          if (wordtmp[0] === temp.trim().match(regex)[0]) {
            tmp = temp;
            tmp = tmp.replace(regex, "");
            this.myref.current.innerHTML = tmp;

            this.NextWord(regex);
          }
        }
      } else {
        // If the input is empty, clear green letter
        if (text === "") {
          this.myref.current.innerHTML = tmp;
        }

        // if there's an error / if the letter doesn't match
        if (current[letter] !== text[letter]) {
          this.setState({
            negative: true,
            color: "red",
            visible: !this.state.visible
          });

          this.myref.current.innerHTML = tmp;
        }
      }

      // check if the pool is empty
      // stop the timer
      if (temp === "") {
        this.setState({ end: true });
      }
    }
  }



  // Timer in seconds and milliseconds
  startTimer = () => {
    this.setState({ disabled: false });

    // setInterval in ms
    var x = setInterval(
      function() {
        var ms = this.state.clock % 60;

        var seconds = parseInt(this.state.clock / 60);

        var txt = seconds + " s " + ms + " ms ";

        // if the pool is empty, stop the timer
        if (this.state.end) {
          clearInterval(x);
        }

        this.setState({ Timer: txt, clock: this.state.clock + 1 });
      }.bind(this),
      100
    );
  };

  // delete correct word from the pool
  NextWord = a => {
    const { temp } = this.state;

    var tmp = temp;
    tmp = tmp.replace(a, "");

    this.setState({ text: "", temp: tmp });
  };

  render() {
    const {
      text,
      temp,
      negative,
      color,
      visible,
      Timer,
      disabled,
      end
    } = this.state;

    return (
      <div className="App">
        <Transition animation="shake" duration="300" visible={visible}>
          <Message size="massive" negative={negative} color={color}>
            <div className="Liste" ref={this.myref}>
              {temp}
            </div>
          </Message>
        </Transition>
        <Segment>
          <div className="type_input">
            <Input
              name="text"
              value={text}
              onChange={this.onChange}
              type="text"
              placeholder="Taper votre texte"
              disabled={disabled}
            />
          </div>
          <Transition animation="tada" duration="500" visible={!end}>
            <Statistic>
              <Statistic.Value>{Timer}</Statistic.Value>
              <Statistic.Label>Temps</Statistic.Label>
            </Statistic>
          </Transition>
        </Segment>
        <Button onClick={this.startTimer} disabled={!disabled}>
          Commencer
        </Button>
      </div>
    );
  }
}

export default App;
