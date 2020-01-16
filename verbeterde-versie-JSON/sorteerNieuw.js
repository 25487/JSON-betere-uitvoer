let xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        sortCamerasObj.data = JSON.parse(this.responseText);
        sortCamerasObj.voegJsDatum();

        //De data moeten ook een eigenschap hebben
        sortCamerasObj.data.forEach( camera => {
            camera.titelUpper = camera.titel.toUpperCase();
            //de optische zoom moet dit ook hebben
            camera.Auteur = camera.auteur[0];

        });


        sortCamerasObj.sorteren();
    }
}


xmlhttp.open('GET', "cameras.json", true);
xmlhttp.send();

const maakTabelKopAan = (arr) => {
    let kop = "<table class='camera'><tr>";
    arr.forEach((item) => {
        kop += "<th>" + item + "</th>";
    });
    kop += "</tr>";
    return kop;
}
//voor de datum
const geefMaandNummer = (maand) => {
  let nummer;
  switch (maand) {
    case "januari":
      nummer = 0;
      break;
    case "februari":
      nummer = 1;
      break;
    case "maart":
      nummer = 2;
      break;
    case "april":
      nummer = 3;
      break;
    case "mei":
      nummer = 4;
      break;
    case "juni":
      nummer = 5;
      break;
    case "juli":
      nummer = 6;
      break;
    case "augustus":
      nummer = 7;
      break;
    case "september":
      nummer = 8;
      break;
    case "oktober":
      nummer = 9;
      break;
    case "november":
      nummer = 10;
      break;
    case "december":
      nummer = 11;
      break;
    default:
      nummer = 0

  }
  return nummer;
}

// functie die string van maand jaar omzet in een dat-object
const maakJSdatum = (maandJaar) => {
  let mjArray = maandJaar.split(" ");
  let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
  return datum;
}

//opsomming
const maakOpsomming = (array) => {
  let string = "";
  for(let i=0; i<array.length; i++) {
    switch (i) {
      case array.length-1 : string += array[i]; break;
      case array.length-2 : string += array[i] + " en "; break;
      default: string += array[i] + ", ";
    }
  }
  return string;
}

//maak functie die de tekst achter de comma vooraan plaats
const keerDeTekstOm = (string) => {
    if(string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }
    return string;
}



//sorteer de cameras functies sorteren() + uitvoeren()
let sortCamerasObj = {
    data: "",
    unique: "titelUpper",
    oplopend: 1,
    voegJsDatum: function () {
        this.data.forEach((item) => {
            item.JSDate = maakJSdatum(item.uitgave);
        });
    },


    //De data word gesorteert
    sorteren: function(){
        this.data.sort( (a,b) => a[this.unique] > b[this.unique] ? 1*this.oplopend :  -1*this.oplopend);
        this.uitvoeren(this.data);
    },
    //De tabel word verwerkt hierin
    uitvoeren: function(data){

        //de uitvoer legen
        document.getElementById("uitvoer").innerHTML = "";

        data.forEach(camera => {
            let sectie = document.createElement('section');
            sectie.className = 'cameraSelectie';

            //De grid elementen worden hierin gezet
            let main = document.createElement('main');
            main.className = "cameraSelectie__main";

            //maakt de cover van de camera aan
            let afbeelding = document.createElement("img");
            afbeelding.className = "cameraSelectie__cover";
            afbeelding.setAttribute("src", camera.cover);
            afbeelding.setAttribute("alt", keerDeTekstOm(camera.titel));

            //maakt de titel aan
            let titel = document.createElement('h3');
            titel.className = "cameraSelectie__titel";
            titel.textContent = keerDeTekstOm(camera.titel);

            //de optische-zoom
            let auteurs = document.createElement('p');
            auteurs.className = 'cameraSelectie__auteurs';
            //Optische Zoom tekst
            camera.auteur[0] = keerDeTekstOm(camera.auteur[0]);
            auteurs.textContent =  " Optische Zoom: " + maakOpsomming (camera.auteur);

            //overige informatie zoals wifi en kwaliteit ect.
            let overig = document.createElement('p');
            overig.className = "cameraSelectie__overig";
            overig.textContent = "Uitgave datum: " + camera.uitgave + " | Camera Zoom: " + camera.zoom + " | Wifi: " + camera.wifi + " | Kwaliteit: " + camera.kwaliteit;


            //de prijs van de cameras
            let prijs = document.createElement("div");
            prijs.className = "cameraSelectie__prijs";
            //de prijs naar het nederlands
            prijs.textContent = camera.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: "currency"});


            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            main.appendChild(auteurs);
            main.appendChild(overig);
            sectie.appendChild(main)
            sectie.appendChild(prijs);
            document.getElementById("uitvoer").appendChild(sectie);
        });
    }
}
//het sorteren
document.getElementById('kenmerk').addEventListener('change', (e) => {
    sortCamerasObj.unique = e.target.value;
    sortCamerasObj.sorteren();
});
//ook het sorteren
document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sortCamerasObj.oplopend = parseInt(e.target.value);
        sortCamerasObj.sorteren();
    })
})
