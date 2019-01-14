/////////////////////////////////////////////////////////////////
//////////////////////////  BETOLTES  ///////////////////////////

// Atrendezes, amikor a felhasznalo megadta a helyet

document.querySelector('.form__alkalom--btn').addEventListener('click', function(){

    // Helynev kiirasa a cimsorba, cimsor felvitele uj helyre
    var hely = document.getElementById('form__alkalom--text').value;
    document.querySelector('.title').insertAdjacentHTML('beforeend', `- ${hely}`);
    document.querySelector('.title').style.top = '1.5rem';
    document.querySelector('.title').style.left = '2.5rem';
    document.querySelector('.title').style.transform = 'translate(0)';
    document.querySelector('.title').style.fontSize = '2rem';

    // Form eltuntetese, fomenu megjelenitese
    document.querySelector('.form__alkalom').style.display = 'none';
    document.querySelector('.keret').style.display = 'flex';

    // Elso menupont - resztvevok - aktivalasa
    document.getElementById('resztvevok__fejlec').classList.add('fejlec--aktiv');
    document.querySelector('#resztvevok__menu').style.height = '70vh';
});


/////////////////////////////////////////////////////////////////
//////////////////////////  VALTOZOK ////////////////////////////

var koltsegLista = [];
var koltsegAdatok = [];
var ktgSorszamLista = [];
var resztvevoLista = [];
var rvSorszamLista = [];
var tartozasok = [];
var korrigaltTart = [];

var TartozasFiz = function(fiz, tartozok) {
	this.fiz = fiz,
	this.tartozok = tartozok
};

/////////////////////////////////////////////////////////////////
//////////////////////  RESZTVEVO KEZELES  //////////////////////

// Resztvevo hozzaadasa

