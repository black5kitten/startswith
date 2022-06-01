const questionimages = document.getElementById("questionimages");
const optionlist = document.getElementById('optionlist');
const checkbtn = document.getElementById('check');

let questions = []
//xhttp request to request data from JSON file
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    
    if (this.readyState == 4 && this.status == 200) {
       response = JSON.parse(xhttp.responseText);
       
       questions = response.quest;
       createquestions(questions);
    }
};
xhttp.open("GET", "questions.json", true);
xhttp.send();


//this is to control the zoom function of the browser, it works on chrome IE but not on firefox
//this practice in itself is wrong as zoom function should be controlled by user and not by application.
document.body.style.zoom = "80%";


const questionoptions = [];
const qansweroptions = [];


function createquestions(questions){

  // Shuffle array
  const shuffled = questions.sort(() => 0.5 - Math.random());

  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, 3);
  const qimages = selected.map(extractquestionimages);
  
  //populating all images in first ul
  [...qimages]
  .forEach((pic,index)=>{
    const listitem = document.createElement('li');
    const imageitem = document.createElement('img');
    listitem.setAttribute('Data-index',index);
    imageitem.setAttribute('Data-index',index);
    
    imageitem.src=pic;
    imageitem.width="150";
    imageitem.height="150";
    imageitem.alt="alphabet";
    imageitem.classList.add("nondraggable")
        
    listitem.appendChild(imageitem);
    questionoptions.push(listitem);
    questionimages.appendChild(listitem);
  });

  //populating answer options
  const qanswers = selected.map(extractanswers);
  
  [...qanswers]
  .map(a => ({value: a, sort:Math.random()}))
  .sort((a,b) => a.sort - b.sort)
  .map(a => a.value)
  .forEach((answer,index) => {
    const listitem = document.createElement('li');
    listitem.setAttribute('Data-index',index);

    listitem.innerHTML=`
    <div class="draggable" draggable="true">
    <p class="qoption">${answer}</p>
    </div>`;

    qansweroptions.push(listitem);
    optionlist.appendChild(listitem);
  });

  addEventListener();
}

function checkorder(){
  let score = 0
  for(let i =0; i < 3; i++){
    let abc = questionoptions[i].querySelector(".nondraggable").src
    abc=abc.split('/').pop()
    let xyz = qansweroptions[i].querySelector('.draggable').innerText

    if ((abc.toUpperCase().charAt(0)) !== xyz) {
      qansweroptions[i].classList.add('wrong')
    }
    else if ((abc.toUpperCase().charAt(0)) === xyz) {
      qansweroptions[i].classList.remove('wrong')
      qansweroptions[i].classList.add('right')
      score +=1
    }    
  }

  const celeb = document.getElementById("celebration")
  if (score == 3) {
    console.log("score is:" + score)
    document.body.style.backgroundImage="url('https://media.giphy.com/media/fYxHYBB1k7aQwjGhSc/giphy.gif')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
  }
  else {
    console.log("SCORE IS =" + score)
  }
}

function addEventListener(){
  const uloptionlist = document.querySelectorAll(".optionlist li");
  const liqitem = document.querySelectorAll(".draggable");

  uloptionlist.forEach(singlelioflist => {
    singlelioflist.addEventListener('dragover',customdragover);
    singlelioflist.addEventListener('drop',customdrop);
    singlelioflist.addEventListener('dragenter',customdragenter);
    singlelioflist.addEventListener('dragleave',customdragleave);
  });

  liqitem.forEach(liitem => {
    liitem.addEventListener('dragstart',dragStart);
  });

}

function extractquestionimages(arr){
  return arr.questionimage;
}

function extractanswers(arr){
  return arr.answer;
}

function customdragover(e){
  e.preventDefault();
}

function customdrop(){
  dragendindex =this.getAttribute('data-index');
  swapalphabets(dragstartindex,dragendindex);
  this.classList.remove('over');
}

function swapalphabets(fromindex,toindex){
  const itemone = qansweroptions[fromindex].querySelector('.draggable');
  const itemtwo = qansweroptions[toindex].querySelector('.draggable');

  qansweroptions[fromindex].appendChild(itemtwo);
  qansweroptions[toindex].appendChild(itemone);
}

function customdragenter(){
  this.classList.add('over');
}

function customdragleave(){
  this.classList.remove('over');
}

function dragStart(){
  dragstartindex =+this.closest('li').getAttribute('data-index');
}

checkbtn.addEventListener('click',checkorder);