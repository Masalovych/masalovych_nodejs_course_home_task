Promise.resolve().then(() => console.log('promise1 resolved'));                 // #4

Promise.resolve().then(() => {                                                  // #5
	 console.log('promise2 resolved');
	 process.nextTick(() => console.log('next tick3 inside promise'));    // #10
});

global.queueMicrotask(() => console.log('queue microtask1'));           // #6

setTimeout(() => console.log('set timeout1'), 0);                // #11

Promise.resolve().then(() => console.log('promise4 resolved'));                 // #7
Promise.resolve().then(() => console.log('promise5 resolved'));                 // #8

setImmediate(() => console.log('set immediate1'));                      // #13
setImmediate(() => console.log('set immediate2'));                      // #14

console.log('simple log');                                                      // #1

process.nextTick(() => console.log('next tick1'));                      // #2
process.nextTick(() => console.log('next tick2'));                      // #3

setTimeout(() => console.log('set timeout2'), 0);                // #12

global.queueMicrotask(() => console.log('queue microtask2'));           // #9

setImmediate(() => console.log('set immediate3'));                      // #15
setImmediate(() => console.log('set immediate4'));                      // #16

// Expected output:
// 1. sync code
// 2. nextTick          - micro
// 5. Promise.resolve   - micro
// 3. queueMicrotask    - micro
// 6. setTimeout        - task
// 4. setImmediate      - task

//      split micro & macro                  use priority
//    -----------------------             --------------------
//      sync                                    sync
//        simple log                              simple log

//      microtasks queue                        microtasks queue
//        promise1 resolved                       next tick1
//        promise2 resolved                       next tick2
//        queue microtask1                        promise1 resolved
//        promise4 resolved                       promise2 resolved
//        promise5 resolved                       queue microtask1
//        next tick1                              promise4 resolved
//        next tick2                              promise5 resolved
//        queue microtask2                        queue microtask2

//      tasks queue                             tasks queue
//        set timeout1                            set timeout1
//        set immediate1                          set timeout2
//        set immediate2                          set immediate1
//        set timeout2                            set immediate2
//        set immediate3                          set immediate3
//        set immediate4                          set immediate4


//      real output
//        simple log
//        next tick1
//        next tick2
//        promise1 resolved
//        promise2 resolved
//        queue microtask1
//        promise4 resolved
//        promise5 resolved
//        queue microtask2
//        next tick3 inside promise
//        set timeout1
//        set timeout2
//        set immediate1
//        set immediate2
//        set immediate3
//        set immediate4

// Opened question: Why "next tick3 inside promise" is after all microtasks but not after "promise2 resolved"?
// nextTick has higher priority then promise.
