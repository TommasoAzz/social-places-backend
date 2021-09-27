#!/usr/bin/env python3

from context_aware.contextaware.classifier.classifier import Classifier
from flask import Flask, request, jsonify
from datetime import datetime
import pandas as pd
from os.path import join
from model_utility import model

app = Flask(__name__)

@app.route("/recommendation/places", methods=["GET"])
def recommend_places():
    """
    Returns the recommended places (points of interest) to visit at the given parameters found as arguments.
    """
    # Arguments
    human_activity = request.args.get('human_activity')
    date_time = request.args.get('date_time')

    # Arguments preprocessing
    #REPLACE '+' WITH %2b before the req
    date_time = datetime.strptime(date_time, '%Y-%m-%d %H:%M:%S%z')
    seconds = (date_time.hour * 3600) + (date_time.minute * 60) + date_time.second
    # 0 = Monday, 6 = Sunday
    day_of_week = date_time.weekday()
    # time_of_day,day_of_week,har
    new_record = pd.DataFrame(columns=["time_of_day", "day_of_week", "har"])
    new_record.loc[0] = [seconds, day_of_week, human_activity]
    
    predicted_activity = Classifier.predict(new_record)
    json_res = {
        "category_response": predicted_activity
    }
    return json_res


# @app.route("/recommendation/validity", methods="POST")
# def other():
#     """
#     Returns whether the user should perform or not certain activities given a possible activity.
#     """
#     pass


# @app.route("/recommendation/train", methods=["POST"])
# def train_again_model():
#     """
#     Train again model.
#     """
#     pass

if __name__ == "__main__":
    # Instanciating the singleton Classifier.
    Classifier(
        cached_model_filename = join('classifier', 'model.sav'),
        train_dataset_filename = join('classifier', 'dataset.csv')
    )
    app.run("0.0.0.0", 4000)