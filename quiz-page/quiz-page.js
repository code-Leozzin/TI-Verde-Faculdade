function getRanking() {
  const rankingBase = JSON.parse(localStorage.getItem("rankingBase"))

  if (!rankingBase) {
    localStorage.setItem("rankingBase", JSON.stringify(ranking))
    return getRanking()
  } else {
    return rankingBase
  }
}

function getComments() {
  const commentsArray = JSON.parse(localStorage.getItem("comments"))

  if (!commentsArray) {
    localStorage.setItem("comments", JSON.stringify(comments))
    return getComments()
  } else {
    return commentsArray
  }
}

document.addEventListener("DOMContentLoaded", () => {
  popularRanking()
  displayComments()
})

function popularRanking() {

     const rankingBase = getRanking()


    rankingBase.sort((a, b) => b.acertos - a.acertos);
    
    const rankingTableBody = document.getElementById('ranking-quiz');

    
    rankingTableBody.innerHTML = '';

    rankingBase.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.nome;

        const scoreCell = document.createElement('td');
        scoreCell.textContent = item.acertos;

        row.appendChild(nameCell);
        row.appendChild(scoreCell);

        rankingTableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', initQuiz);
const startButton = document.getElementById('start-button');
const userNameInput = document.getElementById('user-name');
const startContainer = document.getElementById('start-container');
const quizContainer = document.getElementById('quiz-container');
const nextButton = document.getElementById('next-button');

let userName = "";

function initQuiz() {
    userName = "";

    userNameInput.addEventListener('input', () => {
        startButton.disabled = userNameInput.value.trim() === "";
    });

    startButton.addEventListener('click', async () => {
        userName = userNameInput.value.trim();
        if (userName) {
            startContainer.style.display = 'none';
            quizContainer.style.display = 'block';
            
            const quizArray = quizzes
            if (quizArray.length > 0) {
                startQuiz(quizArray);
            } else {
                alert('Nenhum quiz encontrado.');
            }
        }
    });
}

let currentQuestionIndex = 0; 
let correctAnswers = 0; 

function startQuiz(quizzes) {
    currentQuestionIndex = 0; 
    correctAnswers = 0; 
    displayQuestion(quizzes[currentQuestionIndex]);
    
    const nextButton = document.getElementById('next-button');
    nextButton.disabled = false;
    nextButton.onclick = () => {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            if (selectedOption.id === `option-${quizzes[currentQuestionIndex].respostaCorreta}`) {
                correctAnswers++;
            }

            currentQuestionIndex++; 

            if (currentQuestionIndex < quizzes.length) {
                displayQuestion(quizzes[currentQuestionIndex]);
            } else {
                endQuiz(correctAnswers, quizzes.length);
            }
            resetChecked();
        } else {
            alert('Por favor, selecione uma opção.');
        }
    };
}

function endQuiz(correctAnswers, totalQuestions) {
    
    enviarRanking(userName, correctAnswers);

    quizContainer.style.display = 'none';

    const endContainer = document.getElementById('end-container');
    endContainer.style.display = 'block';

    const endMessage = document.getElementById('end-message');
    endMessage.textContent = `Parabéns! Você acertou ${correctAnswers} de ${totalQuestions} perguntas.`;

    const returnButton = document.getElementById('return-button');
    returnButton.addEventListener('click', () => {
        window.location.href = './quiz-page.html';
    });

    popularRanking()
}


function displayQuestion(question) {
    const questionElement = document.getElementById("question");
    if (questionElement) {
        questionElement.textContent = question.pergunta;
    }

    const options = question.respostas;

    const optionIds = [
        "option-a", 
        "option-b", 
        "option-c", 
        "option-d", 
        "option-e"
    ];

    optionIds.forEach((id, index) => {
        const optionLabel = document.querySelector(`label[for="${id}"]`); 
        if (optionLabel) { 
            const optionKey = Object.keys(options)[index];
            optionLabel.textContent = `${String.fromCharCode(65 + index)}) ${options[optionKey]}`;
            const inputElement = document.getElementById(id);
            inputElement.value = options[optionKey]; 
        }
    });
}


async function enviarRanking(nome, acertos) {
    const rankingData = {
        nome: nome,
        acertos: acertos
    };

    const rakingBase = JSON.parse(localStorage.getItem("rankingBase"))
    rakingBase.push(rankingData)
    localStorage.setItem("rankingBase", JSON.stringify(rakingBase))
}


class Respostas {
    constructor(a, b, c, d, e) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
    }
}

class Quiz {
    constructor(pergunta, respostas, acerto) {
        this.pergunta = pergunta;
        this.respostas = respostas;
        this.acerto = acerto;
    }
}

function resetChecked() {
    const radios = document.getElementsByName("option");
    radios.forEach(radio => {
        radio.checked = false;
    });
}

function displayComments() {

  const commentContainerList = document.getElementsByClassName("comments")[0]

  const commentsArray = getComments()

  commentContainerList.innerHTML = ""

  commentsArray.forEach(item => {

    const commentContainer = document.createElement("div")
    commentContainer.id = 'comment'

    const header = document.createElement("span") 
    header.id = "header"

    const name = document.createElement("h2")
    name.id = "name"

    const starList = document.createElement("ul")
    starList.id = "avaliacao"

    const content = document.createElement('div')
    content.id = content

    name.innerText = item.nome
    content.innerText = item.comentario

    for(let i = 0; i < 5; i++) {
      
      const star = document.createElement("li")

      if (item.nota === i) {
        star.id = "star-icon-ativo"
      } else {
        star.id = "star-icon"
      }
      starList.appendChild(star)
    }

    header.append(name, starList)
    commentContainer.append(header, content)
    commentContainerList.appendChild(commentContainer)
  })
}

var stars = document.querySelectorAll('.comments-avaliation');
var commentInput = document.getElementById("input-text")
var nota = document.getElementsByClassName("Nota")[0]

var avaliacao = 0;

stars.forEach(item => {
  item.addEventListener('click', (e) => {
    var classStar = e.target.classList;
    if(!classStar.contains('ativo')){
      stars.forEach(function(star){
        star.classList.remove('ativo');
      })
    }
    classStar.add('ativo');
    avaliacao = e.target.getAttribute('data-avaliacao')
    nota.innerText = `${avaliacao}`
  })

})

const commentButton = document.getElementById("comment-button")

function sendComment() {

  if(!avaliacao){
    alert("Escolha uma nota")
  }

  const comment = commentInput.value


  const commentData = {
    nome: userName,
    nota: Number(avaliacao),
    comentario: comment
  }

  const commentList = getComments()

  commentList.push(commentData)

  localStorage.setItem("comments", JSON.stringify(commentList))

  displayComments()

  const starList = document.getElementsByClassName("comments-avaliation")

  commentInput.value = '';

  for(let i = 0; i < 5;i++){
    console.log(i)
    if(i === 0) {
      starList[i].classList.add("star-icon","comments-avaliation", "ativo")
    } else {
      starList[i].classList.add("star-icon", "comments-avaliation")
    }
  }

  nota.innerText = 1
}

commentButton.addEventListener('click', sendComment)
