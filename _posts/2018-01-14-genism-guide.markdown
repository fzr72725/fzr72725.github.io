---
layout: post
title: My Pipeline of Text Classification Using Gensim's Doc2Vec and Logistic Regression
premalink: /articles/aws-ec2-jupyter/
---

<p align="center">
<img src="/images/gensim_books.jpg">
</p>

**TL;DR:** _In this article, I walked through my entire pipeline of performing text classification using Doc2Vec vector extraction and logistic regression. Gensim is relatively new, so I'm still learning all about it. By no means I'm the gensim expert, but I figured that if I share my experience on this specific task, it will hopefully provide one more perspective to those who are new and trying to understand word2vec/doc2vec modeling._

For my most recent NLP project, I looked into one of the very well-known word2vec implementations -- gensim's Doc2Vec -- to extract features out of the text bodies in my data set. My goal was to eventually get a logistic regression model trained by the doc2vec feature that is able to classify unseen documents. Therefore, the model's ability to generalize is important in this case.

Based on my experience, most tutorials online are using word2vec/doc2vec modeling to illustrate word/document similarity analysis (e.g. calculating word similarity using gensim's `.similarity()` method). When it comes to text classification, I could only find a few examples that built clear pipelines. I was amazed by how many different approaches people took for this task. In the beginning, I followed a couple of the example pipelines I found online. However, there were just a few things that made me think twice about why the authors did things in certain ways and whether they were reasonable.

After investing quite some time into researching gensim's doc2vec behaviors and what kind of general confusions people had about it, I finally put together a pipeline that I feel content about its consistence with basic machine learning principles. I will explain my pipeline in details below.

Before diving into details, a high level summary of my text classification steps:
1. Extract vector representation from the documents in my corpus using doc2vec.
2. Feed the document vectors to a logistic regression model for learning
3. Get a model that does a decent job of generalization so that it can predict a new unseen document's class.

**Step 1
Extract document vectors**

1) Add tag to each document:
```
def tag_docs(docs, col):
    tagged = docs.apply(lambda r: TaggedDocument(words=simple_preprocess(r[col]), tags=[r.label]), axis=1)
    return tagged
```
Originally I was using `LabeledSentence` for this task. But according to [this thread](https://stackoverflow.com/questions/41182372/what-is-the-difference-between-gensim-labeledsentence-and-taggeddocument), `LabeledSentence` is an older deprecated name for the same object-type to encapsulate a text-example, which is now called `TaggedDocument`.

Another tricky part: when passing a text body into `TaggedDocument`, the words have to be all tokens, otherwise the result TaggedDocument object's `words` attribute will have the whole text body as one word. (Try remove the `simple_preprocess` function to see for yourself). I used the simple tokenizer provided by gensim, some people prefer writing their own tokenizers.

I used a document's class (the label to be classified) as the value of `tag`, and therefore they are not unique. In many tutorials I have seen people including some kind of unique id as part of their `tag`. To my understanding, the reason for this is just so that later one can retrieve a specific document vector using the tag. In my case, it is not necessary.

2) Train the doc2vec model:
```
def train_doc2vec_model(tagged_docs, window, size):
    sents = tagged_docs.values
    doc2vec_model = Doc2Vec(sents, size=size, window=window, iter=20, dm=1)
    return doc2vec_model
```
The confusion around this step is that I have seen many others initializing the Doc2Vec object without specifying the TaggedDocument object (`sents` in my code above). And later on they would call `build_vocab()` and `train()` as separate steps. While that is definitely one way of doing it, I did the initialize, vocabulary-building and training all together by passing the TaggedDocument object and number of training iterations into `Doc2Vec()`.

I also had another confusion about whether the `tag` in the TaggedDocument object will be included in the vocabulary building. But by examining the gensim source code, it seems that `tag` is not treated as part of the vocab.

