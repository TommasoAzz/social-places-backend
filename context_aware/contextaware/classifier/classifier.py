from _typeshed import OpenTextMode
import pandas as pd
import numpy as np
from os.path import join
from pandas.core.indexes.base import Index
from sklearn.tree import DecisionTreeClassifier
from __future__ import annotations
from imblearn.over_sampling import RandomOverSampler
from sklearn.preprocessing import OneHotEncoder
from typing import Tuple
import pickle

class ActivityClassifier:
    class __Classifier:
        def __init__(self) -> None:
            self.cached_model_filename: str = join('contextaware', 'classifier', 'model.sav'),
            self.train_dataset_filename: str = join('contextaware', 'classifier', 'dataset.csv'),

            self.train_dataset: pd.DataFrame = pd.read_csv(self.train_dataset_filename)
            self.model: DecisionTreeClassifier = pickle.load(open(self.cached_model_filename, mode='rb'))
            self.oversampler = RandomOverSampler(sampling_strategy='minority', random_state=17)


    __instance: __Classifier = None
    """
    Instance of inner class __Classifier.
    """


    targets_list: Tuple[str] = ("leisure", "restaurants", "sport")
    """
    List of possible target activities.
    """


    columns_list: Index[str] = None
    """
    List of dataset columns.
    """


    human_activities: Tuple[str] = ("har_bike", "har_bus", "har_car", "har_still", "har_walk")
    """
    List of human activity columns.
    """


    def get_instance(self) -> ActivityClassifier:
        """
        Returns an instance of this class.
        """
        if not ActivityClassifier.__instance:
            ActivityClassifier.__instance = ActivityClassifier.__Classifier()
            ActivityClassifier.columns_list = ActivityClassifier.__instance.train_dataset.columns

        return self


    def __get_dummies_human_activity(X: pd.DataFrame) -> pd.DataFrame:
        """
        One-hot encodes the human_activity column (from one column with categorical values from human_activities
        to five columns, each one representing an element of human_activities.
        """
        har_cols = pd.get_dummies(X["human_activity"], prefix="human_activity")
        X.drop(["human_activity"], axis=1, inplace=True)
        X = pd.concat([X, har_cols], axis=1)
        return X


    def __one_hot_encode_target(y: pd.Series) -> pd.Series:
        """
        One-hot encodes the target column (from one column with categorical values from targets_list to
        a three column matrix, each one representing an element of targets_list).
        """
        return OneHotEncoder().fit_transform(y.values.reshape(-1,1)).toarray()

    
    def __save_model():
        """
        Saves the current instance of the model to a binary file.
        """
        with open(ActivityClassifier.__instance.cached_model_filename, 'wb') as model_file:
            pickle.dump(ActivityClassifier.__instance.model, model_file)


    def update_retrain(self, new_record: pd.DataFrame):
        """
        Adds new_record to the previous saved records in the train dataset,
        retrains the model and therefore predicts the class.
        """
        # Updating the training set and caching it again.
        ActivityClassifier.__instance.train_dataset = ActivityClassifier.__instance.train_dataset.append(new_record)
        ActivityClassifier.__instance.train_dataset.to_csv(self.train_dataset_filename)
        # Separating X and y
        dataset_copy = ActivityClassifier.__instance.train_dataset.copy()
        y_original = dataset_copy.pop("place_category")
        X_original = dataset_copy
        # Oversampling
        X_oversampled, y_oversampled = ActivityClassifier.__instance.oversampler.fit_resample(X_original, y_original)
        # One hot encoding columns human_activity and place_category (target or y).
        X = self.__get_dummies_human_activity(X_oversampled)
        y = self.__one_hot_encode_target(y_oversampled)

        ActivityClassifier.__instance.model = ActivityClassifier.__instance.model.fit(X, y)

        self.__save_model()
        
    
    def predict(self, new_record: pd.DataFrame) -> str:
        """
        Predicts the target class for the given new_record.
        """
        # One-hot encoding of the har column.
        X = self.__get_dummies_human_activity(new_record)

        # Prediction
        y = ActivityClassifier.__instance.model.predict(X)
        predicted_class_index = np.argmax(y)

        return ActivityClassifier.targets_list[predicted_class_index]
        
