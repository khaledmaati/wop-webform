import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

declare var DataTable: any; // Assuming DataTable is globally available

interface DocumentData {
  taxID: string;
  stadt: string;
  hausnummer: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, AfterViewInit {
  dataSet: any[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    public authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const taxID = await this.authService.getUserTaxID(user.uid);
        await this.populateDataSet(taxID);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }
  
  private async populateDataSet(taxID: string) {
    const documentsSnapshot = await this.firestore.collection('wohnungsbaupraemie', ref => ref.where('taxID', '==', taxID)).get().toPromise();
    if (documentsSnapshot) {
      this.dataSet = documentsSnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          taxID: data.taxID,
          stadt: data.stadt,
          hausnummer: data.hausnummer
        };
      });
    } else {
      console.error('No documents found');
      this.dataSet = [];
    }
  }
  
  
  ngAfterViewInit() {
    new DataTable('#example', {
      columns: [
        { title: 'taxID' },
        { title: 'stadt' },
        { title: 'hausnummer' }
      ],
      data: this.dataSet,
      rowCallback: (row: HTMLElement, data: any) => {
        row.addEventListener('click', () => {
          this.router.navigate(['/form']);
        });
      }
    });
  }
}