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

  Scenario: Edit a collaborator
    Given I have created a collaborator:
      | First name | Last name |
      | John       | Doe       |
    When I click the "Edit" button for "John Doe"
    And I update the collaborator with:
      | Field      | Value     |
      | First name | Jonathan  |
      | Last name  | Dooley   |
    And I click the "Save" button
    Then I should see "Jonathan Dooley" in the collaborators list

  Scenario: Archive a collaborator
    Given I have created a collaborator:
      | First name | Last name |
      | John       | Doe       |
    When I click the "Archive" button for "John Doe"
    Then I should see "Archived" status for "John Doe"

  Scenario: Delete a collaborator
    Given I have created a collaborator:
      | First name | Last name |
      | John       | Doe       |
    When I click the "Delete" button for "John Doe"
    Then I should not see "John Doe" in the collaborators list
