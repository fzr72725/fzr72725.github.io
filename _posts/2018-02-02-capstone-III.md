---
layout: post
premalink: /articles/capstone-part-three/
---

# Naked Word: Nationalities of World Language
## Part Three: Feature Selection and Modeling

Steps:
1. Get all the acquired numeric features
```
numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
df_numeric = df_0.select_dtypes(include=numerics)

print ', '.join(df_numeric.columns)
>> doc_id, unique_lemma, avg_stc_length, total_stc, POS_adjv_repeat_rate, POS_adjv_repeat_cnt, DT_max_dp_cnts_std, DT_ROOT_idx_mean, DT_pass_cnt_sum, DT_mark_cnt_sum

X = df_0[['unique_lemma', 'avg_stc_length', \
          'total_stc', 'POS_adjv_repeat_rate', \
          'POS_adjv_repeat_cnt', 'DT_max_dp_cnts_std', \
          'DT_ROOT_idx_mean', 'DT_pass_cnt_sum', 'DT_mark_cnt_sum']]
y = df_0['label']
X_train, X_test, y_train, y_test = train_test_split(X, y)
```
2. Fit all numeric features into a RandomForestClassifier to examine feature importance
![Feature Importance Plot](image.png)
The order of feature importance (more to less):
`avg_stc_length`, `DT_ROOT_idx_mean`, `unique_lemma`, `DT_max_dp_cnts_std`, `POS_adjv_repeat_rate`,
`total_stc`, `POS_adjv_repeat_cnt`, `DT_mark_cnt_sum`, `DT_pass_cnt_sum`

3. Fit all numeric features into a GradientBoostingClassifier to examine feature importance for identifying a specific class. This is extremely useful for the Japanese and Korean native language groups because essays from these two classes appear to be mis-classfied as one another very frequently.
![Partial Dependence Plot JPN](image.png)
Significant features to differentiate 'JPN' from 'KOR' (more to less):
`POS_adjv_repeat_cnt`
![image](image.png)

4. Evaluate how mere numeric features perform with different algorithms
- `LogisticRegression`: accuracy: 0.351129889756
- `RandomForestClassifier`: accuracy: 0.355977554772
- `GradientBoostingClassifier`: accuracy: 0.351245166152
Although better then random guess, modeling result shows that merely using these numeric features does not produce great result. Therefore, need to move onto more sophisticated syntactic features.

5. Use tf-idf matrix on pos tag body for essays to train classifiers
As mentioned in [part one](www.googel.com), I have converted the original essay text into the corresponding syntactic tags as listed below:
**DT_pos_join**
**DT_archs_join**
**DT_insent_pos_ngram**
**DT_insent_arch_ngram**

I have tried each of the four features separately, the result:
**DT_pos_join**: accuracy: 0.664607324846
**DT_archs_join**: accuracy: 0.655624609373
**DT_insent_pos_ngram** accuracy: 0.65240657206
**DT_insent_arch_ngram** accuracy: 0.645502590324

6. Try stacking two tf-idf matrices and train the classifier
```
X = df_0[['DT_pos_join','DT_insent_pos_ngram']]
y = df_0['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.8)

vectorizer1 = TfidfVectorizer(lowercase=True, ngram_range=(3,3), max_features=800).fit(X_train['DT_pos_join'])
DT_pos_join_train_dtm = vectorizer.transform(X_train['DT_pos_join'])
DT_pos_join_test_dtm = vectorizer.transform(X_test['DT_pos_join'])

vectorizer2 = TfidfVectorizer(lowercase=True, ngram_range=(1,1), max_features=800).fit(X_train['DT_insent_pos_ngram'])
DT_insent_pos_ngram_train_dtm = vectorizer.transform(X_train['DT_insent_pos_ngram'])
DT_insent_pos_ngram_test_dtm = vectorizer.transform(X_test['DT_insent_pos_ngram'])

import scipy as sp
df_all_train = sp.sparse.hstack((DT_pos_join_train_dtm, DT_insent_pos_ngram_train_dtm),format='csr')
df_all_test = sp.sparse.hstack((DT_insent_pos_ngram_test_dtm, DT_insent_pos_ngram_test_dtm),format='csr')
df_all_columns=vectorizer1.get_feature_names() + vectorizer2.get_feature_names()

clf = LogisticRegression()
clf.fit(df_all_train, y_train)
y_pred = clf.predict(df_all_test)
```
The classification accuracy did not improve much.

7. Use doc2vec vectors for essays to train classifiers
```
train_data, test_data = train_test_split(df_0, train_size=0.8)

col = 'essay_content'
train_docs = pwk.tag_docs(train_data, col, literal=True)
test_docs = pwk.tag_docs(test_data, col, literal=True)
model = pwk.train_doc2vec_model(train_docs, 2, 100)

y_train, X_train = pwk.vec_for_learning(model, train_docs)
y_test, X_test = pwk.vec_for_learning(model, test_docs)

logreg = LogisticRegression()
logreg.fit(X_train, y_train)
y_pred = logreg.predict(X_test)
```
So far, doc2vec matrix gives me the best accuracy: 0.815278
