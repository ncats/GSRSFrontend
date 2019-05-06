# Adding Substance Details Cards

- Core code (in the ./src/app/core directory) should never be touched
- How substance cards work:
    - Cards are dynamic, lazy-loaded pieces of code that are only added to the application when needed (they're not part of the main application code/chunk)
    - In order for the card to be included in a certain substance details page, it has to be associated with a filter function that returns 'true' when called
    - 