----


1. Game URL (AWS)
    - Not running anymore
2. Jenkins URL
    - Not running anymore

## Scripts

I created the following scripts *(further details about usage/how they work can be found in the comments in the scripts*). 

Their purposes are:
- build.sh
	- It creates an build of the project then copies the build over to an folder named build.
- commit
	- It installs all ***npm*** packages, builds the project *(by using build.sh)* and runs the commit test suite.
- deploy
	-  It deployes the necessary files *(.env, docker-compose.yml)* for starting the application on an host specified by command line parameters, the application is then started on the remote host.
- dockerize
	- It builds/tags/pushes the docker image onto https://hub.docker.com/ 
- provision
	- It provisions an host *(already available)* from different config files in the repository depending on which stage it's used in. 
- run
	- It waits until the database is running, then it runs an migration and starts the server *(used by the docker-compose.yml)*




## Testing & logic

I created the following tests.

- UnitTests, server logic TDD (Git commit log)
    - Yes i created unit tests *(./server/socket-app/tictactoe/tictactoe-game.spec.js)* for the scenarios in testExamples.md.

- API Acceptance test - fluent API
 	- I created an load test for playing a game of tictactoe to end *(./apitest/tictactoe.spec.js)*

- Load test loop
	- I created an load test for playing a game of tictactoe to end *(./apitest/tictactoe.loadtest.js)*

- UI TDD
	- I created the following tests:
		-  Tests which ensures the correct behaviour of TicCell.js *(./client/src/tictactoe/TicCell.test.js)*

- Is the game playable?
	- yes : )



## Data migration

- I only created data migration for the missing column *(aggregate_id)* in eventlog.



## Jenkins

- Commit Stage
	1. The commit script is executed
	2. The dockerize script is executed
	3. The commit test suite is executed.
	4. The test results is published on jenkins. 
	5. The Acceptance Stage is triggered upon success.

- Acceptance Stage
	1. The test results from the Commit Stage is removed.
	2. An acceptance stage host is rebooted by the provision script.
	3. The application is deployed onto the rebooted instance.
	4. Waits 20s in order to let the database and server to be established.
	5. The acceptance test is executed against the remote host.
	6. The test results is published on jenkins.
	7. The Capacity stage is triggered upon success.

- Capacity Stage
	1. The test results from the Acceptance Stage is removed.
	2. An capacity stage host is rebooted by the provision script.
	3. The application is deployed onto the rebooted instance.
	4. Waits 20s in order to let the database and server to be established.
	5. The load test is executed against the remote host.
	6. The test results is published on jenkins.

- Production
	1. The application is deployed onto the production machine with a press of a button. 


- Schedule or commit hooks
	-  I used an commit hook on the commit stage and reused the workspace for all downstream stages.

- Pipeline
	- No 

- Jenkins file
	- No

- Test reports
	- I publish the test results on jenkins in each stage *(except the client test wasn't sure how to do that)*.


## Monitoring

Did you do any monitoring?

- No.

## Other

Anything else you did to improve you deployment pipeline of the project itself?
- No.
