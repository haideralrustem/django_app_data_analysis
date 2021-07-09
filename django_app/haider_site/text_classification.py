
# Sentiment analysis is a technique that detects the underlying sentiment in a piece of text.
# It is the process of classifying text as either positive, negative, or neutral. Machine learning techniques are used to evaluate a 
# piece of text and determine the sentiment behind it.


from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import SGDClassifier
from statistics import mean
import numpy as np
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from random import shuffle
import pdb

import sys
sys.path.append('C:\\Users\\xario\\OneDrive\\Documents')
import excel_helper_functions as ehf




def text_classification20():

    twenty_train = fetch_20newsgroups(subset='train', shuffle=True)
    twenty_test = fetch_20newsgroups(subset='test', shuffle=True)

    # prints all the categories
    for cat in (twenty_train.target_names):
        # print(cat)
        pass

    count_vect = CountVectorizer()
    X_train_counts = count_vect.fit_transform(twenty_train.data)
    tfidf_transformer = TfidfTransformer()
    X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)
    print(X_train_tfidf.shape)

    # print(twenty_train.target_names[twenty_train.target[0]])

    text_clf_svm = Pipeline([('vect', CountVectorizer(stop_words='english')),
                             ('tfidf', TfidfTransformer()),
                             ('clf-svm', SGDClassifier(loss='hinge', penalty='l2',
                                                       alpha=1e-3, random_state=42)),
                             ])
    _ = text_clf_svm.fit(twenty_train.data, twenty_train.target)
    # predicted_svm = text_clf_svm.predict(twenty_test.data)

    text = [
        r"he rule of six inside private homes will be removed and work-from-home guidance abolished as 16 months of on-off restrictions on daily life end.The PM said he expected the final step would go ahead as planned on 19 July. This will be confirmed on 12 July after a review of the latest data. Further updates on school bubbles, travel and self-isolation will follow in the coming days, Mr Johnson told a Downing Street news conference. He said that even after the removal of the legal requirement to wear a face covering, he would continue to wear one himself in crowded places as a courtesy."]

    predicted_svm = text_clf_svm.predict(text)
    print(twenty_train.target_names[predicted_svm[0]])
    # print(np.mean(predicted_svm == twenty_test.target))

# .......................................



# ...................................

def sentiment_analysis():


    return


if __name__ == "__main__":
    pass



