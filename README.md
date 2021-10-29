# Algorithms in Action

This is most recent version added by the students from Semester 1 2021 COMP90082_2021 Software Project. 

## Organisation of folders

- src/\
    Source code of the web app.
- docs/\
    Contains all the documentation related to the app, can also be found on Confluence.
    1. Home.pdf
    2. Requirements.pdf
    3. Ceremonies.pdf
    4. Overall Plan.pdf
    5. Sprint 1A.pdf
    6. Sprint 1B.pdf
    7. Sprint 1C.pdf
    8. Sprint 2.pdf
    9. Meetings.pdf
    10. System Design.pdf
    11. Development Manual.pdf
    12. User Guide.pdf
    13. Coding Standards.pdf
    14. Releases.pdf
    15. Decisions.pdf
    16. Future work.pdf
    17. Handover.pdf
- tests/\
    Contains the test documents created for the tests conducted.
    1. Acceptance Testing.pdf
    2. System Testing.pdf
- ui/\
    Contains all the images and graphics used for the project.
    
 ## Links to Tools
   
   - Confluence space - https://confluence.cis.unimelb.edu.au:8443/pages/viewpage.action?spaceKey=COMP900822021SM1AI&title=Home
   - Trello board of Team 1 - https://trello.com/b/bZg5jbnU/team1-aia
   - Trello board of Team 2 - https://trello.com/b/DEmVmKB1/aia
   - Slack channel - https://comp90082-aia.slack.com/archives/C01PYTZKAMA
   - Demo of the app - https://algorithms-in-action-staging.herokuapp.com/

## Deployment

Algorithms in Action is written in JavaScript, using the React framework. To work on it locally, you will need to install Node.js on your machine. Node.js is a JavaScript runtime that will allow us to view the website locally. NPM (Node package manager) is installed alongside when Node is installed. It is a multipurpose tool that will install 3rd party dependencies, start the app, and run test suites.

**First-time Setup**

Ensure you have node version 12.x and npm version 6.x

To verify, type the following commands in your terminal/ command prompt -

`node --version`

`npm --version`

Navigate to the root directory of the project and run `npm install` to install all the dependencies in package.json

**Running a local development server**

Navigate to the root directory of the project and run `npm start` this will start the development server on your local machine on port 3000. The application will be launched automatically in your default browser at http://localhost:3000

## Demo

We currently have an accessible link to the application via: https://algorithms-in-action-staging.herokuapp.com/

The link above includes changes made by teams at the end of each sprint and is accessible to anyone who has the link. The version of the algorithm in action web application in the above link tracks the changes made to the `dev` branch in the Github repository. When a pull request is submitted, approved, and merged into the `dev` branch from respective team branches, the application will be redeployed with the updated changes.
   
## Changelog 
   
   *SPRINT 2*
   
   - team1_dev (merged team 1 branches of Sprint 2)
   - team2_dev (merged team 2 branches of Sprint 2)
   - US_13_CHOOSE_PIVOT (updated from last Sprint)
   - US_16_DISPLAY_SORTED_ARRAY (updated from last Sprint)
   - US_24A_ADD_MATRIX_TC
   - US_24B_ADD_MATRIX_ANIMATION_TC
   - US_25_ADD_PESUDOCODE_M3
   - US_26_ADD_ANIMATION_M3 (US_27 combined with this)
   - US_28_ADD_STRING_SEARCH (US_29, US_30, US_31, US_32 combined with this)
   - US_33_FIX_ANIMATION_BUG
   - US_34_FIX_INDENTATION_BUG
   - Functional requirements (added new requirements of Sprint 2)
   - User Stories (added Sprint 2 user stories)
   - Product Backlog (added Sprint 2 user stories estimate)
   - Overall Plan (updated dates for Sprint 2)
   - Sprint 2 Backlog
   - Sprint 2 Ceremonies
   - Team meeting minutes (added minutes for combined meetings)
   - System Design (updated Use Case Diagram)
   - User Guide
   - Testing (added reasons for failure and Sprint 2 user stories in Acceptance testing)
   - Releases (added Sprint 2 release)
   - Future work (added unfinished user stories and last minute changes added by clients)
   - Decisions (added Sprint 2 improvements to client improvements doc)
   
