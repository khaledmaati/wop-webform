import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { saveAs } from 'file-saver-es';

@Component({
  selector: 'app-form-retrieval',
  templateUrl: './form-retrieval.component.html',
  styleUrls: ['./form-retrieval.component.css'],
})
export class FormRetrievalComponent {
  taxId!: string;
  data: any;

  constructor(
    private firestoreService: FirestoreService,
    public authService: AuthService
  ) {}

  fetchData() {
    this.firestoreService.getDataByTaxId(this.taxId).subscribe(
      (result) => {
        if (result.length > 0) {
          this.data = result[0]; // Assuming there's only one document per taxId
          this.downloadXml();
        } else {
          console.log('No data found for tax ID:', this.taxId);
          alert(`No data found for tax ID: ${this.taxId}`);
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        alert('Error fetching data.');
      }
    );
  }
  

  jsonToXml(json: any, rootElement: string = 'data'): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<${rootElement}>\n`;

    function convert(obj: any, indent: string) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              // Handle arrays by repeating the key for each item
              value.forEach((item) => {
                xml += `${indent}<${key}>\n`;
                convert(item, indent + '  ');
                xml += `${indent}</${key}>\n`;
              });
            } else {
              // Handle nested objects
              xml += `${indent}<${key}>\n`;
              convert(value, indent + '  ');
              xml += `${indent}</${key}>\n`;
            }
          } else {
            // Handle base case
            xml += `${indent}<${key}>${value}</${key}>\n`;
          }
        }
      }
    }

    convert(json, '  ');
    xml += `</${rootElement}>`;
    return xml;
  }

  downloadXml() {
    const xml = this.jsonToXml(this.data);
    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, 'data.xml'); // Use file-saver's saveAs function
  }

}
