import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { saveAs } from 'file-saver-es';
import { parseString } from 'xml2js';

@Component({
  selector: 'app-form-retrieval',
  templateUrl: './form-retrieval.component.html',
  styleUrls: ['./form-retrieval.component.css'],
})
export class FormRetrievalComponent implements OnInit {
  taxID!: string;
  uid!: any;
  data: any;
  @ViewChild('xmlFileInput') xmlFileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private firestoreService: FirestoreService,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      this.uid = await this.authService.getCurrentUserUID();
      this.taxID = await this.authService.getUserTaxID(this.uid);
    } catch (error) {
      console.error('Error fetching tax ID:', error);
      alert('Error fetching tax ID.');
    }
  }

  fetchData() {
    this.firestoreService.getDataByTaxID(this.taxID).subscribe(
      (result) => {
        if (result.length > 0) {
          this.data = result[0]; // Assuming there's only one document per taxId
          this.downloadXml();
        } else {
          console.log('No data found for tax ID:', this.taxID);
          alert(`No data found for tax ID: ${this.taxID}`);
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
              value.forEach((item) => {
                xml += `${indent}<${key}>\n`;
                convert(item, indent + '  ');
                xml += `${indent}</${key}>\n`;
              });
            } else {
              xml += `${indent}<${key}>\n`;
              convert(value, indent + '  ');
              xml += `${indent}</${key}>\n`;
            }
          } else {
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

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.readFile(file);
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const xmlContent = (e.target as FileReader).result as string;
      this.parseXml(xmlContent);
    };
    reader.readAsText(file);
  }

  parseXml(xml: string) {
    parseString(xml, { explicitArray: false }, (err: any, result: any) => {
      if (err) {
        console.error('Error parsing XML:', err);
        alert('Error parsing XML file.');
      } else {
        this.saveDataToFirestore(result);
      }
    });
  }

  saveDataToFirestore(data: any) {
    const wohnungsbaupraemie = 'wohnungsbaupraemie';
    this.authService.saveData(wohnungsbaupraemie, data).subscribe(
      () => {
        console.log('Data saved successfully.');
        alert('Data saved successfully.');
      },
      (error) => {
        console.error('Error saving data to Firestore:', error);
        alert('Error saving data to Firestore.');
      }
    );
  }

  triggerFileUpload() {
    if (this.xmlFileInput) {
      this.xmlFileInput.nativeElement.click(); // Trigger the file input click
    }
  }
}
