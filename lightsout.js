$(function () {
  const szuloElem = $("article"); //szülőelem, amelybe a lámpák kerülnek
  const sablonElem = $(".lampa"); //ez a sablonelem, amelyet majd másolgatunk
  const lampaObjektumTomb = [];    //a lámpaobjektumokat tároló tömb
  const meret = 5; //5x5
  const db = 5; //kezdetben ennyi db lámpa világítson
  const kezdetiVilagitoIndexek = []; //a kezdetben világító lámpák indexpárosait tároló tömb
  let vilagitoLampak = db; //a világító lámpák számlálója, mely kezdetben db
 

  
  jatekterFeltolt();
  generalKezdetiVilagitoIndex();
  $("#feladom").on("click",function(){
    const lekapcsoltLampak = meret*meret-vilagitoLampak;
    //alert("Játék megszakítva. Lekapcsolt lámpák száma: "+lekapcsoltLampak+". Új játék indul!");  
    let felbukkanoablak = "<div class='felbukkano'><p>Játék megszakítva!<br> Lekapcsolt lámpák száma: "+lekapcsoltLampak+". Új játék indul!<p><input type='button' value='OK' id='OK'></div>";  
    $("body").append(felbukkanoablak);
    $("#OK").on("click", function(){
      $(".felbukkano").remove();
      jatektUjratolt();      
    }); 
  });


 /*FÜGGVÉNY: A KÖRNYEZŐ LÁMPÁK ÁLLAPOTVÁLTOZÁSA*/

  $(window).on("szomszedokAllapotValt",function(event){

    szamolVilagitoLampak(event.detail); //a Lámpa osztály kattintáseseménye alapján a kattintott lámpának megvált. az állapota, tehát a világító lámpák száma is változni fog

    //console.log("elkaptam az eseményt");

    //lekérem az eseményt kiváltó lámpaobjektum sor- ill. oszlopindexét
   const sorIndex = event.detail.sorIndex;
   const oszlopIndex = event.detail.oszlopIndex;

   //console.log ("A kattintást kiváltó lámpa helye: ["+sorIndex+", "+oszlopIndex+"]"); 

  //szomszédok indexpárosai
  //const alsoIndexParos = [sorIndex+1,oszlopIndex];  
  //const felsoIndexParos = [sorIndex-1,oszlopIndex];
  //const balIndexParos = [sorIndex,oszlopIndex-1];
  //const jobbIndexParos = [sorIndex,oszlopIndex+1];

  //indexvizsgálat + a szomszédos lámpák állapotának megváltoztatása + a világító lámpák számának frissítése:  
  if(!(sorIndex+1>meret-1)){
    const aktLampaObj = lampaObjektumTomb[sorIndex+1].segedTomb[oszlopIndex];
    aktLampaObj.setAllapot();
    szamolVilagitoLampak(aktLampaObj);
  }
  if(!(sorIndex-1<0)){
    const aktLampaObj = lampaObjektumTomb[sorIndex-1].segedTomb[oszlopIndex]; 
    aktLampaObj.setAllapot();
    szamolVilagitoLampak(aktLampaObj);    
  }
  if(!(oszlopIndex+1>meret-1)){
    const aktLampaObj = lampaObjektumTomb[sorIndex].segedTomb[oszlopIndex+1];
    aktLampaObj.setAllapot();
    szamolVilagitoLampak(aktLampaObj);
  }
  if(!(oszlopIndex-1<0)){
    const aktLampaObj =  lampaObjektumTomb[sorIndex].segedTomb[oszlopIndex-1];
    aktLampaObj.setAllapot();
    szamolVilagitoLampak(aktLampaObj);
  }

  console.log('Most ennyi lámpa világít: '+vilagitoLampak);
  //vilagitoLampak = Math.floor(Math.random() * 2); //--> nyerés szimulálásához / teszteléséhez
  nyert();

});


/*FÜGGVÉNY: NYERÉS KIHIRDETÉSE, JÁTÉKTÉR FELKÉSZÍTÉSE ÚJ JÁTÉKRA*/

function nyert(){
  if(vilagitoLampak == 0){
    alert("Gratulálunk, nyertél!");
    jatektUjratolt();
  }
}


/*FÜGGVÉNY: JÁTÉK ÚJRATÖLTÉSE*/

function jatektUjratolt(){  
  szuloElem.empty();              //article ürítése
  lampaObjektumTomb.splice(0,lampaObjektumTomb.length); //tömbök ürítése
  kezdetiVilagitoIndexek.splice(0,kezdetiVilagitoIndexek.length);
  jatekterFeltolt();  
  generalKezdetiVilagitoIndex();
  vilagitoLampak = db;
}


/*FÜGGVÉNY: MEGSZÁMOLJA, ÉPPEN HÁNY LÁMPA VILÁGÍT*/

function szamolVilagitoLampak(aktLampaObj){
  if (aktLampaObj.vilagit) //ha felkapcsolódott az akt. lámpa, akkor növeljük a világító lámpák számát, ellenkező esetben pedig csökkentjük
    {vilagitoLampak++;}
  else {vilagitoLampak--;}
}


  /*FÜGGVÉNY: JÁTÉKTÉR FELTÖLTÉSE ELEMEKKEL (LÁMPÁKKAL)*/

function jatekterFeltolt(){

  for (let i = 0; i < meret; i++) {  
    lampaObjektumTomb.push({segedTomb : [] }); //"2 dimenzióssá" teszem egy segédaltömb hozzáadásával
       for (let j = 0; j < meret; j++) {
      let aktLampa = sablonElem.clone().appendTo(szuloElem); //sablonelem klónozása, szülőelemhez fűzése
      //aktLampa.append(i+","+j);
      const lampa = new Lampa(aktLampa,i,j); //Lámpa oszt. példányosítása     
      lampaObjektumTomb[i].segedTomb.push(lampa); //így fogok majd tudni hivatkozni indexpáros alapján egy lámpaobjektumra: lampaObjektumTomb[i].segedTomb[j]
    }
  }
  console.log(lampaObjektumTomb);  
  sablonElem.remove(); 
}


/* FÜGGVÉNY: KEZDETBEN MELY INDEXŰ ELEMEK LEGYENEK KIVILÁGÍTVA*/  

  function generalKezdetiVilagitoIndex() {
    //5db egymástól különböző indexpárost generál véletlenszerűen
    while (!(kezdetiVilagitoIndexek.length == db)) { //addig fusson, amíg a tömb hossza el nem éri az 5-öt
      let i = Math.floor(Math.random() * db); //0-5
      let j = Math.floor(Math.random() * db); //0-5

      if (kezdetiVilagitoIndexek.length == 0) {
        //ha még üres, tegyen bele egy indexpárt
        kezdetiVilagitoIndexek.push([i, j]);
      } else {
        //ha már nem üres a tömb, akkor tegyük bele az új indexpárt, FELTÉVE, HA még nincsen benne
        beszur = false; //a beszur kapcsoló kezdetben hamis; csak akkor szúrható be az új indexpáros, ha igazzá válik
        sz = 0; 
        while (
          sz < kezdetiVilagitoIndexek.length && !(kezdetiVilagitoIndexek[sz][0] == i && kezdetiVilagitoIndexek[sz][1] == j)) {
          //amíg nem ér a tömb végére és nem egyezik az akt.eleme az újonnnan generált indexpárossal
          if (sz == kezdetiVilagitoIndexek.length - 1) { //ha végigfutott a ciklus a tömb teljes hosszán, akkor nem található még meg benne az indexpáros, tehát be lehet szúrni            
            beszur = true; 
          }
          sz++;
        }
        if (beszur) {   //ha igaz, hogy nincsen benne, akkor szúrjuk be
          kezdetiVilagitoIndexek.push([i, j]);
        }
      }
    }
    console.log(kezdetiVilagitoIndexek);
    kezdetiVilagitoElemek();
  }


  /* FÜGGVÉNY: KEZDETBEN A FENTEBB MEGHATÁROZOTT INDEXŰ ELEMEK LEGYENEK KIVILÁGÍTVA*/


function kezdetiVilagitoElemek(){    
    kezdetiVilagitoIndexek.forEach(indexparos => {
        let i= indexparos[0]; let j = indexparos[1];
        console.log(i,j);
        lampaObjektumTomb[i].segedTomb[j].felKapcsol();        
    });

} 

  
});
