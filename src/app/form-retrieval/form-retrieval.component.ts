import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { saveAs } from 'file-saver-es';
import { parseString } from 'xml2js';
import { AuthService } from '../auth.service';
import { DocumentData, FirestoreService } from '../firestore.service';
import { StylesService } from '../styles.service';

@Component({
  selector: 'app-form-retrieval',
  templateUrl: './form-retrieval.component.html',
  styleUrls: ['./form-retrieval.component.css'],
})
export class FormRetrievalComponent implements OnInit {
  taxID!: string;
  data: any;
  selectedFiles: File[] = [];
  uid: string | null = null;
  superUserSparkasse!: string;

  @ViewChild('xmlFileInput') xmlFileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private firestore: AngularFirestore,
    public stylesService: StylesService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.uid = await this.authService.getCurrentUserUID();
      if (this.uid) {
        this.superUserSparkasse = await this.authService.getSuperUserSparkasse(this.uid);
      } else {
        throw new Error('User ID is null');
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
      alert('Error fetching user information.');
    }
  }

  fetchData(): void {
    if (!this.taxID) {
      alert('Please enter a tax ID.');
      return;
    }

    this.firestoreService.getDataByTaxID(this.taxID).subscribe(
      (result: any[]) => {
        if (Array.isArray(result) && result.length > 0) {
          this.data = result; // Store all documents
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

  downloadXml(): void {
    if (Array.isArray(this.data)) {
      this.data.forEach((doc, index) => {
        if (doc.bausparkasse === this.superUserSparkasse) {
          const xml = this.jsonToXml(doc, 'data');
          const blob = new Blob([xml], { type: 'application/xml' });
          saveAs(blob, `data_${index + 1}.xml`); // Save each document as a separate XML file
        }
      });
    }
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

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files).filter(file => 
        file.type === 'application/xml' || file.name.endsWith('.xml')
      );
      if (this.selectedFiles.length === 0) {
        alert('Please select XML files only.');
      }
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles.length > 0) {
      let filesProcessed = 0;
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const xml = e.target?.result as string;
          this.parseXmlAndSaveToFirestore(xml);
          filesProcessed++;
          if (filesProcessed === this.selectedFiles.length) {
            alert('All files have been uploaded successfully.');
            this.clearSelectedFiles(); // Clear the list of selected files
          }
        };
        reader.readAsText(file);
      });
    } else {
      alert('Please select files first.');
    }
  }

  clearSelectedFiles(): void {
    this.selectedFiles = [];
    if (this.xmlFileInput) {
      this.xmlFileInput.nativeElement.value = ''; // Clear the file input element
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
      noOtherHousingBonus: data.noOtherHousingBonus ?? '',
      partialHousingBonus: data.partialHousingBonus ?? '',
      consentAsSpouse: data.consentAsSpouse ?? '',
      partialHousingBonusAmount: data.partialHousingBonusAmount ?? '',
    };

    console.log('Document Data:', documentData); // Log the final documentData object

    return documentData;
  }

  saveDataToFirestore(data: DocumentData): void {
    this.firestore.collection('wohnungsbaupraemie').add(data)
      .then(() => {
        console.log('Data saved to Firestore successfully');
        alert('Data has been successfully saved to Firestore.');
      })
      .catch((error) => {
        console.error('Error saving data to Firestore:', error);
        alert('Error saving data to Firestore.');
      });
  }

  // Drag and drop handling
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files) {
      this.selectedFiles = Array.from(files).filter(file => 
        file.type === 'application/xml' || file.name.endsWith('.xml')
      );
      if (this.selectedFiles.length === 0) {
        alert('Please drop XML files only.');
      }
    }
    this.updateDropZone(false);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.updateDropZone(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.updateDropZone(false);
  }

  private updateDropZone(isDragging: boolean): void {
    const dropZone = document.querySelector('.drop-zone') as HTMLElement;
    if (dropZone) {
      if (isDragging) {
        dropZone.classList.add('dragover');
      } else {
        dropZone.classList.remove('dragover');
      }
    }
  }
}
