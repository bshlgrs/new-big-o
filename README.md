# new-big-o

i have wanted this for so long and now it is finally here

Examples

How long does it take to insert and get in a Array + FrequencyHistogram

Array:
  insert: n
  insertAtEnd: 1
  update: 1
  getByIndex: 1

FrequencyHistogram:
  insert: 1
  getByIndex: impossible
  update: 1
  remove: 1

MaxMemoizer:
  insert: 1
  getByIndex: impossible
  update: impossible
  max: 1

StackMemoizer:
  insertAtEnd: 1
  removeAtEnd: 1
  updateAtEnd: 1 // <- remove and insert


Notes:

If you have an array plus a frequency histogram, you can support things like updating by index that you couldn't support with just a frequency histogram. This is because the frequency histogram can update given a node to change, but can't get the node itself.

This is not always true. So a max-memoizer can't update.

How you support insertAtEnd with those:
    Array.insertAtEnd
    FrequencyHistogram.insertAtEnd

How you support removeByIndex:
    Array.getByIndex
    Array.remove
    Frequency.remove

And the thing is that you need to get it first.

Stacks only support insertAtEnd, removeAtEnd, getByIndex, and updateAtEnd

So you can't support update with that.




In the case of mutating methods, you need to find an implementation for all of the different data structures. Those implementations are allowed to use the read methods of different data structures.
