import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  note2 =
    'Prämienberechtigt für 2022 sind alle unbeschränkt einkommensteuerpflichtigen Personen, die vor dem 2. 1.2007 geboren oder Vollwaisen sind...';
  note3 =
    'Bausparbeiträge, die vermögenswirksame Leistungen sind, werden vorrangig durch Gewährung einer Arbeitnehmer-Sparzulage gefördert...';

  form: FormGroup;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.form = this.fb.group({
      taxID: ['', Validators.required],
      identifikationsnummerEhegatte: ['', Validators.required],
      familienname: ['', Validators.required],
      vorname: ['', Validators.required],
      geburtsdatum: ['', Validators.required],
      partnerFamilienname: [''],
      partnerVorname: [''],
      partnerGeburtsdatum: [''],
      strasse: ['', Validators.required],
      hausnummer: ['', Validators.required],
      stadt: ['', Validators.required],
      bundesland: ['', Validators.required],
      postleitzahl: ['', Validators.required],
      familienstand: ['', Validators.required],
      dynamicForms: this.fb.array([]),
    });

    this.addForm(); // Initialize with one form
  }

  get dynamicForms() {
    return this.form.get('dynamicForms') as FormArray;
  }

  addForm(): void {
    const dynamicForm = this.fb.group({
      vertragsnummer: [''],
      abschlussdatum: [''],
      bausparsumme: [''],
      bausparbeitrag: [''],
      hoechstbetrag: [''],
      vermoegenswirksameLeistungen: [''],
    });

    this.dynamicForms.push(dynamicForm);
  }

  removeForm(index: number): void {
    if (this.dynamicForms.length > 1) {
      this.dynamicForms.removeAt(index);
    } else {
      alert('At least one form is required.');
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.firestore
        .collection('wohnungsbaupraemie')
        .add(this.form.value)
        .then((docRef) => {
          console.log('Main form data saved to Firestore', docRef.id);

          const dynamicFormsPromises = this.dynamicForms.controls.map(
            (form, index) =>
              this.firestore
                .collection('wohnungsbaupraemie')
                .doc(docRef.id)
                .collection('dynamicForms')
                .add(form.value)
                .then(() => {
                  console.log(`Dynamic form ${index + 1} saved successfully`);
                })
                .catch((error) => {
                  console.error(
                    `Error saving dynamic form ${index + 1}`,
                    error
                  );
                })
          );

          return Promise.all(dynamicFormsPromises);
        })
        .then(() => {
          console.log('All data saved to Firestore');
          this.router.navigate(['/form-sent-notification']);
        })
        .catch((error) => {
          console.error('Error saving main form data to Firestore', error);
        });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}
