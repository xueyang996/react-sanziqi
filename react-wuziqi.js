// Reference http://qiita.com/suhirotaka/items/0319dce09cb808dc6393

function Square(props) {
  if (props.highlight) {
    return (
      <button className="square" onClick={() => props.onClick()} style={{color: "red"}}> 
        {props.value}
      </button>
    );
  }else {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} highlight={this.props.winnerLine.includes(i)}/>;
  }
  render() {
    var rows = [];
    for (var i=0; i<3 ; i++){
      var row = [];
      for (var j=3*i; j<3*i+3;j++){
        row.push(this.renderSquare(j));
      }
      rows.push(<div className="board=row" key={i}>{row}</div>)
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastStep: 'Game start',
      }],
      xIsNext: true,
      stepNumber: 0,
      sort: false,
    };
  }
  handleClick(i) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const location = '('+ (Math.floor(i / 3)+1) + ',' + ((i % 3)+1) + ')';
    const desc = squares[i] + ' moved to ' + location;
    this.setState({
      history: history.concat([{
        squares: squares,
        lastStep: desc,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }
  jumpTo(step) {
  this.setState({
    stepNumber: step,
    xIsNext: (step % 2) ? false : true,
  });
}
  toggleSort() {
    this.setState({
      sort:!this.state.sort,
    })
  }
  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const winnerLine = calculateWinner(current.squares).line;

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    if (this.state.sort){
      history = this.state.history.slice();
      history.reverse();
      }
    const moves = history.map((step,move) => {
     const desc = step.lastStep;
      if (move == this.state.stepNumber) {
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}><strong>{desc}</strong></a>
         </li>
        );
      }
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
         </li>
      );
    });
    
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winnerLine={winnerLine}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>Sort</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner:squares[a], line:[a, b, c]};
    }
  }
  return {winner:null, line:[]};
}