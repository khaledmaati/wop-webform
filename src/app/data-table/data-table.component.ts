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
  dataSet: DocumentData[] = [];

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
        this.initializeDataTable();
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }

  private async populateDataSet(taxID: string): Promise<void> {
    try {
      const documentsSnapshot = await this.firestore.collection('wohnungsbaupraemie', ref => ref.where('taxID', '==', taxID)).get().toPromise();
      if (documentsSnapshot && !documentsSnapshot.empty) {
        this.dataSet = documentsSnapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return {
            taxID: data.taxID,
            stadt: data.stadt,
            hausnummer: data.hausnummer
          };
        });
      } else {
        console.error('No documents found with the specified taxID');
        this.dataSet = [];
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      this.dataSet = [];
    }
  }

  ngAfterViewInit() {
    if (this.dataSet.length > 0) {
      this.initializeDataTable();
    }
  }

  private initializeDataTable() {
    new DataTable('#example', {
      data: this.dataSet,
      columns: [
        { title: 'taxID', data: 'taxID' },
        { title: 'stadt', data: 'stadt' },
        { title: 'hausnummer', data: 'hausnummer' }
      ],
      rowCallback: (row: HTMLElement, data: DocumentData) => {
        row.addEventListener('click', () => {
          this.router.navigate(['/form']);
        });
      }
    });
  }
}