## User Stories implemented in this sprint
<table class="wrapped confluenceTable tablesorter" data-tf-ready="true"><colgroup><col /><col /><col /><col /><col /><col /></colgroup><tbody class=""><tr class="tablesorter-header"><th class="confluenceTh tablesorter-header" colspan="1" width="" data-column="0">FEATURE</th><th class="confluenceTh tablesorter-header" style="width: 85.0px;" data-column="1"><span style="color: #172b4d; text-decoration: none;">STORY ID</span></th><th class="confluenceTh tablesorter-header" style="width: 970.0px;" data-column="2">TASK</th><th class="confluenceTh tablesorter-header" style="width: 138.0px;" data-column="3"><span style="color: #172b4d; text-decoration: none;">STORY ESTIMATE</span></th><th class="confluenceTh tablesorter-header" style="width: 98.0px;" data-column="4"><span style="color: #172b4d; text-decoration: none;">PRIORITY</span></th><th class="confluenceTh tablesorter-header" style="width: 114.0px;" data-column="5"><span style="color: #172b4d; text-decoration: none;">ASSIGNED TO</span></th></tr><tr><td class="confluenceTd" width=""><strong>QUICKSORT</strong></td><td class="confluenceTd" style="text-align: center;" width="">13</td><td class="confluenceTd" style="text-align: center; width: 970.0px;"><p><span>Add alternatives for choosing pivot element -&nbsp;</span><span>Rightmost (and&nbsp;</span>Median of three as checkboxes</p></td><td class="confluenceTd" style="text-align: center; width: 138.0px;">4</td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 1</td></tr><tr><td class="confluenceTd" width=""><br /></td><td class="confluenceTd" style="text-align: center;" width="">16</td><td class="confluenceTd" style="width: 85.0px; text-align: center;">A sorted version of array should be displayed at the bottom of the diagram for comparison.</td><td class="confluenceTd" style="text-align: center; width: 970.0px;">3</td><td class="confluenceTd" style="text-align: center; width: 138.0px;">Must have</td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Team 1</td></tr><tr><td class="confluenceTd" colspan="1" width=""><strong>TRANSITIVE CLOSURE</strong></td><td class="confluenceTd" style="text-align: center; width: 85.0px;">24A</td><td class="confluenceTd" style="text-align: center; width: 970.0px;"><span style="color: #172b4d;">Add a matrix in the middle panel.</span></td><td class="confluenceTd" style="text-align: center; width: 138.0px;"><span style="color: #172b4d;">2</span></td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 1</td></tr><tr><td class="confluenceTd" colspan="1" width=""><br /></td><td class="confluenceTd" style="text-align: center; width: 85.0px;">24B</td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add animation to the matrix such that values change from 0 to 1 when a&nbsp; path between "i" and "j" is found.&nbsp;</td><td class="confluenceTd" style="text-align: center; width: 138.0px;">2</td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 1</td></tr><tr><td class="confluenceTd" colspan="1" width=""><strong>QUICKSORT - MEDIAN OF THREE</strong></td><td class="confluenceTd" style="text-align: center; width: 85.0px;">25</td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add the pseudocode for the Median of Three algorithm in the right panel.</td><td class="confluenceTd" style="text-align: center; width: 138.0px;"><span style="color: #172b4d;">3</span></td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 1</td></tr><tr><td class="confluenceTd" colspan="1" width=""><br /></td><td class="confluenceTd" style="text-align: center; width: 85.0px;"><span style="color: #172b4d;">26</span></td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add animation for the Median of Three against the pseudocode in the middle panel.</td><td class="confluenceTd" style="text-align: center; width: 138.0px;"><span style="color: #172b4d;">3</span></td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 1</td></tr><tr><td class="confluenceTd" colspan="1" width=""><br /></td><td class="confluenceTd" style="text-align: center; width: 85.0px;"><span style="color: #172b4d;">27</span></td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add on click events to checkboxes for "Median of three" and "Rightmost". After selecting the box, the pseudocode specific to the button must appear in the right panel.</td><td class="confluenceTd" style="text-align: center; width: 138.0px;"><span style="color: #172b4d;">1</span></td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 1</td></tr><tr><td class="confluenceTd" colspan="1" width=""><strong>BRUTE FORCE STRING SEARCH</strong></td><td class="confluenceTd" style="text-align: center; width: 85.0px;"><span style="color: #172b4d;">28</span></td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add a brute force string algorithm.&nbsp;</td><td class="confluenceTd" style="text-align: center; width: 138.0px;"><span style="color: #172b4d;">4</span></td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 2</td></tr><tr><td class="confluenceTd" colspan="1" width=""><br /></td><td class="confluenceTd" style="text-align: center; width: 85.0px;">29</td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add Brute Force String Search to the left panel under the heading "Searching".</td><td class="confluenceTd" style="text-align: center; width: 138.0px;">1</td><td class="confluenceTd" style="width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 2</td></tr><tr><td class="confluenceTd" colspan="1" width=""><br /></td><td class="confluenceTd" style="text-align: center; width: 85.0px;">30</td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add background and pseudocode of the algorithm to the right panel.</td><td class="confluenceTd" style="text-align: center; width: 138.0px;">3</td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 2</td></tr><tr><td class="confluenceTd" colspan="1" width=""><br /></td><td class="confluenceTd" style="text-align: center; width: 85.0px;">31</td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add animation of the algorithm to the middle panel.</td><td class="confluenceTd" style="text-align: center; width: 138.0px;">2</td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 2</td></tr><tr><td class="confluenceTd" colspan="1" width=""><br /></td><td class="confluenceTd" style="text-align: center; width: 85.0px;">32</td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add instructions of the algorithm to the middle panel before it can be played.</td><td class="confluenceTd" style="text-align: center; width: 138.0px;">1</td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 2</td></tr><tr><td class="confluenceTd" colspan="1" width=""><strong>GENERAL BUGS</strong></td><td class="confluenceTd" style="text-align: center; width: 85.0px;"><span style="color: #172b4d;">33</span></td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Solve the animation lagging issue of the algorithm present in the right panel.</td><td class="confluenceTd" style="text-align: center; width: 138.0px;"><span style="color: #172b4d;">3</span></td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 2</td></tr><tr><td class="confluenceTd" colspan="1" width=""><br /></td><td class="confluenceTd" style="text-align: center; width: 85.0px;">34</td><td class="confluenceTd" style="text-align: center; width: 970.0px;">Add correct indentation of the pseudocode in the right panel under the "code" section.&nbsp;</td><td class="confluenceTd" style="text-align: center; width: 138.0px;"><span style="color: #172b4d;">3</span></td><td class="confluenceTd" style="text-align: center; width: 98.0px;">Should have</td><td class="confluenceTd" style="text-align: center; width: 114.0px;">Team 2</td></tr></tbody></table>

