---
layout: post
premalink: /articles/capstone-part-four/
---

# Naked Word: Nationalities of World Language
## Part Four: GridSearch on Different Models Using Best Feature (Doc2Vec)

1. Logistic Regression
After gridsearch, the trained model using optimized hyper parameters produced the following confusion matrix:
![lr conf](/images/lr_doc2vec_conf.png)

2. Random Forest Classifier
Notes on random forest classifier gridsearch:
`max_depth`: choices on max_depth should be reasonably away from extreme cases such as 2 or 3. For example, if we set
'max_depth': [None, 2, 3], chances are the gridsearch will pick "None" (meaning that a tree can grow as deep as possibel) because it will give better performance compare to a forest of very shallow trees.

`bootstrap`: normally we want the bootstrap to always be "True". The theory of random forest is based on bootstraping. Therefore, unless there is an obvious reason not to sample for each tree-building, we should always use bootstrap.

After gridsearch, the trained model using optimized hypter parameters produced the following confusion matrix:
![rf conf](/images/rf_doc2vec_conf.png)

3. Gradient Boosting Classifier
After gridsearch, the trained model using optimized hypter parameters produced the following confusion matrix:
![gb conf](/images/gb_doc2vec_conf.png)


4. Ada Boost Classifier
Note on Ada Boosting:
Often, we can imitate AdaBoost learning by setting GradientBoostingClassifier(`loss`=`exponential`). But this trick only works for binary classification task. Since this is a multi-class case, I used sklearn's AdaBoostClassifier to do the training.

After gridsearch, the trained model using optimized hypter parameters produced the following confusion matrix:
![adb conf](/images/adb_doc2vec_conf.png)

5. Voting System
One common approach to boost the classification accuracy is to ensemble several classifiers. Since all three tree-based models produced very similar accuracy scores, I tried to stack them together via voting classifier.

```
from sklearn.ensemble import VotingClassifier

vote_clf1 = VotingClassifier(estimators=[('rf', rfclf), ('gdb', gdb_clf),('ada', ada_clf)], voting='hard')
vote_clf1.fit(X_train, y_train)
y_pred = vote_clf1.predict(X_test)
pwk.print_confusion_matrix(y_test, y_pred)
```
The accuracy of the voting classifier improved quite a bit:
![vote conf](/images/voting_doc2vec_conf.png)

6. Final Model

Although the voting classifier improved the overall tree-based model performance, Logistic Regression is still significantly out performing all other models. Therefore, doc2vec essay representation training a logistic regression model is the final strategy.
