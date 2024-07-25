import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';



export interface DocumentData {

  bausparkasse: string;
  jahr: string;
  status: string;
  taxID: string;
  identifikationsnummerEhegatte: string;
  familienname: string;
  vorname: string;
  geburtsdatum: string;
  partnerFamilienname: string;
  partnerVorname: string;
  partnerGeburtsdatum: string;
  strasse: string;
  hausnummer: string;
  stadt: string;
  bundesland: string;
  postleitzahl: string;
  familienstand: string;
  dynamicForms: DynamicForm[];
  noOtherHousingBonus: boolean;
  partialHousingBonus: boolean;
  consentAsSpouse: boolean;
  partialHousingBonusAmount: string;
  
}

export interface DynamicForm {
  vertragsnummer: string;
  abschlussdatum: string;
  bausparsumme: string;
  bausparbeitrag: string;
  hoechstbetrag: string;
  vermoegenswirksameLeistungen: string;
}


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }


  saveData(data: DocumentData) {
    return this.firestore.collection('wohnungsbaupraemie').add(data);
  }

  getDataByTaxID(taxID: string) {
    return this.firestore.collection('wohnungsbaupraemie', ref => ref.where('taxID', '==', taxID)).valueChanges();
  }
}