**TL;DR:** _In this article, I explored sklearn's implementation of term frequency and inverse document frequency (tf-idf). I also compared it to the textbook definition of tf-idf. One more step after that, I used a simple text classification use case to illustrate how to interpret the result of Logistic Regression modeling using tf-idf matrix as features._

## 1. The Basic Definition of tf-idf in Information Retrieval
1) Term Frequency:

2) Document Frequency:

3) Why Inverse DF:

4) tf-idf

## 2. How Does sklearn Implement tf-idf
1) Common Use Cases:

2) Different Parameters:

3) Examples:

## 3. Text Classification Using tf-idf and Logistic Regression
1) Text Vectorization:

2) Fit Logistic Regression Model

3) Interpret the Result

Often, we think that we have a good grasp on some concept if we can memorize the formulas listed on the textbooks we read. However, it is quite common that existing libraries' implementations on a concept have their own tweaks in it. It it crucial to accurately understand how a piece of code will interact with the input you provide and what kind of output to expect. If you have a somewhat inaccurate understanding of a function's behavior, it could cost you hours or days to troubleshoot for the downstream works.

-----
## References
[Jurafsky's NLP course](www.google.com)
[sklearn TfidfVectorizer source code](www.google.com)