3) Building the final vector feature for the classifier:
```
def vec_for_learning(doc2vec_model, tagged_docs):
    sents = tagged_docs.values
    targets, regressors = zip(\
            *[(doc.tags[0], doc2vec_model.infer_vector(doc.words, steps=20)) for doc in sents])
    return targets, regressors
```
This is one of the most confusing parts for me in the doc2vec training process. Many code examples did not use `infer_vector()` to "retrain" the document vectors. Instead, they used the trained vectors from the `doc2vec_model` directly as the final vector matrix. I think this is also one of the motivations for people to assign a unique tag to each document as I mentioned earlier.

I personally found it more reasonable to use `infer_vector()` to "retrain" the document vector. Reason being: "You could certainly use the vectors learned during training. But note that during much of their 20-training-passes, the model itself was still undergoing rapid change, and was far from its final state. I've sometimes seen that re-inferred vectors, often work better for downstream tasks. This is perhaps because then all 20-inference-passes, across all re-inferred vectors, equally benefit from the same final frozen model state", quoted [Gordon Mohr](https://www.linkedin.com/in/gojomo/) from [a Google group Q&A](https://groups.google.com/forum/#!topic/gensim/A0dNogEIw7g).

**Step 2
Train the Logistic Regression Classifier**

Besides figuring out a proper way of extracting the document vectors, I also spent a lot of time on designing the general text classification pipeline. I had some confusion based on the observation that some people used training+testing documents to build the doc2vec model vocabulary and then extracted document vectors using that model. I really struggled to accept this approach, reason being: Recall the typical tf-idf classfication workflow:
```
X = df_new['text_content']
y = df_new['label']
X_train, X_test, y_train, y_test = train_test_split(X, y)

vectorizer = TfidfVectorizer(stop_words='english')
X_train_dtm = vectorizer.fit_transform(X_train)
X_test_dtm = vectorizer.transform(X_test)

clf_lr = LogisticRegression()
clf_lr.fit(X_train_dtm, y_train)
y_pred = clf_lr.predict(X_test_dtm)
```
In the code example above we would split the document set into training and testing, and then use ONLY training documents to build the term collection. This way, we are making sure that the classifier trained on the training tf-idf matrix is generalizing well.

Therefore, I feel that doc2vec workflow should follow the same general principal, i.e. to train (build vocabulary) the doc2vec ONLY using training documents, so I have my final pipeline as below:
```
train_data, test_data = train_test_split(data)

train_tagged = tag_docs(train_data, 'text_content')
test_tagged = tag_docs(test_data, 'text_content')
model = train_doc2vec_model(train_docs)

y_train, X_train = vec_for_learning(model, train_tagged)
y_test, X_test = vec_for_learning(model, test_tagged)

logreg = LogisticRegression()
logreg.fit(X_train, y_train)
y_pred = logreg.predict(X_test)
```

I'm still experimenting many different options for how to train the doc2vec model in order to get the best representation of the documents in my corpus. So far Doc2Vec is performed all my other extracted features for my document classification task. I'm still learning a lot of new things about gensim, word2vec and neural network, so chances are I will probably come back to this post and make many changes based on my newly acquired knowledge on word embedding. But I really enjoy this "decipher" process when trying to adopt a new technology.

Enjoy vectorizing!

-----
### Some good resources for learning doc2vec in general:
[A gentle introduction to Doc2Vec](https://towardsdatascience.com/a-gentle-introduction-to-doc2vec-db3e8c0cce5e)

[Distributed Representations of Sentences and Documents](http://proceedings.mlr.press/v32/le14.pdf)

-----
### References:
[RaRe Technology's _movie plots by genre_ example on github](https://github.com/RaRe-Technologies/movie-plots-by-genre/blob/master/Document%20classification%20with%20word%20embeddings%20tutorial.ipynb)

[Gensim's Doc2Vec source code](https://github.com/RaRe-Technologies/gensim/blob/develop/gensim/models/doc2vec.py)

[RaRe Technology's IMDB Sentiment Analysis Tutorial](https://github.com/RaRe-Technologies/gensim/blob/develop/docs/notebooks/doc2vec-IMDB.ipynb)
