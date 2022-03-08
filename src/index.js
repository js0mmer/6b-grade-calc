import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var YOUR = 'your'
var AVG = 'avg'

class QuizRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { score: '',
      averagePoints: this.props.averagePoints ? this.props.averagePoints : '',
      curveFactor: this.props.curveFactor ? this.props.curveFactor : 1 }
    this.handleChangeScore = this.handleChangeScore.bind(this);
    this.handleChangeAveragePoints = this.handleChangeAveragePoints.bind(this);
    this.handleChangeCurveFactor = this.handleChangeCurveFactor.bind(this);
  }

  handleChangeScore(e) {
    this.setState({ score: e.target.value });
    this.props.updateScore(this.props.number, e.target.value ? Math.floor(e.target.value / this.props.maxPoints * 100) : null, 100 - this.state.curveFactor * (100 - Math.floor(e.target.value / this.props.maxPoints * 100)), YOUR);
    this.props.updateScore(this.props.number, e.target.value ? Math.floor(this.state.averagePoints / this.props.maxPoints * 100) : null, 100 - this.state.curveFactor * (100 - Math.floor(this.state.averagePoints / this.props.maxPoints * 100)), AVG);
  }

  handleChangeAveragePoints(e) {
    this.setState({ averagePoints: e.target.value });
    this.props.updateScore(this.props.number, e.target.value ? Math.floor(e.target.value / this.props.maxPoints * 100) : null, 100 - this.state.curveFactor * (100 - Math.floor(e.target.value / this.props.maxPoints * 100)), AVG);
  }

  handleChangeCurveFactor(e) {
    this.setState({ curveFactor: e.target.value });
  }

  render() {
    return (
      <tr>
        <td>
          Quiz {this.props.number}
        </td>
        <td id={"quiz-" + this.props.number + "-score"}>
          <input type="number" step={0.01} min={0} max={this.props.maxPoints} value={this.state.score} onChange={this.handleChangeScore} />
        </td>
        <td>
          {this.props.maxPoints}
        </td>
        <td id={"quiz-" + this.props.number + "-percent"}>
          {Math.floor(this.state.score / this.props.maxPoints * 100)}%
        </td>
        <td>
          <input type="number" step={0.01} min={0} max={this.props.maxPoints} value={this.state.averagePoints} onChange={this.handleChangeAveragePoints} />
        </td>
        <td id={"quiz-" + this.props.number + "-avg-percent"}>
          {Math.floor(this.state.averagePoints / this.props.maxPoints * 100)}%
        </td>
        <td>
          <input type="number" step={0.1} min={0} max={1} value={this.state.curveFactor} onChange={this.handleChangeCurveFactor} />
        </td>
        <td id={"quiz-" + this.props.number + "-percent-curved"}>
          {100 - this.state.curveFactor * (100 - Math.floor(this.state.score / this.props.maxPoints * 100))}%
        </td>
        <td id={"quiz-" + this.props.number + "avg-percent-curved"}>
          {100 - this.state.curveFactor * (100 - Math.floor(this.state.averagePoints / this.props.maxPoints * 100))}%
        </td>
      </tr>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { yourPercentRaw: '', yourPercentCurved: '', avgPercentRaw: '', avgPercentCurved: '', scores: { [YOUR]: {}, [AVG]: {} } };

    this.updateScore = this.updateScore.bind(this);
  }

  updateScore(quiz, percent, curvedPercent, type) {
    if (percent == null) {
      delete this.state.scores[type][quiz];
    } else {
      this.state.scores[type][quiz] = { raw: parseInt(percent), curved: parseInt(curvedPercent) };
    }

    let totalRaw = 0;
    let totalCurved = 0;
    let numQuizzes = 0;

    for (let i = 0; i < 10; i++) {
      if (i in this.state.scores[type]) {
        totalRaw += this.state.scores[type][i]['raw'];
        totalCurved += this.state.scores[type][i]['curved'];
        numQuizzes += 1;
      }
    }

    this.setState({ [type + 'PercentRaw']: Math.floor(totalRaw / numQuizzes * 100) / 100 + '%' });
    this.setState({ [type + 'PercentCurved']: Math.floor(totalCurved / numQuizzes * 100) / 100 + '%' });
  }

  render() {
    return (
      <div className="App">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Your Score</th>
              <th>Max Points</th>
              <th>Your %</th>
              <th>Average Score</th>
              <th>Average %</th>
              <th>Curve Factor</th>
              <th>Your % Curved</th>
              <th>Avg % Curved</th>
            </tr>
          </thead>
          <tbody>
            <QuizRow updateScore={this.updateScore} number={1} maxPoints={19} averagePoints={15.02} curveFactor={1} />
            <QuizRow updateScore={this.updateScore} number={2} maxPoints={9} averagePoints={4.9} curveFactor={0.5} />
            <QuizRow updateScore={this.updateScore} number={3} maxPoints={7} averagePoints={3} curveFactor={0.4} />
            <QuizRow updateScore={this.updateScore} number={4} maxPoints={11} averagePoints={5.48} curveFactor={0.5} />
            <QuizRow updateScore={this.updateScore} number={5} maxPoints={11} averagePoints={8.4} />
            <QuizRow updateScore={this.updateScore} number={6} maxPoints={7} averagePoints={5.67} />
            <QuizRow updateScore={this.updateScore} number={7} maxPoints={6} averagePoints={4} curveFactor={0.75} />
            <QuizRow updateScore={this.updateScore} number={8} maxPoints={9} />
            <QuizRow updateScore={this.updateScore} number={9} maxPoints={13} />
            <QuizRow updateScore={this.updateScore} number={10} maxPoints={10} />
            <tr>
              <td>Total</td>
              <td></td>
              <td></td>
              <td>{this.state.yourPercentRaw}</td>
              <td></td>
              <td>{this.state.avgPercentRaw}</td>
              <td></td>
              <td>{this.state.yourPercentCurved}</td>
              <td>{this.state.avgPercentCurved}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
