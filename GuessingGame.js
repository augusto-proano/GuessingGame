function generateWinningNumber(){
    return Math.floor(Math.random() * 100 + 1);
}

function shuffle(array) {
    var m = array.length 
    var t;
    var i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    console.log(this.winningNumber)
}

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num){
    if(num <= 0 || num > 100 || typeof num !== "number"){
        return "That is an invalid guess."
        // throw "That is an invalid guess."
    }
    this.playersGuess = num;

    return this.checkGuess();
}

Game.prototype.checkGuess = function(){  
    console.log(this.playersGuess)  
    if(this.playersGuess === this.winningNumber){
        $("#submit, #hint, #playerInput").prop("disabled", true);
        $("#subtitle").text("Press the Reset button to play again!");
        return "You Win!";
    } else if (this.pastGuesses.indexOf(this.playersGuess) >= 0){
        return "You have already guessed that number.";
    }  else {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
    }

    if(this.pastGuesses.length === 5){
        $("#submit, #hint, #playerInput").prop("disabled", true);
        $("#subtitle").text("Press the Reset button to play again!");
        return "You Lose :(";
    }

    if(this.isLower()){
        $("#subtitle").text("Guess Higher!")         
    } else {
        $("#subtitle").text("Guess Lower!")
    }
   
    if (this.difference() < 10) {
        return "You\'re burning up!";
    } else if (this.difference() < 25) {
        return "You\'re lukewarm.";
    } else if (this.difference() < 50) {
        return "You\'re a bit chilly.";
    } else if (this.difference() < 100) {
        return "You\'re ice cold!";
    }
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    newArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber(), generateWinningNumber()];

    return shuffle(newArr);
}

function makeGuess(game){
    let guess = $("#playerInput").val();
    $("#playerInput").val("");
    let output = game.playersGuessSubmission(parseInt(guess));
    console.log(output);
    $("#title").text(output);
}



$(document).ready(() => {
    let game = newGame();
    
    $("#submit").on("click", () => {
        makeGuess(game);
    })

    $("#playerInput").keypress((event) => {
        if(event.keyCode === 13){
            makeGuess(game);
        }
    })

    $("#reset").on("click", () => {
        game = newGame();
        $("#submit, #hint, #playerInput").prop("disabled", false);
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $(".guess").text("-")
    })

    $("#hint").on("click", () => {
        let hintArr  = game.provideHint();
        $("#subtitle").text("The Winner Number is: " + hintArr.slice(0, -1).join(", ") + " or " + hintArr[hintArr.length - 1]);
        $("#hint").prop("disabled", true);
    })
})
