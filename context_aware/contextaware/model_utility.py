import pickle
from numpy.lib.npyio import save
import pandas as pd
from pandas.core.frame import DataFrame
from imblearn.over_sampling import RandomOverSampler
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
import numpy as np

OVERSAMPLER = RandomOverSampler(sampling_strategy='minority', random_state=17)

SAVED_MODEL_FILE = "model/model.sav"
DATASET_FILE = "model/dataset.csv"



model = pickle.load(open(SAVED_MODEL_FILE, 'rb'))

cols_to_drop = ["lat_centroid","lon_centroid","cluster_index","place_name","google_place_id","place_address","place_category","place_type","place_lat","place_lon","distance_to_centroid","time_of_arrival","category_id"]
#####################

# load and save model function
def load_model():
    model = pickle.load(open(SAVED_MODEL_FILE, 'rb'))

def save_model():
    global model
    """
    Saves a .sav file containing the model.
    """
    pickle.dump(model, open(SAVED_MODEL_FILE, 'wb'))

# end load and save model function

#####################

#####################
# TRAIN MODEL FUNCTION


# Function called from python server to retrain model
def retrain_model(new_row: DataFrame):
    new_dataset(new_row)
    new_train()
    save_model()

# Append new row to dataset
def new_dataset(new_row: DataFrame):
    """
        This will receive a row with:
        lat_centroid,lon_centroid,cluster_index,place_name,google_place_id,place_address,place_category,
        place_type,place_lat,
        place_lon,distance_to_centroid,time_of_arrival,time_of_day,day_of_week,har

    """
    old_dataset = pd.read_csv(DATASET_FILE)
    old_dataset = old_dataset.append(new_row)
    old_dataset.to_csv(DATASET_FILE,index=False)

def new_train():
    har_dataset = pd.read_csv(DATASET_FILE)
    y_original = har_dataset.pop("place_category")
    X_original = har_dataset.drop(cols_to_drop, axis=1)

    X_oversampled, y_oversampled = oversample(X_original, y_original)

    # do dummy encoding
    har_cols = pd.get_dummies(X_oversampled["har"], prefix="har")
    one_hot_place_category = OneHotEncoder().fit_transform(y_oversampled.values.reshape(-1,1)).toarray()

    X_oversampled.drop(["har"], axis=1, inplace=True)
    X = pd.concat([X_oversampled, har_cols], axis=1)
    y = one_hot_place_category

    train_tree(X, y)

def train_tree(X,y):
    
    global model

    # Fitting
    model = model.fit(X, y)


def oversample(X: pd.DataFrame, y: np.ndarray) -> tuple:
    global OVERSAMPLER

    # fit and apply the transformation for oversampling
    X_oversampled, y_oversampled = OVERSAMPLER.fit_resample(X, y)

    return X_oversampled, y_oversampled

#####################



