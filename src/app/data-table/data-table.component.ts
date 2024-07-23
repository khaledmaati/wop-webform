import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

declare var $: any; // Assuming jQuery is used for DataTables

interface DocumentData {
  uid: string;
  bausparkasse: string;
  jahr: string;
  status: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
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
        this.initializeDataTable(); // Initialize DataTable after data is populated
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
            uid: doc.id, // Attach the document ID as UID
            bausparkasse: data.bausparkasse,
            jahr: data.jahr,
            status: data.status
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

  private initializeDataTable() {
    setTimeout(() => { // Ensure the DOM is updated before initializing DataTable
      $('#example').DataTable({
        data: this.dataSet,
        columns: [
          { title: 'Bausparkasse', data: 'bausparkasse' },
          { title: 'Jahr', data: 'jahr' },
          { title: 'Status', data: 'status' }
        ]
      });

      // Add row click event
      $('#example tbody').on('click', 'tr', (event: Event) => {
        const target = $(event.currentTarget);
        const rowData = $('#example').DataTable().row(target).data() as DocumentData;
        if (rowData) {
          this.router.navigate(['/form', rowData.uid, rowData.jahr]); // Pass the UID and year in the route
        }
      });
    }, 0);
  }
}
