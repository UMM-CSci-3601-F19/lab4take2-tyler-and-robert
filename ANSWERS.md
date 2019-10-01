## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. The server sets up the page and implements the mongo database where the UserController handles the 
filtering and the addition of additional users to the database.
2. Take the given id and searches through the json file for the given id and 
returns the user if the id is a valid id.
3. Given a target age we use filterDoc as a holder page and compare the age of users
to the targetAge then returning all that match.
4. Document objects come the bson import (binary JSON). We are using them in a way
to filter users/todos as well as in a comparable way (iterator). 
5. Clears the current DB and adds 3 fake users for the given tests.
6. Its going through the given input and finding the amount of users that are
   37 years old. It should result in 2. It is also checking to see if the names
   returned are accurate. This is done by filtering the DB which expects two users to be 37
   and named Jamie and Pat.
7. The gathered information goes through the UserRequestHandler first which
then sends it to UserController for final addition to the database. UserController
also checks to see if the given information is valid.