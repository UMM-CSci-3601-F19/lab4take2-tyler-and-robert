import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// This line (combined with the function that follows) is here for us
// to be able to see what happens (part of slowing things down)
// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  // This delay is only put here so that you can watch the browser do its thing.
  // If you're tired of it taking long you can remove this call or change the delay
  // to something smaller (even 0).
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(100);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage();
  });

  it('should get and highlight Todos title attribute ', () => {
    page.navigateTo();
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('should type something in filter owner box and check that it returned correct element', () => {
    page.navigateTo();
    page.typeAOwner('b');
    expect(page.getUniqueTodo('Deserunt velit reprehenderit deserunt sunt excepteur sit eu eiusmod in voluptate aute minim mollit. Esse aliqua esse officia do proident non consequat non mollit.')).toEqual('Barry');
    page.backspace();
    page.typeAOwner('roberta');
    expect(page.getUniqueTodo('Pariatur ea et incididunt tempor eu voluptate laborum irure cupidatat adipisicing. Consequat occaecat consectetur qui culpa dolor.')).toEqual('Roberta');
  });

  it('should click on the status 27 times and return 3 elements then ', () => {
    page.navigateTo();
    page.typeAStatus('true');

    expect(page.getUniqueTodo('Nostrud ullamco labore exercitation magna. Excepteur aute aliqua veniam veniam nisi eu occaecat ea magna do.')).toEqual('Blanche');

    expect(page.getUniqueTodo('Nisi sit non non sunt veniam pariatur. Elit reprehenderit aliqua consectetur est dolor officia et adipisicing elit officia nisi elit enim nisi.')).toEqual('Barry');
  });

  it('Should open the expansion panel and get the category', () => {
    page.navigateTo();
    page.getCategory('video games');
    browser.actions().sendKeys(Key.ENTER).perform();

    expect(page.getUniqueTodo('Pariatur ea et incididunt tempor eu voluptate laborum irure cupidatat adipisicing. Consequat occaecat consectetur qui culpa dolor.')).toEqual('Roberta');

    // This is just to show that the panels can be opened
    browser.actions().sendKeys(Key.TAB).perform();
    browser.actions().sendKeys(Key.ENTER).perform();
  });

  it('Should allow us to filter todos based on category', () => {
    page.navigateTo();
    page.getCategory('groceries');
    page.getTodos().then((todos) => {
      expect(todos.length).toBe(76);
    });
  });

  it('Should allow us to search for category, update that search string, and then still successfully search', () => {
    page.navigateTo();
    page.getCategory('b');
    page.getTodos().then((todos) => {
      expect(todos.length).toBe(94);
    });
    page.field('todoCategory').sendKeys('a');
    page.click('submit');
    page.getTodos().then((todos) => {
      expect(todos.length).toBe(51);
    });
  });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

  it('Should have an add todo button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('addNewTodo')).toBeTruthy();
  });

  it('Should open a dialog box when add todo button is clicked', () => {
    page.navigateTo();
    expect(page.elementExistsWithCss('add-todo')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewTodo');
    expect(page.elementExistsWithCss('add-todo')).toBeTruthy('There should be a modal window now');
  });

  describe('Add Todo', () => {

    beforeEach(() => {
      page.navigateTo();
      page.click('addNewTodo');
    });

    it('Should actually add the todo with the information we put in the fields', () => {
      page.navigateTo();
      page.click('addNewTodo');
      page.field('ownerField').sendKeys('Morris');
      // Need to clear the status field because the default value is -1.
      page.field('statusField').clear();
      page.field('statusField').sendKeys('false');
      page.field('categoryField').sendKeys('school');
      page.field('bodyField').sendKeys('University of Minnesota Morris');
      expect(page.button('confirmAddTodoButton').isEnabled()).toBe(true);
      page.click('confirmAddTodoButton');

      /*
       * This tells the browser to wait until the (new) element with ID
       * 'tracy@awesome.com' becomes present, or until 10,000ms whichever
       * comes first. This allows the test to wait for the server to respond,
       * and then for the client to display this new todo.
       * http://www.protractortest.org/#/api?view=ProtractorExpectedConditions
       */
      const morris_element = element(by.id('University of Minnesota Morris'));
      browser.wait(protractor.ExpectedConditions.presenceOf(morris_element), 10000);

      expect(page.getUniqueTodo('University of Minnesota Morris')).toMatch('Morris.*'); // toEqual('Tracy Kim');
    });

    describe('Add Todo (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add todo dialog', () => {
        expect(page.field('ownerField').isPresent()).toBeTruthy('There should be a owner field');
        page.field('ownerField').sendKeys('St. Thomas');
        expect(element(by.id('statusField')).isPresent()).toBeTruthy('There should be an status field');
        // Need to clear this field because the default value is -1.
        page.field('statusField').clear();
        page.field('statusField').sendKeys('false');
        expect(page.field('categoryField').isPresent()).toBeTruthy('There should be a category field');
        page.field('categoryField').sendKeys('school');
        expect(page.field('bodyField').isPresent()).toBeTruthy('There should be an body field');
        page.field('bodyField').sendKeys('Another school.');
      });

      it('Should show the validation error message about status being required', () => {
        expect(element(by.id('statusField')).isPresent()).toBeTruthy('There should be an status field');
        page.field('statusField').clear();
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('ownerField').click();
        expect(page.getTextFromField('status-error')).toBe('Status is required');
      });

      it('Should show the validation error message about owner being required', () => {
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be a owner field');
        // '\b' is a backspace, so this enters an 'A' and removes it so this
        // field is "dirty", i.e., it's seen as having changed so the validation
        // tests are run.
        page.field('ownerField').sendKeys('A\b');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('statusField').click();
        expect(page.getTextFromField('owner-error')).toBe('Owner is required');
      });

      it('Should show the validation error message about the format of owner', () => {
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an owner field');
        page.field('ownerField').sendKeys('Don@ld Jones');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('statusField').click();
        expect(page.getTextFromField('owner-error')).toBe('Owner must contain only numbers and letters');
      });

      it('Should show the validation error message about the owner being taken', () => {
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an owner field');
        page.field('ownerField').sendKeys('abc123');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('statusField').click();
        expect(page.getTextFromField('owner-error')).toBe('Owner has already been taken');
      });

      it('Should allow everything to be added', () => {
        expect(element(by.id('bodyField')).isPresent()).toBeTruthy('There should be an body field');
        page.field('ownerField').sendKeys('Donald Jones');
        page.field('statusField').sendKeys('30');
        page.field('bodyField').sendKeys('donjones.com');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(true);
      });
    });
  });
});

