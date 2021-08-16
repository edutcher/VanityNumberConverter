# VanityNumberConverter

## Description

This is a function to convert phone numbers into vanity numbers(1238378464 becomes 123TESTING). The function can then be uploaded to AWS Lambda service and implemented into an Amazon Connect contact flow to automate storage into a DynamoDB table and present the vanity numbers back to the caller. The environment is live at the number: 1(208)872-3294

## Install and Usage

Locally the repo can be tested with JEST. Clone the repo, npm install jest, then npm run test. The lambda folder can be zipped and uploaded to AWS.

## Discussion

This was an interesting challenge. The two major things I felt needed to be worked through were generating the words from the number and deciding how to best create the full vanity numbers. I decided early to use a recurvise function to go through and check the number to word conversion. I figured this would help me avoid generating 'rtsrsts', since the function will just stop at 'rt'. I used a binary search to check the partial words against a hash table broken down by word length. I am happy with the result of this, however I have a feeling the recursive function can probably be condensed.

The second part ended up being more challenging. I made the decision that the 'best' vanity numbers were either a full seven character word, or a three character word followed by a four character word since that follows the natural break points for a phone number. After that I considered a few options; giving each number a score of some sort, focusing on number of characters in the number, focusing on the largest possible word, or focusing on number of words. I settled on a combination of the last two; first look for larger words since remembering a single word felt like a good goal, then look for multiple words. I used a few nested loops here, and the code readability suffers for it. This would be the area I would try to spend more time on in the future, both in cleaning up the code and refining the number selection. Lastly, I made the decision to remove the single character mappings ("A" and "I") as I found they were causing some confusion next to multiple character words. They could possibly be reimplemented with logic requiring a digit between them and another word.

## Contact Flow

![Contact Flow](https://res.cloudinary.com/dd9hrrpch/image/upload/v1629101086/ContactFlow_qno2kl.jpg)