document.querySelector('.btn__rv--plusz').addEventListener('click', function(){

    // Levesszuk az erteket.
    var resztvevoErtek = document.querySelector('.resztvevok__form__text').value;

    // Ures mezot akart-e hozzaadni a felhasznalo?
    if(resztvevoErtek !== ''){

        // Volt-e mar a nev?
        if(resztvevoLista.includes(resztvevoErtek)) {
            alert('Ezt a nevet mar beirtad.');
        } else {

            // Resztvevo megjelenitett listahoz valo hozzaadasa
            if (resztvevoLista.length <= 13){
                var markupIndex;
                if (resztvevoLista.length > 0) { markupIndex = rvSorszamLista[rvSorszamLista.length - 1] + 1} else { markupIndex = 0}

                // tartozas matrix tombnel minden fizeto tartozoinak kiegeszitese az uj resztvevovel
                    tartozasok.forEach(function(el) {
                        el.tartozok.push(0);
                    });

                    korrigaltTart.forEach(function(current){
                        current.tartozok.push(0);
                    });
                
                // ResztvevoLista array kiegeszitese
                resztvevoLista.push(resztvevoErtek);
                rvSorszamLista.push(markupIndex);

                // tartozasok tombben uj fizeto letrehozasa
                var TartAktualis = new TartozasFiz(resztvevoErtek, []);
                resztvevoLista.forEach(function(){
                    TartAktualis.tartozok.push(0);
                });

                var KorrTartAkt = new TartozasFiz(resztvevoErtek, []);
                resztvevoLista.forEach(function(){
                    KorrTartAkt.tartozok.push(0);
                });
                tartozasok.push(TartAktualis);
                korrigaltTart.push(KorrTartAkt);


                // koltsegAdatok array tartozas mezoinek kiegeszitese
                koltsegAdatok.forEach(function(el){
                    el.tartozas.push(0);
                });

                let markup = `<li class="listaelem" id="rv__lista-${markupIndex}">
                <div class="listaelem__szoveg rv__nev rv__nev-${markupIndex}">${resztvevoErtek}</div>
                <div class="btn btn--minusz" id="rv__minusz-${markupIndex}">töröl</div>
                </li>`
                document.querySelector('.rv__lista').insertAdjacentHTML('beforeend', markup);

                // Fizette legordulo menu kiegeszitese
                var fizetteMarkup = `<option id="opcio-${markupIndex}" value="${resztvevoErtek}">${resztvevoErtek}</option>`;
                document.querySelector('.koltsegek__fizette').insertAdjacentHTML('beforeend', fizetteMarkup);

                // Ha van megnyitva szerkesztesre koltsegsor, akkor annak legordulo menujenek kiegeszitese
                if(lakatNyitva > 0){
                    document.querySelector(`.ktg__edit--fizette`).insertAdjacentHTML('beforeend', `<option id="ktg__opcio-${markupIndex}" value="${resztvevoErtek}">${resztvevoErtek}</option>`)
                }

                // Resztvevo hozzaadasa koltseg tablahoz
                var ktgTablaMarkup = `<div class="tablazat--fejlec-nev" id="koltsegek__tablazat--nev-${markupIndex}">${resztvevoErtek}</div>`

                document.querySelector('#koltsegek__tablazat--nevsor').insertAdjacentHTML('beforeend', ktgTablaMarkup);

                // Resztvevo rubrikainak hozzaadasa a koltseg tablahoz
                if (koltsegLista.length > 0) {
            
        		    ktgSorszamLista.forEach(function(el) {
		        	document.querySelector(`#koltsegek__tablazat--ktg-${el}`).insertAdjacentHTML('beforeend', `
                	    <div class="koltsegek__rubrika" id="koltsegek__tablazat--ktg-${el}-resztvevo-${markupIndex}">
                	        <input type="checkbox" class="koltsegek__checkbox" id="ktg-${el}-resztvevo-${markupIndex}">
                	        <label for="ktg-${el}-resztvevo-${markupIndex}" class="koltsegek__label">
                      		    <div class="koltsegek__rubrika--ures">&nbsp;</div>
                           	    <div class="koltsegek__rubrika--teli" id="rubrika__ktg-${el}-resztvevo-${markupIndex}">&nbsp;</div>
                            </label>
                        </div>`);
                    });
		        }
            } else {
                alert('Több résztvevő nem adható hozzá.');
            }
        }

        // Mezo kiuritese
        document.querySelector('.resztvevok__form__text').value = '';
    }

    // tartozasok tablazat frissitese
    tartozasKiir();
});

// Resztvevo torlese

