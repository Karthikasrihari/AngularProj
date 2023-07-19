import { AbstractControl } from "@angular/forms";
import { AngularEditorConfig } from "@kolkov/angular-editor";

export class IconUtils{
    static validateEmail(control: AbstractControl) {
        let pattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$');
        if (control.value) {
          let valid = pattern.test(control.value);
          if (!valid) {
            return {
              invalidEmail: true,
            };
          }
        }
        return null;
      }
      static getMailBodyEditorConfig(): AngularEditorConfig {
        const config: AngularEditorConfig = {
          editable: true,
          spellcheck: true,
          height: '10rem',
          minHeight: '5rem',
          placeholder: 'Enter text here...',
          translate: 'no',
          defaultParagraphSeparator: 'p',
          defaultFontName: 'Arial',
          sanitize: true,
          toolbarPosition: 'top',
          toolbarHiddenButtons: [
            ['subscript', 'superscript', 'indent', 'outdent'],
            [
              'customClasses',
              'link',
              'unlink',
              'insertImage',
              'insertVideo',
              'removeFormat',
              'toggleEditorMode',
            ],
          ],
        };
        return config;
      }
    
    
}