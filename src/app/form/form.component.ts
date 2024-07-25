import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentData, DynamicForm } from '../firestore.service';
import { StylesService } from '../styles.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  note2 =
    'Prämienberechtigt für 2022 sind alle unbeschränkt einkommensteuerpflichtigen Personen, die vor dem 2. 1.2007 geboren oder Vollwaisen sind...';
  note3 =
    'Bausparbeiträge, die vermögenswirksame Leistungen sind, werden vorrangig durch Gewährung einer Arbeitnehmer-Sparzulage gefördert...';

  form: FormGroup;
  documentId: string | null = null; // Variable to store document ID
  jahr!: number; // Variable to store year for form date
  bausparkasse!: string; // Variable to store bausparkasse for css
  dynamicClass!: string;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    public stylesService: StylesService
  ) {
    this.form = this.fb.group({
      taxID: [{ value: '', disabled: true }, Validators.required],
      identifikationsnummerEhegatte: [{ value: '', disabled: true }, Validators.required],
      familienname: [{ value: '', disabled: true }, Validators.required],
      vorname: [{ value: '', disabled: true }, Validators.required],
      geburtsdatum: [{ value: '', disabled: true }, Validators.required],
      partnerFamilienname: [{ value: '', disabled: true }],
      partnerVorname: [{ value: '', disabled: true }],
      partnerGeburtsdatum: [{ value: '', disabled: true }],
      strasse: [{ value: '', disabled: true }, Validators.required],
      hausnummer: [{ value: '', disabled: true }, Validators.required],
      stadt: [{ value: '', disabled: true }, Validators.required],
      bundesland: [{ value: '', disabled: true }, Validators.required],
      postleitzahl: [{ value: '', disabled: true }, Validators.required],
      familienstand: [{ value: '', disabled: true }, Validators.required],
      dynamicForms: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.fetchDocumentData(uid);
      this.documentId = uid;
    }
  }

  get dynamicForms() {
    return this.form.get('dynamicForms') as FormArray;
  }

  private async fetchDocumentData(uid: string): Promise<void> {
    try {
      const docSnapshot = await this.firestore.collection('wohnungsbaupraemie').doc(uid).get().toPromise();
      if (docSnapshot?.exists) {
        const data = docSnapshot.data() as DocumentData;
        if (data) {
          this.jahr = parseInt(data.jahr, 10);
          this.bausparkasse = data.bausparkasse;
          this.dynamicClass = this.stylesService.getClass(this.bausparkasse); // Set the dynamic class

          this.form.patchValue({
            taxID: data.taxID,
            identifikationsnummerEhegatte: data.identifikationsnummerEhegatte,
            familienname: data.familienname,
            vorname: data.vorname,
            geburtsdatum: data.geburtsdatum,
            partnerFamilienname: data.partnerFamilienname,
            partnerVorname: data.partnerVorname,
            partnerGeburtsdatum: data.partnerGeburtsdatum,
            strasse: data.strasse,
            hausnummer: data.hausnummer,
            stadt: data.stadt,
            bundesland: data.bundesland,
            postleitzahl: data.postleitzahl,
            familienstand: data.familienstand,
          });

          const dynamicFormsArray = this.form.get('dynamicForms') as FormArray;
          if (data.dynamicForms) {
            data.dynamicForms.forEach((dynamicForm: DynamicForm) => {
              const formGroup = this.fb.group({
                vertragsnummer: [{ value: dynamicForm.vertragsnummer, disabled: true }],
                abschlussdatum: [{ value: dynamicForm.abschlussdatum, disabled: true }],
                bausparsumme: [{ value: dynamicForm.bausparsumme, disabled: false }],
                bausparbeitrag: [{ value: dynamicForm.bausparbeitrag, disabled: true }],
                hoechstbetrag: [{ value: dynamicForm.hoechstbetrag, disabled: true }],
                vermoegenswirksameLeistungen: [{ value: dynamicForm.vermoegenswirksameLeistungen, disabled: true }],
              });
              dynamicFormsArray.push(formGroup);
            });
          }
        }
      } else {
        console.error('No document found with the specified UID');
      }
    } catch (error) {
      console.error('Error fetching document data:', error);
    }
  }

  // Helper function to include disabled form controls
  getFormValuesWithDisabled(formGroup: FormGroup): any {
    const rawValues: { [key: string]: any } = {};
    for (const controlName in formGroup.controls) {
      const control = formGroup.get(controlName);
      if (control instanceof FormArray) {
        rawValues[controlName] = control.controls.map(control => this.getFormValuesWithDisabled(control as FormGroup));
      } else {
        rawValues[controlName] = control?.value;
      }
    }
    return rawValues;
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.documentId) {
        // Prepare the main form data with the 'status' field
        const formData = { ...this.getFormValuesWithDisabled(this.form), status: 'submitted' };

        // Update the existing document
        this.firestore.collection('wohnungsbaupraemie').doc(this.documentId).update(formData)
          .then(() => {
            console.log('Main form data updated in Firestore');

            const dynamicFormsPromises = this.dynamicForms.controls.map(
              (form, index) =>
                this.firestore
                  .collection('wohnungsbaupraemie')
                  .doc(this.documentId!)
                  .collection('dynamicForms')
                  .doc(index.toString())
                  .set(this.getFormValuesWithDisabled(form as FormGroup)) // Use .set() to update dynamic forms
                  .then(() => {
                    console.log(`Dynamic form ${index + 1} updated successfully`);
                  })
                  .catch((error) => {
                    console.error(
                      `Error updating dynamic form ${index + 1}`,
                      error
                    );
                  })
            );

            return Promise.all(dynamicFormsPromises);
          })
          .then(() => {
            console.log('All data updated in Firestore');
            this.router.navigate(['/form-sent-notification']);
          })
          .catch((error) => {
            console.error('Error updating main form data in Firestore', error);
          });
      } else {
        alert('No document ID found.');
      }
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}