document.querySelector('.rv__lista').addEventListener('click', function(event){
    if(event.target.id.includes('rv__minusz')) {

        var index = event.target.id.split('-')[1];
        var indexArr = resztvevoLista.indexOf(document.querySelector(`.rv__nev-${index}`).textContent);
        
	// Fogyasztolistakbol valo torles
	koltsegAdatok.forEach(function(current){
	    if(current.fogy.includes(resztvevoLista[indexArr])){
        current.fogy.splice(current.fogy.indexOf(resztvevoLista[indexArr]), 1);
        
	    }
	});

	// Ha valamely koltseget a torolendo resztvevo fizette
	
	var fizTorolve = 0;
	koltsegAdatok.forEach(function(current){
	    if(current.fiz === document.querySelector(`.rv__nev-${index}`).textContent){
		document.querySelector(`#ktg__fizette-${ktgSorszamLista[koltsegAdatok.indexOf(current)]}`).classList.add('listaelem__szoveg--hiba');
        document.querySelector(`#ktg__fizette-${ktgSorszamLista[koltsegAdatok.indexOf(current)]}`).textContent='';
        current.fiz='';
        fizTorolve++;
	    }
	});
	if(fizTorolve > 1) {
	    alert(`A törölt résztvevőt korábban ${fizTorolve} költség fizetőjeként állítottad be! Kérlek, add meg, hogy ki fizette a jelzett sorokat.`);
	} else if(fizTorolve > 0){
	    alert(`A törölt résztvevőt korábban az egyik költség fizetőjeként állítottad be! Kérlek, add meg, hogy ki fizette a jelzett sort.`);
	}

        // Lista megjeleniteserol valo torles
        document.querySelector('.rv__lista').removeChild(document.querySelector(`#rv__lista-${index}`));

        // Fizette legordulo menubol valo torles
        document.querySelector('.koltsegek__fizette').removeChild(document.querySelector(`#opcio-${index}`));

        // szerkesztett koltsegtetel legordulo menubol valo torles
	    if (lakatNyitva > 0){
		    document.querySelector(`#${document.querySelector('.ktg__edit--fizette').id}`).removeChild(document.querySelector(`#ktg__opcio-${index}`));
        }

        // Koltseg tablazatbol valo torles
            // Tablazat nevsorabol valo torles
            document.querySelector('#koltsegek__tablazat--nevsor').removeChild(document.querySelector(`#koltsegek__tablazat--nev-${index}`));

            //Rubrikak torlese
            ktgSorszamLista.forEach(function(el) {
                document.querySelector(`#koltsegek__tablazat--ktg-${el}`).removeChild(document.querySelector(`#koltsegek__tablazat--ktg-${el}-resztvevo-${index}`));
            });

        // rvSorszamLista array-bol valo torles
        rvSorszamLista.splice(rvSorszamLista.indexOf(parseInt(index)), 1);

        // ResztvevoLista array-bol valo torles
        resztvevoLista.splice(indexArr, 1);
	
	// KoltsegAdatok array tartozasi listairol valo torles es koltsegAdatok array tartozas altombjeinek ujraszamitasa
	koltsegAdatok.forEach(function(el){
        el.tartozas.splice(indexArr, 1);
        el.tartozas.forEach(function(curr, i){
            el.tartozas[i] = el.ar / el.fogy.length;
        });
    });

	//tartozasok tomb minden altombjebol valo torles
	tartozasok.forEach(function(el){
	    el.tartozok.splice(indexArr, 1);
    });
    korrigaltTart.forEach(function(el){
        el.tartozok.splice(indexArr, 1);
    });

	//tartozasok tombbol fizeto torlese
    tartozasok.splice(indexArr , 1);
    korrigaltTart.splice(indexArr, 1);

	// tartozasok tomb ujrairasa, tartozasok kijelzese
    tartozasSzamit();
    tartozasKiir();
    }
});


////////////////////////////////////////////////////////////////////////
//////////////////////  KOLTSEGEK KEZELESE  ////////////////////////////

var koltsegsor = ['nev', 'span', 'fizette', 'ar', 'minusz'];

var KoltsegObj = function(nev, fiz, ar, fogy, tartozas) {
    this.nev = nev,
    this.fiz = fiz,
    this.ar = ar,
    this.fogy = fogy,
    this.tartozas = tartozas
};

// Koltseg hozzaadasa

