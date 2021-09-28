from __future__ import annotations
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np
from os.path import join
from pandas.core.indexes.base import Index
from sklearn.tree import DecisionTreeClassifier
from imblearn.over_sampling import RandomOverSampler
from sklearn.preprocessing import OneHotEncoder
from typing import Tuple
import pickle

class ActivityClassifier:
    
    def __init__(self) -> None:
        # self.cached_model_filename: str = "contextaware/classifier/model.sav"
        self.cached_model_filename: str = "classifier/model.sav"
        # self.train_dataset_filename: str = "contextaware/classifier/dataset.csv"
        self.train_dataset_filename: str = "classifier/dataset.csv"
        self.train_dataset: pd.DataFrame = pd.read_csv(self.train_dataset_filename)
        self.model: DecisionTreeClassifier = pickle.load(open(self.cached_model_filename, mode='rb'))
        self.oversampler = RandomOverSampler(sampling_strategy='minority', random_state=17)
        ActivityClassifier.columns_list = self.train_dataset.columns


    #__instance: __Classifier = None
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

    """ 
    def get_instance() -> ActivityClassifier:
        
        Returns an instance of this class.
        
        if not ActivityClassifier.__instance:
            ActivityClassifier.__instance = ActivityClassifier.__Classifier()
            ActivityClassifier.columns_list = ActivityClassifier.__instance.train_dataset.columns

        return ActivityClassifier.__instance
    """

    def __get_dummies_human_activity(self,X: pd.DataFrame) -> pd.DataFrame:
        """
        One-hot encodes the human_activity column (from one column with categorical values from human_activities
        to five columns, each one representing an element of human_activities.
        """
        har_cols = pd.get_dummies(X["human_activity"], prefix="human_activity")
        X.drop(["human_activity"], axis=1, inplace=True)
        X = pd.concat([X, har_cols], axis=1)
        return X


    def __one_hot_encode_target(self,y: pd.Series) -> pd.Series:
        """
        One-hot encodes the target column (from one column with categorical values from targets_list to
        a three column matrix, each one representing an element of targets_list).
        """
        return OneHotEncoder().fit_transform(y.values.reshape(-1,1)).toarray()

    
    def __save_model(self):
        """
        Saves the current instance of the model to a binary file.
        """
        with open(self.cached_model_filename, 'wb') as model_file:
            pickle.dump(self.model, model_file)

    def __load_model(self):
        """
        Loads the current instance of the model from a binary file.
        """
        with open(self.cached_model_filename, 'rb') as model_file:
            self.model = pickle.load(model_file)


    def update_retrain(self, new_record: pd.DataFrame):
        """
        Adds new_record to the previous saved records in the train dataset,
        retrains the model and therefore predicts the class.
        """
        # Updating the training set and caching it again.
        self.train_dataset = self.train_dataset.append(new_record)
        self.train_dataset.to_csv(self.train_dataset_filename,index=False)
        # Separating X and y
        dataset_copy = self.train_dataset.copy()
        y_original = dataset_copy.pop("place_category")
        X_original = dataset_copy
        # Oversampling
        X_oversampled, y_oversampled = self.oversampler.fit_resample(X_original, y_original)
        # One hot encoding columns human_activity and place_category (target or y).
        X = self.__get_dummies_human_activity(X_oversampled)
        y = self.__one_hot_encode_target(y_oversampled)
        print(X)
        self.model = self.model.fit(X, y)

        self.__save_model()
        
    
    def predict(self, new_record: pd.DataFrame) -> str:
        """
        Predicts the target class for the given new_record.
        """
        # One-hot encoding of the har column.
        # X = self.__get_dummies_human_activity(new_record)
        X = new_record
        # Prediction
        y = self.model.predict(X)
        predicted_class_index = np.argmax(y)

        return ActivityClassifier.targets_list[predicted_class_index]

    def test_model(self) -> dict:
        """
        Save the old model and test it on actual dataset
        """
        # Separating X and y
        dataset_copy = self.train_dataset.copy()
        y_original = dataset_copy.pop("place_category")
        X_original = dataset_copy
        # Oversampling
        X_oversampled, y_oversampled = self.oversampler.fit_resample(X_original, y_original)
        # One hot encoding columns human_activity and place_category (target or y).
        X = self.__get_dummies_human_activity(X_oversampled)
        y = self.__one_hot_encode_target(y_oversampled)

        X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.80, test_size=0.20, random_state=17)


        testing_model = self.model.fit(X_train, y_train)

        y_pred = testing_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        number_correct_samples = accuracy_score(y_test, y_pred, normalize=False)
        print("ACCURACY ",accuracy)
        train_result = {
            "accuracy":accuracy,
            "number_correct_samples":number_correct_samples
        }
        print(train_result)
        return accuracy
        
