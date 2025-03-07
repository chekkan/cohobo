Feature: Initial Setup

  Background:
    Given there are no users in the system

  Scenario: Redirected to setup page
    When an annonymous user navigates to '/' page
    Then the annonymous user is redirected to '/setup' page
  
  Scenario: Setup form submission
    Given an annonymous user navigates to '/setup' page
    When the initial setup form is submitted:
      | Email            | garfield@cohobo.test |
      | Password         | secure_password      |
      | Confirm Password | secure_password      |
    Then the user is redirected to '/' page
    And the 'Logout' link is visible

  Scenario: Password doesn't match confirmation
    Given an annonymous user navigates to '/setup' page
    When the initial setup form is submitted:
      | Email | garfield@cohobo.test |
      | Password | secure_password |
      | Confirm Password | something_else |
    Then the validation error message is displayed
      | Passwords don't match. |

  Scenario: Not valid Email
    Given an annonymous user navigates to '/setup' page
    When the initial setup form is submitted:
      | Email | garfield |
      | Password | secure_password |
      | Confirm Password | secure_password |
    Then the validation error message is displayed
      | Not a valid email. |

