var json = {"data":{
  "title":"Quiz",
  "pass":0.66,
  "welcome":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "congratulations":"Well done, you passed!",
  "failed":"No luck this time",
  "question":[
    {
      "id":1,
      "text":"What's the answer to this question?",
      "correct":0,
      "option":[
        {
          "id":1,
          "text":"Option a"
        },
        {
          "id":2,
          "text":"Option b"
        },
        {
          "id":3,
          "text":"Option c"
        }
      ]
    },
    {
      "id":2,
      "text":"What's the answer to this question?",
      "correct":0,
      "option":[
        {
          "id":1,
          "text":"Option a"
        },
        {
          "id":2,
          "text":"Option b"
        },
        {
          "id":3,
          "text":"Option c"
        }
      ]
    },
    {
      "id":3,
      "text":"What's the answer to this question?",
      "correct":0,
      "option":[
        {
          "id":1,
          "text":"Option a"
        },
        {
          "id":2,
          "text":"Option b"
        },
        {
          "id":3,
          "text":"Option c"
        }
      ]
    }
  ]
}};

// Global Variables
var questionLength = json.data.question.length;
var questionCounter = 0;
// Empty array to push values of users answers
var answers = [];
var displayArea = $('.question');

// Initiate first screen function
$(document).ready(function () {
  displayIntro();
});

// Display First Screen
var displayIntro = function () {
  $('.next').hide();
  var begin = $('.begin').html("Start");

  var header = $('<h2 class="welcome">' + json.data.title + '</h2>');
  var content = $('<p class="welcome">' + json.data.welcome + '</p>');
  var passMark = (json.data.pass * 100 );
  var rules = $('<p class="welcome">There are ' + questionLength + ' questions. You must obtain a ' + passMark + "% mark in order to pass this module.</p>");

  // Append intro information to document
  displayArea.prepend(header, content, rules);
};

// On click - clear text and initiate Quiz
$('.begin').on('click', function (e) {
  e.preventDefault();
  questionCounter = 0;
  answers = [];
  $('.welcome, .begin').remove();
  displayQuestions();
});

// Create content for displaying questions
var displayQuestions = function () {
  var options = displayOptions();
  displayArea.prepend(options).fadeIn();
  var content = $('<p> Question: ' + json.data.question[questionCounter].text + '</p>');
  displayArea.prepend(content).fadeIn();
  var header = $('<h2>Question ' + (questionCounter+1) + ' of ' + questionLength + '</h2>');
  displayArea.prepend(header).fadeIn();
  // Initiate the show button
  $('.next').show();
  var next = $('.next').html("Next");
};

// Separate function for display list of possible answers as radio buttons
var displayOptions = function () {
  var optionList = $('<ul>');
  var options = json.data.question[questionCounter].option;
  var optionLength = options.length;
  // Loop through available options and display
  for(i=0; i<optionLength; i++) {
    var list = $('<li>');
    answerList = '<input type="radio" name="answer" id=' + i + ' value=' + i + ' /><label for='+ i +'>' + options[i].text + '</label>';
    // answerList += ;
    list.append(answerList);
    optionList.append(list);
  }
  return optionList;
};

// Push the selected radio value to the answers array
var userChoice = function () {
  answers[questionCounter] = +$('input[name="answer"]:checked').val();
};

// Display next question if relevant, else move to final totalScore function
var nextQuestion = function () {
  displayArea.fadeOut(function() {
    $('.question').empty();

    if (questionCounter < questionLength) {
      displayQuestions();
      if (!(isNaN(answers[questionCounter]))) {
        $('input[value=' + answers[questionCounter] + ']').prop('checked', true);
      }
    }else {
      var scoreBoard = totalScore();
      displayArea.append(scoreBoard).fadeIn();
    }
  });
};

// Button to initiate next question function
$('.next').on('click', function (e) {

  // Stay on existing window
  e.preventDefault();
  userChoice();
  // Block from moving forward if no answer is given
  if (isNaN(answers[questionCounter])) {
    return false;
  } else {
    questionCounter++;
    nextQuestion();
    return true;
  }
});

// Display and calculate final screen
// TODO - Refactor this function
var totalScore = function () {
  $('.next').hide();
  var img = $('.img');
  var header = $('<h2>' + json.data.title + ' Results</h2>');
  var score = 0;
  var pass = (json.data.pass * 100 );
  var question = json.data.question;
  var congratulations = json.data.congratulations;
  var failed = json.data.failed;
  var correct = "./assets/tick.png";
  var incorrect = "./assets/cross.png";

  // Loop through answers array
  for (var i = 0; i < answers.length; i++) {

    // Load general content per question
    $('<hr><h3>Question ' + question[i].id+'</h3>').appendTo('.question');
    $('<div>' + question[i].text+'</div>').appendTo('.question');
    $('<h3>Your Answer ' + (answers[i]+1) +'</h3>').appendTo('.question');

    // If answer is correct - display tick, incorrect - display cross
    if(answers[i] === json.data.question[i].correct) {
      score++;
      $('<img src=' + correct + '><br>').appendTo('.question');
      console.log("You got " + json.data.question[i] + " correct");
    } else {
      $('<h3>Correct Answer ' + (json.data.question[i].correct + 1) +'</h3>').appendTo('.question');
      $('<img src=' + incorrect + '><br>').appendTo('.question');
    }
  }

  // Calculate score
  displayArea.prepend("<h2>" + Math.round((score / answers.length)*100)+ "%</h2>");

  // Display appropriate message
  if (Math.round((score / answers.length)*100) > pass ) {
    displayArea.prepend("<h1>" + congratulations + "</h1>");

  } else {
    displayArea.prepend("<h1>" + failed + "</h1>");
  }
  displayArea.prepend(header);
};
