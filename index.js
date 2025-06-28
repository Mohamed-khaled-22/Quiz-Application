// Sellector Element

let countspan = document.querySelector(".quiz-info .count> span");
let bulletsSpan = document.querySelector(".quiz-answer .bullets");
let result = document.querySelector(".result");
let quizErea = document.querySelector(".quiz-erea");
let quizAnswer = document.querySelector(".quiz-answer");
let submit = document.querySelector(".Submit_Button");
let countdowncontainer = document.querySelector(".countdown");

// console.log(quizErea)

// Set Option

let currentIndex = 0;
let rightAnswer = 0;
let countdowninterval;





function getQuestions() {

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // console.log(this.responseText)
            let quesObject = JSON.parse(this.responseText)
            // console.log(quesObject)
            let queCount = quesObject.length

            createBullets(queCount)
            addData(quesObject[currentIndex], queCount)
            countdown(60, queCount)
            submit.onclick = function () {
                let rightAnswer = quesObject[currentIndex].right_answer;
                // console.log(rightAnswer)

                currentIndex++;

                checkAnswers(rightAnswer, queCount)

                quizErea.innerHTML = "";

                addData(quesObject[currentIndex], queCount)

                handelBullets()

                showResult(queCount)

                clearInterval(countdowninterval)
                countdown(60, queCount)

            }
        }
    }

    myRequest.open("Get", "quistion-file.json", true)
    myRequest.send()
}

getQuestions()

function createBullets(num) {
    countspan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let span = document.createElement("span")

        if (i === 0) {
            span.classList.add("on")
        }

        bulletsSpan.appendChild(span)
    }
}

function addData(obj, count) {
    if (currentIndex < count) {
        // console.log(obj);
        // console.log(count);

        // add question
        let question = document.createElement("div");
        question.className = "question";
        question.textContent = obj.title;
        quizErea.appendChild(question)


        // add answers
        for (let i = 1; i <= 4; i++) {

            let answerDv = document.createElement("div");
            answerDv.className = 'answer'

            let radioInp = document.createElement("input");
            radioInp.type = 'radio';
            radioInp.name = 'ans';
            radioInp.id = `answer_${i}`;
            radioInp.dataset.answer = obj[`answer_${i}`];

            if (i === 1) {
                radioInp.checked = true;
            }

            let label = document.createElement("label");
            label.htmlFor = `answer_${i}`;
            label.textContent = obj[`answer_${i}`];

            answerDv.appendChild(radioInp)
            answerDv.appendChild(label)

            // console.log(answerDv)
            quizErea.appendChild(answerDv)

        }
    }
}

function checkAnswers(ra, count) {

    let answers = document.getElementsByName("ans")
    let chosen;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            chosen = answers[i].dataset.answer;
        }

    }

    if (ra === chosen) {
        rightAnswer++
    }

}

function handelBullets() {
    let bullets = document.querySelectorAll(".quiz-answer .bullets span")
    let arrayBullets = Array.from(bullets)

    arrayBullets.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on'
        }
    })
}


function showResult(cou) {
    let res;
    if (currentIndex === cou) {
        submit.remove()
        quizErea.remove()
        quizAnswer.remove()

        if (rightAnswer > cou / 2 && rightAnswer < cou) {
            res = ` <span>good</span> You Answered <span>${rightAnswer}</span> From <span>${cou}</span>`
        } else if (rightAnswer === cou) {
            res = ` <span>Perfict</span> You Answered <span>${rightAnswer}</span> From <span>${cou}</span>`
        } else {
            res = ` <span>Bad</span> You Answered <span>${rightAnswer}</span> From <span>${cou}</span>`

        }

        result.innerHTML = res
        result.style.cssText = 'padding: 10px; background-color: white; margin-top: 10px'
    }
}


function countdown(duration, count) {
    if (currentIndex < count) {

        let min, sec;
        countdowninterval = setInterval(() => {
            min = parseInt(duration / 60);
            sec = parseInt(duration % 60);

            min = min < 10 ? `0${min}` : min;
            sec = sec < 10 ? `0${sec}` : sec;

            countdowncontainer.innerHTML = `${min} : ${sec}`;
            --duration
            if (duration < 0) {
                clearInterval(countdowninterval)
                submit.click();
            }

        }, 1000);

    }

}