document.querySelector('.btn__ktg--plusz').addEventListener('click', function(){

    // Levesszuk az ertekeket.
    
    var ktgNevErtek = document.querySelector('.koltsegek__koltsegnev').value;
    var ktgFizErtek = document.querySelector('.koltsegek__fizette').value;
    var ktgArErtek = parseInt(document.querySelector('.koltsegek__ar').value);

    // Ures mezot akart-e hozzaadni a felhasznalo?
    if(ktgNevErtek !== '' && ktgFizErtek !== '' && ktgArErtek > 0){

        // Volt-e mar a koltseg?

        if(koltsegLista.includes(ktgNevErtek)) {
            alert('Ezt a költséget mar beirtad.');
        } else {

            // Koltseg megjelenitett listahoz valo hozzaadasa
            if (koltsegLista.length <= 15){
                var ktgMarkupIndex;
		        if(koltsegLista.length > 0) {
		            ktgMarkupIndex = ktgSorszamLista[ktgSorszamLista.length - 1] + 1;
		        } else { ktgMarkupIndex = 0 }

                //koltsegLista array kiegeszitese
                koltsegLista.push(ktgNevErtek);
                ktgSorszamLista.push(ktgMarkupIndex);
                koltsegReszletek = new KoltsegObj(ktgNevErtek, ktgFizErtek, ktgArErtek, [], []);
		        for (i=0; i<resztvevoLista.length; i++) {koltsegReszletek.tartozas.push(0)};
                koltsegAdatok.push(koltsegReszletek);

                let ktgMarkup = 
                `<li class="listaelem ktg__listasor" id="ktg__lista-${ktgMarkupIndex}">
                    <div class="listaelem__szoveg koltsegek__elem ktg__nev" id="ktg__nev-${ktgMarkupIndex}">${ktgNevErtek}</div>
                    <span id="ktg__span-${ktgMarkupIndex}">fizette:</span>
                    <div class="listaelem__szoveg koltsegek__elem ktg__fizette" id="ktg__fizette-${ktgMarkupIndex}">${ktgFizErtek}</div>
                    <div class="listaelem__szoveg koltsegek__elem ktg__ar" id="ktg__ar-${ktgMarkupIndex}">${ktgArErtek}</div>

                    <div class="btn btn--minusz" id="ktg__minusz-${ktgMarkupIndex}">töröl</div>
                    <div class="lakat" id="lakat-${ktgMarkupIndex}">
                        <div class="lakat--teteje" id="lakat--teteje-${ktgMarkupIndex}"></div>
                        <div class="lakat--alja"></div>
                    </div>
                </li>`

                document.querySelector('.koltsegek__lista').insertAdjacentHTML('beforeend', ktgMarkup);

            // Koltseg tablazat kiegeszitese
		    var ktgSorIndex;
		    koltsegLista.forEach(function(el) {
		        if(el === ktgNevErtek) {
			        ktgSorIndex = ktgSorszamLista[ktgSorszamLista.length - 1];
		        }
		    });

            var ktgTablaSorMarkup = `<div class="koltsegek__tablazat--sor" id="koltsegek__tablazat--ktg-${ktgSorIndex}"></div>`;
            document.querySelector('.koltsegek__tablazat').insertAdjacentHTML('beforeend', ktgTablaSorMarkup);

            resztvevoLista.forEach(el => document.querySelector(`#koltsegek__tablazat--ktg-${ktgSorIndex}`).insertAdjacentHTML('beforeend', `
                <div class="koltsegek__rubrika" id="koltsegek__tablazat--ktg-${ktgMarkupIndex}-resztvevo-${rvSorszamLista[resztvevoLista.indexOf(el)]}">
                    <input type="checkbox" class="koltsegek__checkbox" id="ktg-${ktgMarkupIndex}-resztvevo-${rvSorszamLista[resztvevoLista.indexOf(el)]}">
                    <label for="ktg-${ktgMarkupIndex}-resztvevo-${rvSorszamLista[resztvevoLista.indexOf(el)]}" class="koltsegek__label">
                        <div class="koltsegek__rubrika--ures">&nbsp;</div>
                        <div class="koltsegek__rubrika--teli" id="rubrika__ktg-${ktgMarkupIndex}-resztvevo-${rvSorszamLista[resztvevoLista.indexOf(el)]}">&nbsp;</div>
                    </label>
                </div>`));

            } else {
                alert('Több költség nem adható hozzá.');
            }
        }

        // Mezok kiuritese
        var mezoNevek = ['.koltsegek__koltsegnev', '.koltsegek__fizette', '.koltsegek__ar'];
        mezoNevek.forEach(el =>{
            document.querySelector(el).value = '';
        });
    }
});

//Mar mentett koltseg szerkesztese
var lakatNyitva = 0;

