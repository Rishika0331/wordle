var height = 6; // Number of guesses
var width = 5;  // Word length

var row = 0; 
var col = 0; 
var gameOver = false;
var word = "";

// Select a random word
window.onload = function() {
    if (wordList.length === 0) {
        console.error("Error: wordList is empty or not loaded.");
        return;
    }
    
    word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    console.log("Selected word:", word);
    initialize();
}

function initialize() {
    // Create game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r + "-" + c;
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Create keyboard
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ];

    for (let i = 0; i < keyboard.length; i++) {
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < keyboard[i].length; j++) {
            let key = keyboard[i][j];
            let keyTile = document.createElement("div");
            keyTile.innerText = key;
            keyTile.id = key === "Enter" ? "Enter" : key === "⌫" ? "Backspace" : "Key" + key;
            keyTile.addEventListener("click", processKey);

            keyTile.classList.add(key === "Enter" ? "enter-key-tile" : "key-tile");
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }

    document.addEventListener("keyup", processInput);
}

function processKey() {
    processInput({ code: this.id });
}

function processInput(e) {
    if (gameOver) return;

    if (e.code.startsWith("Key") && col < width) {
        let currTile = document.getElementById(row + '-' + col);
        if (currTile.innerText === "") {
            currTile.innerText = e.code[3];
            col++;
        }
    } 
    else if (e.code === "Backspace" && col > 0) {
        col--;
        document.getElementById(row + '-' + col).innerText = "";
    } 
    else if (e.code === "Enter") {
        update();
    }

    if (!gameOver && row === height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    for (let c = 0; c < width; c++) {
        guess += document.getElementById(row + '-' + c).innerText;
    }

    guess = guess.toLowerCase();
    console.log("User guess:", guess);

    if (!guessList.includes(guess)) {
        document.getElementById("answer").innerText = "Not in word list";
        return;
    }

    let correct = 0;
    let letterCount = {}; 

    for (let i = 0; i < word.length; i++) {
        letterCount[word[i]] = (letterCount[word[i]] || 0) + 1;
    }

    // First pass: Check correct positions
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row + '-' + c);
        let letter = currTile.innerText;

        if (word[c] === letter) {
            currTile.classList.add("correct");
            document.getElementById("Key" + letter).classList.add("correct");

            correct++;
            letterCount[letter]--;
        }
    }

    // Second pass: Check misplaced letters
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row + '-' + c);
        let letter = currTile.innerText;

        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct")) keyTile.classList.add("present");

                letterCount[letter]--;
            } else {
                currTile.classList.add("absent");
                document.getElementById("Key" + letter).classList.add("absent");
            }
        }
    }

    row++;
    col = 0;

    if (correct === width) {
        gameOver = true;
    }
}
