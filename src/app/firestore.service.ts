import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  getDataByTaxID(taxID: string) {
    return this.firestore.collection('wohnungsbaupraemie', ref => ref.where('taxID', '==', taxID)).valueChanges();
  }
}