document.querySelector('.koltsegek__lista').addEventListener('click', function(event){
    if(event.target.classList.contains('lakat')){
        var lakatIndex = event.target.id.split('-')[1];
	    var ktgSzerkIndex = parseInt(ktgSorszamLista[lakatIndex]);

        //ellenorizzuk, hogy epp szerkesztes alatt all-e
        if(document.querySelector(`#lakat--teteje-${lakatIndex}`).classList.contains('lakat-nyitott')){
            //ellenorizzuk, minden adat meg van-e adva
            /*if(document.querySelector(!(`#ktg__nev-${lakatIndex}`).value == '') && !(document.querySelector(`#ktg__fizette-${lakatIndex}`).value == '') && !(document.querySelector(`#ktg__ar-${lakatIndex}`).value == 0)){*/
                //lakat bezarasa
                document.querySelector(`#lakat--teteje-${lakatIndex}`).classList.remove('lakat-nyitott');

                lakatNyitva = 0;

                //adatok levetele
                koltsegAdatok[lakatIndex].nev = document.querySelector(`#ktg__edit--nev-${ktgSzerkIndex}`).value;
                koltsegAdatok[lakatIndex].fiz = document.querySelector(`#ktg__edit--fizette-${ktgSzerkIndex}`).value;
                koltsegAdatok[lakatIndex].ar = parseInt(document.querySelector(`#ktg__edit--ar-${ktgSzerkIndex}`).value);

                //form elemek eltuntetese
                document.querySelector(`#ktg__lista-${lakatIndex}`).removeChild(document.querySelector(`#ktg__edit-${lakatIndex}`));

                //mezok visszaallitasa
                var markupSzerkBef = `
                <div class="listaelem__szoveg koltsegek__elem ktg__nev" id="ktg__nev-${lakatIndex}">${koltsegAdatok[lakatIndex].nev}</div>
                <span id="ktg__span-${lakatIndex}">fizette:</span>
                <div class="listaelem__szoveg koltsegek__elem ktg__fizette" id="ktg__fizette-${lakatIndex}">${koltsegAdatok[lakatIndex].fiz}</div>
                <div class="listaelem__szoveg koltsegek__elem ktg__ar" id="ktg__ar-${lakatIndex}">${koltsegAdatok[lakatIndex].ar}</div>
                <div class="btn btn--minusz" id="ktg__minusz-${lakatIndex}">töröl</div>`;

                document.querySelector(`#ktg__lista-${lakatIndex}`).insertAdjacentHTML('afterbegin', markupSzerkBef);

            // koltseg tombben a tartozasok ujraszamitasa
            resztvevoLista.forEach(function(el){
                if(koltsegAdatok[lakatIndex].fogy.includes(el)) {
                    koltsegAdatok[lakatIndex].tartozas[resztvevoLista.indexOf(el)] = koltsegAdatok[lakatIndex].ar / koltsegAdatok[lakatIndex].fogy.length;
                    console.log(koltsegAdatok[lakatIndex].tartozas);
                } else {
                    koltsegAdatok[lakatIndex].tartozas[resztvevoLista.indexOf(el)] = 0;
                }
            });

            // tartozasok tomb ujrairasa, tartozasok kijelzese
            tartozasSzamit();
            tartozasKiir();
            

            /*}*/
        } else {
            if (lakatNyitva > 0){
                alert('Egyszerre egy sor szerkeszthető.');
            } else {
                //lakat kinyitasa    
                document.querySelector(`#lakat--teteje-${lakatIndex}`).classList.add('lakat-nyitott');

                lakatNyitva++;

                //listaelem eltuntetese
                koltsegsor.forEach(el => document.querySelector(`#ktg__lista-${lakatIndex}`).removeChild(document.querySelector(`#ktg__${el}-${lakatIndex}`)));

                //form elemek visszaallitasa
                var lakatMarkup = 
                `<form class="ktg__listasor ktg__edit" id="ktg__edit-${lakatIndex}">
                    <input type="text" maxlength=27 class="form__text koltsegek__elem ktg__edit--nev" id="ktg__edit--nev-${lakatIndex}" value=${koltsegAdatok[ktgSzerkIndex].nev}>
                    <span class="koltsegek__span" id="ktg__edit--span-${lakatIndex}">fizette:</span>
                    <select class="form__text koltsegek__elem ktg__edit--fizette" id="ktg__edit--fizette-${lakatIndex}">
                    <input type="number" class="form__text koltsegek__elem ktg__edit--ar" id="ktg__edit--ar-${lakatIndex}" value=${koltsegAdatok[ktgSzerkIndex].ar}>
                    <div class="btn btn--non">töröl</div>
                </form>`;

                document.querySelector(`#ktg__lista-${lakatIndex}`).insertAdjacentHTML('afterbegin', lakatMarkup);

                resztvevoLista.forEach(el => document.querySelector(`#ktg__edit--fizette-${lakatIndex}`).insertAdjacentHTML('beforeend', `<option id="ktg__opcio-${resztvevoLista.indexOf(el)}" value="${el}">${el}</option>`));
            }
        }
    }
})

