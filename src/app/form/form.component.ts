import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { saveAs } from 'file-saver-es';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // Step 1: Import Router

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  note2 =
    'Prämienberechtigt für 2022 sind alle unbeschränkt einkommensteuerpflichtigen Personen, die vor dem 2. 1.2007 geboren oder Vollwaisen sind. Unbeschränkt einkommensteuerpflichtig sind natürliche Personen, die in der Bundesrepublik Deutschland ansässig sind (Wohnsitz oder gewöhnlicher Aufenthalt), oder die im Ausland ansässig sind und zu einer inländischen juristischen Person des öffentlichen Rechts in einem Dienstverhältnis stehen und dafür Arbeitslohn aus einer inländischen öffentlichen Kasse beziehen. Prämienberechtigt sind auch Personen ohne Wohnsitz oder gewöhnlichen Aufenthalt im Inland, wenn sie auf Antrag nach § 1 Absatz 3 des Einkommensteuergesetzes (EStG) als unbeschränkt einkommensteuerpflichtig behandelt werden. Alleinstehende sind alle Personen, die 2022 nicht verheiratet / verpartnert waren, und Ehegatten / Lebenspartner nach dem LPartG, die keine Höchstbetragsgemeinschaft bilden. Ehegatten / Lebenspartnern nach dem LPartG steht ein gemeinsamer Höchstbetrag zu (Höchstbetragsgemeinschaft), wenn sie beide mindestens während eines Teils des Kalenderjahres 2022 miteinander verheiratet / verpartnert waren, nicht dauernd getrennt gelebt haben, unbeschränkt einkommensteuerpflichtig i. S. d. § 1 Absatz 1 oder 2 oder des § 1a EStG waren und sie nicht die Einzelveranlagung zur Einkommensteuer wählen. Sie gelten in den Fällen des § 1 Absatz 1 oder 2 EStG als zusammenveranlagte Ehegatten / Lebenspartner nach dem LPartG, auch wenn keine Veranlagung durchgeführt worden ist. Ehegatten / Lebenpartner nach dem LPartG, die keine Höchstbetragsgemeinschaft bilden, gelten als Alleinstehende.';
  note3 =
    'Bausparbeiträge, die vermögenswirksame Leistungen sind, werden vorrangig durch Gewährung einer Arbeitnehmer-Sparzulage gefördert. Eine Einbeziehung vermögenswirksamer Leistungen in die prämienbegünstigten Aufwendungen kommt deshalb nur in Betracht, wenn Sie keinen Anspruch auf Arbeitnehmer-Sparzulage haben. Ein Anspruch auf Arbeitnehmer-Sparzulage besteht, wenn das maßgebende zu versteuernde Einkommen unter Berücksichtigung der Freibeträge für Kinder nicht mehr als 17.900 Euro bei Alleinstehenden bzw. 35.800 Euro bei zusammenveranlagten Ehegatten / Lebenspartnern nach dem LPartG beträgt. Sind diese Einkommensgrenzen überschritten, können Sie im Rahmen der prämienbegünstigten Höchstbeträge (700 / 1.400 Euro) für diese vermögenswirksamen Leistungen Wohnungsbauprämie beanspruchen.';

  form: FormGroup;

  dynamicForms: any[] = []; // Step 1: Define the dynamicForms property

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router // Step 2: Inject Router in Constructor

  ) {
    this.form = this.fb.group({
      identifikationsnummer: ['', Validators.required],
      identifikationsnummerEhegatte: ['', Validators.required],
      familienname: ['', Validators.required],
      vorname: ['', Validators.required],
      geburtsdatum: ['', Validators.required],
      partnerFamilienname: [''],
      partnerVorname: [''],
      partnerGeburtsdatum: [''],
      strasse: [''],
      hausnummer: [''],
      stadt: [''],
      bundesland: [''],
      postleitzahl: [''],
      wohnungsbaupraemie: ['', Validators.required],
      dynamicForms: this.fb.array([]),
    });

    this.addForm(); // Initialize with one form
  }

  logout() {
    this.authService.logout();
  }

  addForm(): void {
    const index = this.dynamicForms.length + 1;
    const dynamicForm = this.fb.group({
      [`vertragsnummer-${index}`]: [''],
      [`abschlussdatum-${index}`]: [''],
      [`bausparsumme-${index}`]: [''],
      [`bausparbeitrag-${index}`]: [''],
      [`vermoegenswirksameLeistungen-${index}`]: [''],
      [`wohnungsbaupraemie-${index}`]: ['']
    });

    this.dynamicForms.push(dynamicForm);
    (this.form.get('dynamicForms') as FormArray).push(dynamicForm);
  }

  removeForm(index: number): void {
    if (this.dynamicForms.length > 1) {
      this.dynamicForms.splice(index, 1);
      (this.form.get('dynamicForms') as FormArray).removeAt(index);
    } else {
      alert('At least one form is required.');
    }
  }

  onSubmit(): void {
    this.firestore
      .collection('wohnungsbaupraemie')
      .add(this.form.value)
      .then(() => {
        console.log('Data saved to Firestore');
        this.router.navigate(['/form-sent-notification']); // Step 3: Navigate on Success
      })
      .catch((error) => console.error('Error saving data to Firestore', error));
  }

  downloadXML() {
    const data = this.form.value;
    const xmlData = this.jsonToXML(data);
    const blob = new Blob([xmlData], { type: 'application/xml' });
    saveAs(blob, 'wohnungsbaupraemie.xml');
  }

  jsonToXML(json: any): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Antrag>\n';
    xml += this.convertToXml(json);
    xml += '</Antrag>';
    return xml;
  }

  convertToXml(obj: any, indent = '  '): string {
    let xml = '';
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any) => {
            xml += `${indent}<${key}>\n`;
            xml += this.convertToXml(item, indent + '  ');
            xml += `${indent}</${key}>\n`;
          });
        } else {
          xml += `${indent}<${key}>\n`;
          xml += this.convertToXml(obj[key], indent + '  ');
          xml += `${indent}</${key}>\n`;
        }
      } else {
        const value = this.escapeXml(String(obj[key]));
        xml += `${indent}<${key}>${value}</${key}>\n`;
      }
    }
    return xml;
  }

  escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}