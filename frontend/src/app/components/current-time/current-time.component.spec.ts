/**
 * Current Time Component Test
 * 
 * Filename: current-time.component.spec.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This test suite verifies the functionality of the CurrentTimeComponent by testing 
 * whether the component is created successfully. It uses TestBed from @angular/core/testing 
 * to configure and compile the CurrentTimeComponent for testing. The beforeEach() function 
 * sets up the TestBed configuration and creates a ComponentFixture for the CurrentTimeComponent. 
 * The it() function checks if the component is created successfully by expecting the component 
 * instance to be truthy (i.e., not null or undefined).
 * 
 * Params: None
 * Time Complexity: O(1)
 * Algorithm Strategy: The test suite uses asynchronous beforeEach() function to configure 
 * TestBed and compile the CurrentTimeComponent. It then uses the it() function to test if 
 * the component is created successfully by expecting the component instance to be truthy. 
 * This approach ensures that the component is properly configured and can be instantiated 
 * without errors.
 * 
 */

// Import statements for Angular testing modules
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the component to be tested
import { CurrentTimeComponent } from './current-time.component';

describe('CurrentTimeComponent', () => {
  let component: CurrentTimeComponent;
  let fixture: ComponentFixture<CurrentTimeComponent>;

  beforeEach(async () => {
    // Configure TestBed to compile the CurrentTimeComponent
    await TestBed.configureTestingModule({
      declarations: [CurrentTimeComponent]
    }).compileComponents(); // Compile all components declared in TestBed

    // Create a fixture for the CurrentTimeComponent
    fixture = TestBed.createComponent(CurrentTimeComponent);
    // Get the instance of the CurrentTimeComponent from the fixture
    component = fixture.componentInstance;
    // Detect changes to the component's data-bound properties
    fixture.detectChanges();
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy(); // Expect the component to be truthy (i.e., not null or undefined)
  });
});
