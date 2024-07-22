import { Component, ViewChild, ElementRef } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { saveAs } from 'file-saver-es';
import { parseString } from 'xml2js';
import { DocumentData, DynamicForm } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-form-retrieval',
  templateUrl: './form-retrieval.component.html',
  styleUrls: ['./form-retrieval.component.css'],
})
export class FormRetrievalComponent {
  taxID!: string;
  UID!: any;
  data: any;
  private selectedFile: File | null = null;

  @ViewChild('xmlFileInput') xmlFileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private firestoreService: FirestoreService,
    public authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  fetchData(): void {
    this.firestoreService.getDataByTaxID(this.taxID).subscribe(
      (result) => {
        if (result.length > 0) {
          this.data = result[0]; // Assuming there's only one document per taxID
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

    function convert(obj: any, indent: string): void {
      for (const key in obj) {
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

  downloadXml(): void {
    const xml = this.jsonToXml(this.data);
    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, 'data.xml'); // Use file-saver's saveAs function
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xml = e.target?.result as string;
        this.parseXmlAndSaveToFirestore(xml);
      };
      reader.readAsText(this.selectedFile);
    } else {
      alert('Please select a file first.');
    }
  }

  parseXmlAndSaveToFirestore(xml: string): void {
    parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        alert('Error parsing XML.');
      } else {
        const data = this.transformXmlToDocumentData(result);
        this.saveDataToFirestore(data);
      }
    });
  }

  private transformXmlToDocumentData(result: any): DocumentData {
    const data = result.data || {};
    console.log('Data:', data); // Log the data object
  
    const dynamicForms = data.dynamicForms;
    console.log('Dynamic Forms:', dynamicForms); // Log the dynamicForms
  
    let transformedDynamicForms: any[] = [];
  
    // Check if dynamicForms is an array or an object
    if (Array.isArray(dynamicForms)) {
      transformedDynamicForms = dynamicForms.map((form: any) => ({
        vertragsnummer: form.vertragsnummer ?? '',
        abschlussdatum: form.abschlussdatum ?? '',
        bausparsumme: form.bausparsumme ?? '',
        bausparbeitrag: form.bausparbeitrag ?? '',
        hoechstbetrag: form.hoechstbetrag ?? '',
        vermoegenswirksameLeistungen: form.vermoegenswirksameLeistungen ?? '',
      }));
    } else if (dynamicForms && typeof dynamicForms === 'object' && dynamicForms.form) {
      // If dynamicForms is an object containing a single form
      transformedDynamicForms = [{
        vertragsnummer: dynamicForms.form.vertragsnummer ?? '',
        abschlussdatum: dynamicForms.form.abschlussdatum ?? '',
        bausparsumme: dynamicForms.form.bausparsumme ?? '',
        bausparbeitrag: dynamicForms.form.bausparbeitrag ?? '',
        hoechstbetrag: dynamicForms.form.hoechstbetrag ?? '',
        vermoegenswirksameLeistungen: dynamicForms.form.vermoegenswirksameLeistungen ?? '',
      }];
    }
  
    const documentData: DocumentData = {
      bausparkasse: data.bausparkasse ?? '',
      jahr: data.jahr ?? '',
      status: data.status ?? '',
      taxID: data.taxID ?? '',
      identifikationsnummerEhegatte: data.identifikationsnummerEhegatte ?? '',
      familienname: data.familienname ?? '',
      vorname: data.vorname ?? '',
      geburtsdatum: data.geburtsdatum ?? '',
      partnerFamilienname: data.partnerFamilienname ?? '',
      partnerVorname: data.partnerVorname ?? '',
      partnerGeburtsdatum: data.partnerGeburtsdatum ?? '',
      strasse: data.strasse ?? '',
      hausnummer: data.hausnummer ?? '',
      stadt: data.stadt ?? '',
      bundesland: data.bundesland ?? '',
      postleitzahl: data.postleitzahl ?? '',
      familienstand: data.familienstand ?? '',
      dynamicForms: transformedDynamicForms,
    };
  
    console.log('Document Data:', documentData); // Log the final documentData object
  
    return documentData;
  }
      
  saveDataToFirestore(data: DocumentData): void {
    this.firestore.collection('wohnungsbaupraemie').add(data).then(() => {
      console.log('Data saved to Firestore successfully');
      alert('Data saved to Firestore successfully');
    }).catch((error) => {
      console.error('Error saving data to Firestore:', error);
      alert('Error saving data to Firestore.');
    });
  }
}