// Koltseg torlese
document.querySelector('.koltsegek__lista').addEventListener('click', function(event) {
    if(event.target.classList.contains('btn--minusz')) {
        var ktgTorlesIndex = parseInt(event.target.id.split('-')[1]);
        var ktgIndexArr = koltsegLista.indexOf(document.querySelector(`#ktg__nev-${ktgTorlesIndex}`).textContent);

        // sor torlese a listarol
        document.querySelector('.koltsegek__lista').removeChild(document.querySelector(`#ktg__lista-${ktgTorlesIndex}`));

        // koltseg torlese a tablazatbol
        document.querySelector('.koltsegek__tablazat').removeChild(document.querySelector(`#koltsegek__tablazat--ktg-${ktgTorlesIndex}`));

        //koltseg torlese az array-ekbol es objectekbol
        ktgSorszamLista.splice(ktgSorszamLista.indexOf(ktgTorlesIndex), 1);
        koltsegLista.splice(ktgIndexArr, 1);
        koltsegAdatok.splice(ktgIndexArr, 1);

	// tartozasok tomb ujrairasa, tartozasok kijelzese
    tartozasSzamit();
    tartozasKiir();

    }
});

// Fogyaszto hozzaadasa vagy torlese a koltsegAdatok objectbol

document.querySelector('.koltsegek__tablazat').addEventListener('click', function(event) {
    if(event.target.classList.contains('koltsegek__rubrika--teli')){
	var rubrikaKtgIndex = event.target.id.split('-')[1];
	var rubrikaRtvIndex = event.target.id.split('-')[3];
	var ktgObjIndex;

	koltsegAdatok.forEach(function(el) {
	    if(document.querySelector(`#ktg__nev-${rubrikaKtgIndex}`).textContent === el.nev){
		ktgObjIndex = koltsegAdatok.indexOf(el);
		return ktgObjIndex;
	    }
	});

	if(document.querySelector(`#ktg-${rubrikaKtgIndex}-resztvevo-${rubrikaRtvIndex}`).checked){
            koltsegAdatok[ktgObjIndex].fogy.splice(koltsegAdatok[ktgObjIndex].fogy.indexOf(document.querySelector(`#koltsegek__tablazat--nev-${rubrikaRtvIndex}`).textContent), 1);
    	} else {
            koltsegAdatok[ktgObjIndex].fogy.push(document.querySelector(`#koltsegek__tablazat--nev-${rubrikaRtvIndex}`).textContent);

        }
    }

    // ktgAdatok array tartozasok tombjenek frissitese
    resztvevoLista.forEach(function(el){
	if(koltsegAdatok[ktgObjIndex].fogy.includes(el)) {
	    koltsegAdatok[ktgObjIndex].tartozas[resztvevoLista.indexOf(el)] = koltsegAdatok[ktgObjIndex].ar / koltsegAdatok[ktgObjIndex].fogy.length;
	} else {
	    koltsegAdatok[ktgObjIndex].tartozas[resztvevoLista.indexOf(el)] = 0;
	}
    });

    // tartozasok tomb ujrairasa, tartozasok kijelzese
    tartozasSzamit();
    tartozasKiir();

});


////////////////////////////////////////////////////////////////////////
///////////////////////////  TARTOZASOK  ///////////////////////////////

