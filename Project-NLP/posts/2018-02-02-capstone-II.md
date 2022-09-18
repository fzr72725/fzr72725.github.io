# Naked Word: Nationalities of World Language
## Part Two: Feature Engineering -- Doc2Vec Representation

Steps:
1. Loading pandas DataFrame from [part one](https://github.com/fzr72725/fzr72725.github.io/blob/master/_posts/2018-02-02-capstone-I.md)

```
df_0 = pd.read_pickle('../20180117_part_one.pkl')
```
2. Extract essay vector representation using doc2vec

```
# Add tag to each document:
def tag_docs(docs, col):
    tagged = docs.apply(lambda r: TaggedDocument(words=simple_preprocess(r[col]), tags=[r.label]), axis=1)
    return tagged

# Train the doc2vec model
def train_doc2vec_model(tagged_docs, window, size):
    sents = tagged_docs.values
    doc2vec_model = Doc2Vec(sents, size=size, window=window, iter=20, dm=1)
    return doc2vec_model

# Building the final vector feature for the classifier
def vec_for_learning(doc2vec_model, tagged_docs):
    sents = tagged_docs.values
    targets, regressors = zip(\
            *[(doc.tags[0], doc2vec_model.infer_vector(doc.words, steps=20)) for doc in sents])
    return targets, regressors

train_data, test_data = train_test_split(df_0, train_size=0.7)
col = 'essay_content'
train_docs = pwk.tag_docs(train_data, col, literal=True)
test_docs = pwk.tag_docs(test_data, col, literal=True)
model = pwk.train_doc2vec_model(train_docs, 2, 100)

y_train, X_train = pwk.vec_for_learning(model, train_docs)
y_test, X_test = pwk.vec_for_learning(model, test_docs)
```

3. To get a rough idea of how essay vectors perform on different text features (`essay_content`,`DT_pos`,`DT_insent_arch_ngram`, etc.), I used a basic LogisticRegression model and k-fold cross validation to examine the classification performance (accuracy score) when using different text features to generate the vector representations.

```
train_data, test_data = train_test_split(df_0, train_size=0.8)
col = 'essay_content'

clf = LogisticRegression()
print pwk.k_fold_doc2vec_clf(train_data, col, 2, 100, clf)
```

```
train_data, test_data = train_test_split(df_0, train_size=0.8)
col = 'DT_insent_arch_ngram'

clf = LogisticRegression()
print pwk.k_fold_doc2vec_clf(train_data, col, 1, 100, clf, literal=False)
```
...
The result shows that text feature `essay_content` is producing the best result. Therefore, I used vector representation extracted from this column to be the doc2vec feature for my dataset
