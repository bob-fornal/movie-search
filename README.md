# Movie Search Implementation

This is an implementation of a Movie Search. My intent was to build out something functional with the initial goals below within a 4-day window.

From here, I plan to use this application as a launching-pad to explore and teach various things I learned and want to explore further.

## My Notes & Goals

As a user:

- [x] I can search for movies and see a paginated list of results.
- [x] I can filter search results by genre.
- [x] I can navigate through the next and previous pages of the paginated results.
- [x] I see the total count of search results.
- [x] I see notable information for each search result, such as the summary, poster, duration, rating, etc.

To do:

- [x] Build out API service (REST) to get auth and make the calls for data.
- [x] Build out frontend search (by title only - SELECT).
- [x] Build out frontend retrieve and filter by genre (paged).
- [x] Add page navigation of results with position and totals.
- [x] Build out frontend cards to display notable information based on results.
- [x] Loading Spinner
- [ ] Abstract out Filter & Search Functionality
- [ ] Implement an advanced SELECT that allows for typed input.
- [ ] Build out API service (GraphQL) to get auth and make the calls for data.
- [ ] Unit Tests
- [ ] Automation Pipeline with Integration, Smoke, and Automated Tests.
- [ ] Make the application responsive (mobile ready).
- [ ] Spinner Interceptor

## Interesting or significant to my overall implementation.

* **REST and GraphQL** implementations that I could work with on this project. I've used both, but clearly am stronger with REST implementation.
* **Standalone** versus a **non-Standalone** implementation: I haven't had much call to delve into Standalone with Angular, but recently have been working on a security improvement where lazy-loading wasn't used for speed; it was used for security.
* Minimizing **abstractions** that could be used if this project scaled larger.
* I opted to **search using a SELECT component** (since I captured the full list of titles). This allows me to find the list of records and set the selected movie.
* I love that I can nest CSS and don't need the SCSS implemented on the project.

## Pleased or proud of with my implementation.

* Error Handling on images. I first used a function to handle the absence of an image. I later added the field to those records missing the field in the API service. Later, I found images that didn't exist and implemented an `(error)` handler to the process.
* Use of a clear pattern for Genre Filtering. I've always liked the implementation that Amazon uses and have tried to implement a similar pattern where it fits for clients.

## Next feature or improvement to the project/

### Responsive Design

Make the application mobile ready. In know this wasn't one of my requirements, but I wanted to showcase what I had done to my wife and only had my phone. It worked in landscape mode, mostly.

### Environment Variable Handling

For Angular, this is an area where I struggle. Putting values into an `environment.ts` file that is merged in with the code has always felt wrong. Generally, I am able to integrate a `.env` file, but tried a different approach for this project that didn't work the way I wanted or intended. I left it in (see the [env-node.js](./env-node.js) and [package.json](./package.json) files for the approach tested).

### Filter & Search

The Search & Filter portions should be abstracted out into a component/service approach. This will cleanly allow the system to trigger calls for new or updated data to be displayed.

This is an area that can get "out-of-hand" if not approached properly. I opted for a simple inline approach; will improve this part.

### Implement Improved Selection Tool

The selection tool is a simple select. This should be improved to allow the user to search via input, allowing the dropdown to adjust based on what is entered.

### Test Coverage

Given the time that I allowed myself, a comprehensive suite of Unit Tests, Integration Tests, Automated Tests, and Smoke Tests are not feasible.

### Automation Pipeline

Given the time that I allowed myself, I opted for Vercel's pipeline for simplicity.

### Landing Page Abstractions

Additionally, there wound up being more logic in the component than I would prefer. Some of this (setting the filtered titles when a Genre is selected for example) should be moved out of the component.

There are a few places here where abstracting would clean up the overall presentation and management of the project, such as the display of the movie information (I did abstract this one to showcase the cleaner code and ability to shift logic out to make the structure more readable). These shifts are necessary for readability and management of the project over time.

### HttpInterceptor for Spinner

I used a straight service-based approach for the management of the spinner. This can be enhanced with an HttpInterceptor. For simplicity, I left this out but do want to explore the functional-based approach. This is one of the few cases where we have choices in the Angular framework tooling.
