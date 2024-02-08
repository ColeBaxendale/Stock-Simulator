/**
 * Portfolio Component Test
 * 
 * Filename: portfolio.component.spec.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This test suite verifies the functionality of the PortfolioComponent by testing 
 * whether the component is created successfully. It uses TestBed from @angular/core/testing 
 * to configure and compile the PortfolioComponent for testing. The beforeEach() function 
 * sets up the TestBed configuration and creates a ComponentFixture for the PortfolioComponent. 
 * The it() function checks if the component is created successfully by expecting the component 
 * instance to be truthy (i.e., not null or undefined).
 * 
 * Params: None
 * Time Complexity: O(1)
 * Algorithm Strategy: The test suite uses asynchronous beforeEach() function to configure 
 * TestBed and compile the PortfolioComponent. It then uses the it() function to test if 
 * the component is created successfully by expecting the component instance to be truthy. 
 * This approach ensures that the component is properly configured and can be instantiated 
 * without errors.
 * 
 */

// Import statements for Angular testing modules
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the component to be tested
import { PortfolioComponent } from './portfolio.component';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent; // Declare a variable to hold the component instance
  let fixture: ComponentFixture<PortfolioComponent>; // Declare a variable to hold the component fixture

  beforeEach(async () => {
    // Asynchronously configure TestBed before each test
    await TestBed.configureTestingModule({
      declarations: [PortfolioComponent] // Declare the component to be tested
    })
    .compileComponents(); // Compile the component's template and css

    // Create a component fixture for the PortfolioComponent
    fixture = TestBed.createComponent(PortfolioComponent);
    // Get the component instance associated with the fixture
    component = fixture.componentInstance;
    // Trigger change detection to initialize the component
    fixture.detectChanges();
  });

  // Unit test: Ensure that the component is created successfully
  it('should create', () => {
    // Expect the component instance to be truthy (i.e., not null or undefined)
    expect(component).toBeTruthy();
  });
});
