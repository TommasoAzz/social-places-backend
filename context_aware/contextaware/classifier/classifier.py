from _typeshed import OpenTextMode
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
import pickle

class Classifier:
    class __Classifier:
        def __init__(self, cached_model_filename: str, train_dataset_filename: str) -> None:
            self.cached_model_filename: str = cached_model_filename
            self.train_dataset_filename: str = train_dataset_filename

            self.update_state()
        
        def update_state(self):
            self.train_dataset: pd.DataFrame = pd.read_csv(self.train_dataset_filename)
            self.model: DecisionTreeClassifier = pickle.load(open(self.cached_model_filename, mode='rb'))
    
    __instance = None
    targets_list = ("leisure", "restaurants", "sport")

    def __init__(self, cached_model_filename: str, train_dataset_filename: str) -> None:
        self.cached_model_filename: str = cached_model_filename
        self.train_dataset_filename: str = train_dataset_filename
        
        if not Classifier.__instance:
            Classifier.__instance = Classifier.__Classifier(cached_model_filename, train_dataset_filename)
        else:
            Classifier.__instance.cached_model_filename = cached_model_filename
            Classifier.__instance.train_dataset_filename = train_dataset_filename
            Classifier.__instance.update_state()
    
    def update_retrain(self, new_record: pd.DataFrame, expected_target: np.ndarray) -> str:
        """
        Adds new_record to the previous saved records in the train dataset,
        retrains the model and therefore predicts the class.
        """
        # Updating the training set and caching it again.
        Classifier.__instance.train_dataset = Classifier.__instance.train_dataset.append(new_record)
        Classifier.__instance.train_dataset.to_csv(self.train_dataset_filename)
        
    
    def predict(self, new_record: pd.DataFrame) -> str:
        """
        Predicts the target class for the given new_record.
        """
        prediction_result = Classifier.__instance.model.predict(new_record)
        predicted_class_index = np.argmax(prediction_result)

        return Classifier.targets_list[predicted_class_index]
