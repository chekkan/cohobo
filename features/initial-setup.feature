Feature: Initial Setup

  Scenario: Redirected to setup page
    Given there are no users in the system
    When an annonymous user navigates to '/' page
    Then the annonymous user is redirected to '/setup' page
  
  Scenario: Setup form submission
    Given there are no users in the system
    And an annonymous user navigates to '/setup' page
    When the initial setup form is submitted:
      | Email            | garfield@cohobo.test |
      | Password         | secure_password      |
      | Confirm Password | secure_password      |
    Then the user is redirected to '/' page
    And the 'Logout' link is visible

  Scenario: Setup form validation
    Given there are no users in the system
    And an annonymous user navigates to '/setup' page
    When the initial setup form is submitted:
      | Email            | garfield        |
      | Password         | secure_password |
      | Confirm Password | something_else  |
    Then the validation error messages are displayed
      | Not a valid email.     |
      | Passwords don't match. |

  Scenario: Setup page not available if already setup
    Given the user
      | Email    | garfield@cohobo.test |
      | Password | secure_password      |
    When a user navigates to '/setup' page
    Then response is 404 - not found
