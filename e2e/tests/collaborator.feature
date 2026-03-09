Feature: Collaborator Management

  As a manager
  I want to manage collaborators
  So that I can track my team members

  Background:
    Given I am logged in as a manager
    And I am on the dashboard page

  Scenario: Create a new collaborator
    When I click on "Add Collaborator" button
    And I fill in the collaborator form with:
      | Field      | Value        |
      | First name | John         |
      | Last name  | Doe          |
    And I click the "Save" button
    Then I should see "John Doe" in the collaborators list

  Scenario: List collaborators
    Given I have created the following collaborators:
      | First name | Last name |
      | Alice      | Smith     |
      | Bob        | Johnson   |
    When I view the collaborators list
    Then I should see "Alice Smith" in the list
    And I should see "Bob Johnson" in the list
