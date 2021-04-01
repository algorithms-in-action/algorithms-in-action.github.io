# Algorithms in Action

This is the forked repository of algorithms-in-action/algorithms-in-action.github.io for the teams working on this application during SEM 1 COMP90082_2021 Software Project subject. 

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
    6. Meetings.pdf
    7. System Design.pdf
    8. Coding Standards.pdf
    9. Releases.pdf
    10. Decisions.pdf
- tests/\
    Contains the test documents created for the tests conducted.
    1. Acceptance Testing.pdf
- ui/\
    Contains all the images and graphics used for the project.
    
   ## Links to Tools
   
   - Confluence space - https://confluence.cis.unimelb.edu.au:8443/pages/viewpage.action?spaceKey=COMP900822021SM1AI&title=Home
   - Trello board of Team 1 - https://trello.com/b/bZg5jbnU/team1-aia
   - Trello board of Team 2 - 
   - Slack channel - https://comp90082-aia.slack.com/archives/C01PYTZKAMA
   
   ## Changelog 
   
   *SPRINT 1A*
   
   - US_01_ADD_MODES
   - US_02_SPEED_SLIDER
   - US_O3_ADD_PROGRESS_BAR
   - US_17_CHANGE_LABELS_FOR_VIEWS
   - US_20_ADD_RESET_BUTTON
   - Home
   - Project Overview
   - Functional Requirements
   - Non-functional Requirements
   - Motivational Model
   - Personas
   - User Stories
   - Product Backlog
   - Ceremonies
   - Timeline
   - Sprint 1A Backlog
   - Sprint 1A Ceremonies
   - Client Meeting minutes
   - Team Meeting minutes
   - High Level Architecture
   - Component Design
   - Use Case Diagram
   - Acceptance Testing
   - Coding Standards
   - Communication Tool
   - Releases

## USER STORIES IMPLEMENTED IN THIS SPRINT

<table class="relative-table wrapped confluenceTable"><colgroup><col style="width: 12.7425%;" /><col style="width: 5.6183%;" /><col style="width: 34.6945%;" /><col style="width: 7.52968%;" /><col style="width: 14.596%;" /><col style="width: 24.6742%;" /></colgroup><tbody><tr><th class="confluenceTh" style="text-align: center;"><span style="color: #172b4d; text-decoration: none;">FEATURE</span></th><th class="confluenceTh" style="text-align: center;"><span style="color: #172b4d; text-decoration: none;">STORY ID</span></th><th class="confluenceTh" style="text-align: center;">TASK</th><th class="confluenceTh" style="text-align: center;"><span style="color: #172b4d; text-decoration: none;">STORY ESTIMATE</span></th><th class="confluenceTh" style="text-align: center;" colspan="1"><span style="color: #172b4d; text-decoration: none;">PRIORITY</span></th><th class="confluenceTh" style="text-align: center;"><span style="color: #172b4d; text-decoration: none;">ASSIGNED TO</span></th></tr><tr><td class="confluenceTd" style="text-align: center;" rowspan="3"><strong style="text-decoration: none; text-align: left;">INTERFACE</strong><br /><br /></td><td class="confluenceTd" style="text-align: center;">01</td><td class="confluenceTd" style="text-align: center;">Clearly indicate the two different modes of Binary Search Tree(<span style="color: #172b4d; text-decoration: none;">Insert and Search</span>).</td><td class="confluenceTd" style="text-align: center;">1</td><td class="confluenceTd" style="text-align: center;" colspan="1"><span style="color: #172b4d; text-decoration: none;">Should have</span></td><td class="confluenceTd" style="text-align: center;">Team 1</td></tr><tr><td class="confluenceTd" style="text-align: center;">02</td><td class="confluenceTd" style="text-align: center;">Label the speed slider as SPEED.</td><td class="confluenceTd" style="text-align: center;">1</td><td class="confluenceTd" style="text-align: center;" colspan="1"><span style="color: #172b4d; text-decoration: none;">Should have</span></td><td class="confluenceTd" style="text-align: center;">Team 1</td></tr><tr><td class="confluenceTd" style="text-align: center;">03</td><td class="confluenceTd" style="text-align: center;">Simplified the existing progress component to a progress bar which indicates <span style="color: #172b4d; text-decoration: none;">how long the algorithm is going to take to run.</span>&nbsp;</td><td class="confluenceTd" style="text-align: center;">2</td><td class="confluenceTd" style="text-align: center;" colspan="1"><p>Must have</p></td><td class="confluenceTd" style="text-align: center;">Team 1</td></tr><tr><td class="confluenceTd" style="text-align: center;"><strong>PSEUDO CODE</strong></td><td class="confluenceTd" style="text-align: center;">06</td><td class="confluenceTd" style="text-align: center;">Fix bug in existing code to close the nested blocks can&nbsp;<span style="color: #172b4d; text-decoration: none;">recursively so that the system can jump animation of closed blocks.</span></td><td class="confluenceTd" style="text-align: center;">2</td><td class="confluenceTd" style="text-align: center;" colspan="1">Must have</td><td class="confluenceTd" style="text-align: center;">Team 2</td></tr><tr><td class="confluenceTd" style="text-align: center;"><strong style="text-decoration: none; text-align: left;">HEAPSORT</strong></td><td class="confluenceTd" style="text-align: center;">17</td><td class="confluenceTd" style="text-align: center;">Show the array view and&nbsp;<span style="color: #172b4d; text-decoration: none;">tree view&nbsp;distinctly in Heapsort.</span></td><td class="confluenceTd" style="text-align: center;">1</td><td class="confluenceTd" style="text-align: center;" colspan="1">Must have</td><td class="confluenceTd" style="text-align: center;">Team 1</td></tr><tr><td class="confluenceTd" style="text-align: center;" rowspan="3"><strong style="text-decoration: none; text-align: left;">GRAPH ALGORITHMS</strong><br /><br /></td><td class="confluenceTd" style="text-align: center;">18</td><td class="confluenceTd" style="text-align: center;"><span style="color: #172b4d; text-decoration: none;">Change the '+' and '-' buttons to increasing and decreasing the size of the graph.</span></td><td class="confluenceTd" style="text-align: center;">1</td><td class="confluenceTd" style="text-align: center;" colspan="1">Must have</td><td class="confluenceTd" style="text-align: center;">Team 2</td></tr><tr><td class="confluenceTd" style="text-align: center;">19</td><td class="confluenceTd" style="text-align: center;">Change the "Load" label to "Build graph"</td><td class="confluenceTd" style="text-align: center;">1</td><td class="confluenceTd" style="text-align: center;" colspan="1">Must have</td><td class="confluenceTd" style="text-align: center;">Team 2</td></tr><tr><td class="confluenceTd" style="text-align: center;">20</td><td class="confluenceTd" style="text-align: center;">Dynamically change the label "Build graph" to "Reset" if there exists loaded graph.</td><td class="confluenceTd" style="text-align: center;">1</td><td class="confluenceTd" style="text-align: center;" colspan="1">Must have</td><td class="confluenceTd" style="text-align: center;">Team 2</td></tr></tbody></table>
