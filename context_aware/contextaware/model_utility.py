import pickle
import pandas as pd

SAVED_MODEL_FILE = "model/model.sav"
DATASET_FILE = "model/dataset.csv"



model = pickle.load(open(SAVED_MODEL_FILE, 'rb'))


def load_model():
    model = pickle.load(open(SAVED_MODEL_FILE, 'rb'))


def retrain_model(new_row):
    global model

    y = new_row.pop("place_category")
    model = model.fit(new_row,y)




"""
# from imblearn.over_sampling import RandomOverSampler
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import OneHotEncoder

#cols_to_drop = ["lat_centroid","lon_centroid","cluster_index","place_name","google_place_id","place_address","place_category","place_type","place_lat","place_lon","distance_to_centroid","time_of_arrival","category_id"]
# OVERSAMPLER = RandomOverSampler(sampling_strategy='minority', random_state=17)

    #new_dataset(new_row)
    #new_train()
def oversample(X: pd.DataFrame, y: np.ndarray) -> tuple:
    global OVERSAMPLER

    # fit and apply the transformation for oversampling
    X_oversampled, y_oversampled = OVERSAMPLER.fit_resample(X, y)

    return X_oversampled, y_oversampled

def train_tree(har_dataset):
    # print(cols_to_drop)
    global model

    # Splitting the dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.70, test_size=0.30, random_state=17)

    # Fitting
    model = model.fit(X_train, y_train)

    # Predicting
    y_pred = model.predict(X_test)

    return y_test, y_pred

def new_dataset(new_row):
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

    y_test, y_pred = train_tree(X, y)
"""