/**
 * App Component Tests
 * 
 * Filename: app.component.spec.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description:
 * This file contains unit tests for the AppComponent.
 * It tests the creation of the component, the title property, and the rendering of the title in the template.
 * 
 * Algorithm Strategy:
 * 1. Use TestBed.configureTestingModule() to configure the testing module.
 * 2. Import necessary testing modules like RouterTestingModule for routing.
 * 3. Define the component and its dependencies in the TestBed configuration.
 * 4. Test whether the component is created successfully using TestBed.createComponent().
 * 5. Test the title property of the component.
 * 6. Test the rendering of the title in the component's template.
 * 
 * Params:
 * - TestBed: TestBed - Angular module for configuring testing environments.
 * - RouterTestingModule: RouterTestingModule - Angular module for configuring router testing environments.
 * - AppComponent: AppComponent - Main component of the application.
 */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
  });
});
