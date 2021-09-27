from _typeshed import OpenTextMode
import pandas as pd
import numpy as np
from os.path import join
from pandas.core.indexes.base import Index
from sklearn.tree import DecisionTreeClassifier
from __future__ import annotations
from typing import Tuple
import pickle

class ActivityClassifier:
    class __Classifier:
        def __init__(self) -> None:
            self.cached_model_filename: str = join('contextaware', 'classifier', 'model.sav'),
            self.train_dataset_filename: str = join('contextaware', 'classifier', 'dataset.csv'),

            self.train_dataset: pd.DataFrame = pd.read_csv(self.train_dataset_filename)
            self.model: DecisionTreeClassifier = pickle.load(open(self.cached_model_filename, mode='rb'))
    
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
    
    def update_retrain(self, new_record: pd.DataFrame, expected_target: np.ndarray) -> str:
        """
        Adds new_record to the previous saved records in the train dataset,
        retrains the model and therefore predicts the class.
        """
        # Updating the training set and caching it again.
        ActivityClassifier.__instance.train_dataset = ActivityClassifier.__instance.train_dataset.append(new_record)
        ActivityClassifier.__instance.train_dataset.to_csv(self.train_dataset_filename)
        
    
    def predict(self, new_record: pd.DataFrame) -> str:
        """
        Predicts the target class for the given new_record.
        """
        # One-hot encoding of the har column.
        ha_cols = pd.get_dummies(new_record["human_activity"], prefix="human_activity")
        new_record.drop(["human_activity"], axis=1, inplace=True)
        X = pd.concat([new_record, ha_cols], axis=1)

        # Prediction
        y = ActivityClassifier.__instance.model.predict(X)
        predicted_class_index = np.argmax(y)

        return ActivityClassifier.targets_list[predicted_class_index]
        
