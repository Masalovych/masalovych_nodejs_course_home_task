## Event Loop & Workers Home Task #2

###Event loop:

#### Recreate code from presentation:

File: [./event_loop/micro_vs_macro_tasks_priority.js](./event_loop/micro_vs_macro_tasks_priority.js)

Run `node ./home_task_2/event_loop/micro_vs_macro_tasks_priority.js`

#### Write server with api that blocks loop (and prove it):

File: [./event_loop/blocking_event_loop/blocked_server.js](./event_loop/blocking_event_loop/blocked_server.js)

Console 1: Run server: `node ./home_task_2/event_loop/blocking_event_loop/blocked_server.js`

Console 2: Send request:  `curl localhost:3000`

Console 3: Send second request:  `curl localhost:3000`

Expected: Second request will wait till first will be processed.

#### Non-blocking Server (rewrite blocked one)

Files: [./event_loop/non_blocking_event_loop/main_process.js](./event_loop/non_blocking_event_loop/main_process.js)
       [./event_loop/non_blocking_event_loop/child_process.js](./event_loop/non_blocking_event_loop/child_process.js)

Console 1: Run server: `node ./home_task_2/event_loop/non_blocking_event_loop/main_process.js`

Console 2: Send request:  `curl localhost:3000`

Console 3: Send second request:  `curl localhost:3000`

Expected: Both requests should be processed simultaneously.

### Clusters:

#### Recreate code from presentations

File: [./cluster/recreated](./cluster/recreated.js)

Run: `node ./home_task_2/cluster/recreated.js`

#### Create cluster with 8 workers. Calculate on server how many requests handled each worker

Files:  [./cluster/server_load/calculate_load.js](./cluster/server_load/calculate_load.js)
        [./cluster/server_load/multiple_servers.js](./cluster/server_load/multiple_servers.js)

Console 1: Run server: `node ./home_task_2/cluster/server_load/multiple_servers.js`

Console 2: Calculate load:  `node ./home_task_2/cluster/server_load/calculate_load.js`

### Workers:

#### Calculate n-th Fibonacci number on worker thread

File: [./fibonacci/worker_thread/calculate_fibonacci.js](./fibonacci/worker_thread/calculate_fibonacci.js)

Console 1: Run server: `node ./home_task_2/fibonacci/worker_thread/calculate_fibonacci.js`

Console 2: Send request:  `curl localhost:3000`

Console 3: Send second request:  `curl localhost:3000`

Expected: Server should not be blocked.

### Child/Parent Process:

#### Calculate n-th Fibonacci number on child process (can be as api) (2 files)

Files:  [./fibonacci/child_process/child.js](./fibonacci/child_process/child.js)
        [./fibonacci/child_process/parent.js](./fibonacci/child_process/parent.js)

Console 1: Run server: `node ./home_task_2/fibonacci/child_process/parent.js`

Console 2: Send request:  `curl localhost:3000`

Console 3: Send second request:  `curl localhost:3000`

Expected: First request should not block main process.
