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
    6. Sprint 1B.pdf
    7. Sprint 1C.pdf
    8. Meetings.pdf
    9. System Design.pdf
    10. Development Manual.pdf
    11. Coding Standards.pdf
    12. Releases.pdf
    13. Decisions.pdf
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

## Deployment

## Demo
   
   ## Changelog 
   
   *SPRINT 1C*
   
   - team1_dev (merged team 1 branches of Sprint 1C)
   - team2_dev (merged team 2 branches of Sprint 1C)
   - US_05_ADD_BASE_CASES
   - US_08_HIGHLIGHT_FOUND_NODES
   - US_10_NEW_NODE_COLLAPSIBLE
   - US_13_CHOOSE_PIVOT
   - US_14_HIGHLIGHT_PIVOT (updated from last sprint)
   - US_15_ADD_POINTERS_QS (updated from last sprint)
   - US_16_DISPLAY_SORTED_ARRAY (updated from last sprint)
   - US_23_ADD_POINTERS_TC
   - Sprint 1C Backlog
   - Sprint 1C Ceremonies
   - Team meeting minutes (added minutes for combined meetings)
   - System Design (updated Component Design and Use Case Diagram, added State and Activity Diagram)
   - Development Manual (added Deployment and Demo)
   - Testing (updated Acceptance Testing and added System Testing)
   - Releases (added Sprint 1C release)
   
## User Stories implemented in this sprint
<table class="relative-table wrapped confluenceTable"><colgroup><col style="width: 12.7425%;" /><col style="width: 5.6183%;" /><col style="width: 34.6945%;" /><col style="width: 7.52968%;" /><col style="width: 14.596%;" /><col style="width: 24.6742%;" /></colgroup><tbody><tr><th class="confluenceTh" style="text-align: center; width: 12.6939%;"><span style="color: #172b4d; text-decoration: none;">FEATURE</span></th><th class="confluenceTh" style="text-align: center; width: 5.57151%;"><span style="color: #172b4d; text-decoration: none;">STORY ID</span></th><th class="confluenceTh" style="text-align: center; width: 34.7501%;">TASK</th><th class="confluenceTh" style="text-align: center; width: 7.52441%;"><span style="color: #172b4d; text-decoration: none;">STORY ESTIMATE</span></th><th class="confluenceTh" style="text-align: center; width: 14.5893%;"><span style="color: #172b4d; text-decoration: none;">PRIORITY</span></th><th class="confluenceTh" style="text-align: center; width: 24.8133%;"><span style="color: #172b4d; text-decoration: none;">ASSIGNED TO</span></th></tr><tr><td class="confluenceTd" style="text-align: center; width: 12.6939%;" rowspan="3"><strong style="text-decoration: none; text-align: left;">BINARY SEARCH TREE</strong><br /><br /></td><td class="confluenceTd" style="text-align: center; width: 5.57151%;">05</td><td class="confluenceTd" style="text-align: center; width: 34.7501%;"><span style="color: #172b4d;">Add some basic cases such as balanced tree, reversed tree and random tree</span></td><td class="confluenceTd" style="text-align: center; width: 7.52441%;">4</td><td class="confluenceTd" style="text-align: center; width: 14.5893%;"><span style="color: #172b4d; text-decoration: none;">Should have</span></td><td class="confluenceTd" style="text-align: center; width: 24.8133%;">Team 2</td></tr><tr><td class="confluenceTd" style="text-align: center; width: 5.57151%;">08</td><td class="confluenceTd" style="text-align: center; width: 34.7501%;"><span style="color: #172b4d;">Highlight found nodes in RED and display text "NOT FOUND" for node that was not found</span></td><td class="confluenceTd" style="text-align: center; width: 7.52441%;">2</td><td class="confluenceTd" style="text-align: center; width: 14.5893%;">Should have</td><td class="confluenceTd" style="text-align: center; width: 24.8133%;">Team 2</td></tr><tr><td class="confluenceTd" style="text-align: center; width: 5.57151%;">10</td><td class="confluenceTd" style="text-align: center; width: 34.7501%;"><span style="color: #172b4d;">Make all the details of creating a "new node" in pseudocode collapsible (line 8 to 11 inclusive)</span></td><td class="confluenceTd" style="width: 7.52441%; text-align: center;">2</td><td class="confluenceTd" style="width: 14.5893%; text-align: center;">Should have</td><td class="confluenceTd" style="width: 24.8133%; text-align: center;">Team 2</td></tr><tr><td class="confluenceTd" style="text-align: center; width: 12.6939%;"><strong style="text-decoration: none; text-align: left;">QUICKSORT</strong></td><td class="confluenceTd" style="text-align: center; width: 5.57151%;">13</td><td class="confluenceTd" style="text-align: center; width: 34.7501%;"><p><span>Add alternatives for choosing pivot element -&nbsp;</span><span>Rightmost (the one there now) and&nbsp;</span>Median of three</p></td><td class="confluenceTd" style="text-align: center; width: 7.52441%;">4</td><td class="confluenceTd" style="text-align: center; width: 14.5893%;">Should have</td><td class="confluenceTd" style="text-align: center; width: 24.8133%;">Team 1</td></tr><tr><td class="confluenceTd" style="text-align: center; width: 12.6939%;"><strong style="text-decoration: none; text-align: left;">TRANSITIVE CLOSURE</strong></td><td class="confluenceTd" style="text-align: center; width: 5.57151%;">23</td><td class="confluenceTd" style="text-align: left; width: 34.7501%;"><p style="text-align: center;"><span>Highlight i, j and k in the graph and increase the size of the arrow headers</span></p></td><td class="confluenceTd" style="text-align: center; width: 7.52441%;">3</td><td class="confluenceTd" style="text-align: center; width: 14.5893%;">Should have</td><td class="confluenceTd" style="text-align: center; width: 24.8133%;">Team 1</td></tr></tbody></table>