// tartozasok tomb ujrairasa
function tartozasSzamit() {
    // ki kinek mennyit fizetett?
    tartozasok.forEach(function(el) {
        el.tartozok.forEach(function(cur, i) {
            el.tartozok[i] = 0;
        });
    });
    koltsegAdatok.forEach(function(el){
        var fizIndex = resztvevoLista.indexOf(el.fiz);
        el.tartozas.forEach(function(current, index) {
            tartozasok[fizIndex].tartozok[index] += current;
        });
    });
    // ugyanazon szemelyek tartozasainak kivonasa egymasbol
    tartozasok.forEach(function(el, i1){
        el.tartozok.forEach(function(ele, i2){
            korrigaltTart[i1].tartozok[i2] = ele - tartozasok[i2].tartozok[i1];
        });
    });   

    // szamok kerekitese, negativok kiszurese
    korrigaltTart.forEach(function(curr){
        curr.tartozok.forEach(function(elem, ind){
            if(curr.tartozok[ind] > 0) {
                curr.tartozok[ind] = Math.floor(elem);
            } else {
                curr.tartozok[ind] = 0;
            }
        });
    });
}

// tartozasok kijelzese
function tartozasKiir() {
    // korabbi valtozat kitorlese
    while(document.querySelector('.tartozasok__matrix').firstChild) {
        document.querySelector('.tartozasok__matrix').removeChild(document.querySelector('.tartozasok__matrix').firstChild);
    }

    //uj valtozat beirasa
    document.querySelector('.tartozasok__matrix').insertAdjacentHTML('afterbegin', '<div id="tartozasokmatrix__fejlec"></div>');
    resztvevoLista.forEach(function(el, index) {
        document.querySelector('#tartozasokmatrix__fejlec').insertAdjacentHTML('beforeend', `
            <div class="tablazat--fejlec-nev tartozas__nev-fuggoleges" id="tartozasokmatrix__fejlec-${rvSorszamLista[resztvevoLista.indexOf(el)]}">
                ${el}
            </div>`
        );
        document.querySelector('.tartozasok__matrix').insertAdjacentHTML('beforeend', `
            <div class="tartozasok__sor" id="tartozasok__sor-${rvSorszamLista[resztvevoLista.indexOf(el)]}">
                <div class="tartozas__nev-vizszintes">${el}</div>
            </div>
        `);
        resztvevoLista.forEach(function(curr, i) {
            document.querySelector(`#tartozasok__sor-${rvSorszamLista[resztvevoLista.indexOf(el)]}`).insertAdjacentHTML('beforeend', `
                <div class="tartozasok__rubrika" id="tartozasok__fizette-${rvSorszamLista[resztvevoLista.indexOf(el)]}-tartozik-${rvSorszamLista[resztvevoLista.indexOf(curr)]}" reszletek="${curr} ${korrigaltTart[index].tartozok[i]} forinttal tartozik neki: ${el}.">
                    ${korrigaltTart[index].tartozok[i]}
                </div>
            `);
        });
    });
}

////////////////////////////////////////////////////////////////////////
//////////////////////  NAVIGACIOS GOMBOK  /////////////////////////////

// Lapozo fuggveny

turnPage = function(menupont) {
    const menusor = ['resztvevok', 'koltsegek', 'tartozasok'];
    menusor.forEach(cur => {
        if(document.querySelector(`#${cur}__fejlec`).classList.contains('fejlec--aktiv')){
            document.querySelector('.fejlec--aktiv').classList.remove('fejlec--aktiv');
            document.querySelector(`#${cur}__menu`).style.height = '0';
        }
    });
    document.querySelector(`#${menupont}__fejlec`).classList.add('fejlec--aktiv');
    document.querySelector(`#${menupont}__menu`).style.height = '70vh';
};

// Next gombok
document.querySelector('#resztvevok__next').addEventListener('click', function(){turnPage('koltsegek');});

document.querySelector('#koltsegek__next').addEventListener('click', function(){turnPage('tartozasok');});

// Prev gombok
document.querySelector('#koltsegek__prev').addEventListener('click', function(){turnPage('resztvevok');});

document.querySelector('#tartozasok__prev').addEventListener('click', function(){turnPage('koltsegek');});