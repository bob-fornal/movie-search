# Movie Search Implementation

This is an implementation of a Movie Search.

## Interesting or significant to my overall implementation.

* It was interesting seeing the REST and GraphQL implementations that I could work with on this project.
* Standalone versus a non-Standalone implementation. I haven't had much call to delve into Standalone with Angular, but recently have been working on a security improvement where lazy-loading wasn't used for speed; it was used for security.
* Minimizing abstractions that could be used if this project scaled larger.
* I love that I can nest CSS and don't need the SCSS implemented on the project.

## Pleased or proud of with my implementation.

* Error Handling on images. I first used a function to handle the absence of an image. I later added the field to those records missing the field in the API service. Later, I found images that didn't exist and implemented an `(error)` handler to the process.

## Next feature or improvement to the project/

### Test Coverage

Given the time that I allowed myself, a comprehensive suite of Unit Tests, Integration Tests, Automated Tests, and Smoke Tests are not feasible.

### Automation Pipeline

Given the time that I allowed myself, I opted for Vercel's pipeline for simplicity.

As a user:

- [ ] I can search for movies and see a paginated list of results.
- [ ] I can filter search results by genre.
- [x] I can navigate through the next and previous pages of the paginated results.
- [ ] I see the total count of search results.
- [x] I see notable information for each search result, such as the summary, poster, duration, rating, etc.

To do:

- [ ] Build out API service (REST) to get auth and make the calls for data.
- [ ] Build out API service (GraphQL) to get auth and make the calls for data.
- [ ] Build out frontend search (by title only?).
- [ ] Build out frontend retrieve and filter by genre (paged?).
- [x] Add page navigation of results with position and totals.
- [ ] Build out frontend cards to display notable information based on results.
- [ ] Loading Spinner
- [ ] Unit Tests
