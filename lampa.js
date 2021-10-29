
class Lampa{

constructor(elem,sorIndex,oszlopIndex){

this.elem = elem;
this.sorIndex=sorIndex;
this.oszlopIndex=oszlopIndex;

//kezdetben a lámpák nagy része sötét
this.vilagit = false;

this.elem.on("click",()=>{
 
    this.setAllapot();
    this.kattintasTrigger();    //üzenni kell a játéktérnek, h. ha rákattintottunk egy lámpára, 
                                //mert akkor a játéktérnek gondoskodia kell a környező lámpák állapotának megváltoztatásáról   
    });
}

setAllapot(){    
    if (this.vilagit){
        this.leKapcsol();
      }else{
          this.felKapcsol();
        }
}

felKapcsol(){
    this.elem.css("background-color","yellow");
    this.vilagit=true;
}

leKapcsol(){
    this.elem.css("background-color","lightgreen");
    this.vilagit=false;
}

kattintasTrigger(){
     //azt figy., hogy kattintva lett egy lámpára, s ezt hozzaadjuk az ablak obj-hoz
    let esemeny = new CustomEvent("szomszedokAllapotValt",{
       detail:this //a detail segitsegevel tudjuk atadni, melyik obj. valtotta ki az esemenyt
    }); 
    window.dispatchEvent(esemeny); //a foablakhoz adom az esemenyt, melyet majd a lampa.js-ben el tudok kapni
 }

}