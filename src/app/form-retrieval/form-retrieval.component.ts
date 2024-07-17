import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-form-retrieval',
  templateUrl: './form-retrieval.component.html',
  styleUrls: ['./form-retrieval.component.css']
})
export class FormRetrievalComponent {
  taxId!: string;
  data: any;

  constructor(private firestoreService: FirestoreService) { }

  fetchData() {
    this.firestoreService.getDataByTaxId(this.taxId).subscribe((result) => {
      if (result.length > 0) {
        this.data = result[0]; // Assuming there's only one document per taxId
        this.downloadXml();
      } else {
        console.log('No data found for tax ID:', this.taxId);
        alert(`No data found for tax ID: ${this.taxId}`);
      }
    });
  }


  jsonToXml(json: any): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';
    for (let key in json) {
      xml += `<${key}>${json[key]}</${key}>\n`;
    }
    xml += '</data>';
    return xml;
  }
  downloadXml() {
    const xml = this.jsonToXml(this.data);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}